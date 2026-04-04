/**
 * MENTE.AI — Serviço de Desbloqueio de Agentes (Fase 2)
 * src/lib/unlock-agent.ts
 *
 * Verifica se um usuário pode acessar um agente com base em:
 *   1. agentMetadata.bloqueadoPorPadrao + requisitosDesbloqueio
 *   2. userAgentProgress.desbloqueado (desbloqueio explícito já feito)
 *   3. userXp.xpTotal (XP mínimo necessário)
 *   4. Agentes pré-requisito completados
 *
 * NOTA: Esta é uma função server-side, NÃO o middleware.ts (que é Edge Runtime
 * e não pode acessar o banco). Deve ser chamada dentro de route handlers.
 *
 * Uso em route.ts:
 *   const unlock = await checkAgentUnlock(userId, agentId);
 *   if (!unlock.liberado) return NextResponse.json({ error: unlock.dica }, { status: 403 });
 */

import { db } from "@/lib/db";
import { agentMetadata, userAgentProgress, userXp } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import type { RequisitosDesbloqueio } from "@/lib/db/schema";

// ─── Tipos de resposta ────────────────────────────────────────────────────────

export interface ResultadoDesbloqueio {
  /** true se o usuário pode acessar o agente */
  liberado: boolean;
  /** Código de motivo do bloqueio (para o frontend tomar decisão de UI) */
  motivoBloqueio?: "XP_INSUFICIENTE" | "AGENTE_PREREQUISITO" | "BADGE_NECESSARIA" | "FASE_BLOQUEADA";
  /** Mensagem amigável para exibir ao usuário */
  dica?: string;
  /** XP adicional necessário (se motivoBloqueio === 'XP_INSUFICIENTE') */
  xpFaltando?: number;
  /** IDs dos agentes pré-requisito não concluídos */
  agentesPreRequisito?: string[];
}

// ─── Verificação principal ────────────────────────────────────────────────────

/**
 * Verifica se o usuário `userId` pode acessar o agente `agentId`.
 * Retorna imediatamente `liberado: true` se o agente não for bloqueado por padrão.
 */
export async function checkAgentUnlock(
  userId: number,
  agentId: string,
): Promise<ResultadoDesbloqueio> {

  // ── 1. Buscar metadata do agente ─────────────────────────────────────────────
  const [meta] = await db
    .select()
    .from(agentMetadata)
    .where(eq(agentMetadata.agentId, agentId))
    .limit(1);

  // Agente sem metadata = Fase 1 (desbloqueado por padrão)
  if (!meta || !meta.bloqueadoPorPadrao) {
    return { liberado: true };
  }

  // ── 2. Verificar se já foi desbloqueado explicitamente para este usuário ─────
  const [progresso] = await db
    .select()
    .from(userAgentProgress)
    .where(and(eq(userAgentProgress.userId, userId), eq(userAgentProgress.agentId, agentId)))
    .limit(1);

  if (progresso?.desbloqueado) {
    return { liberado: true };
  }

  // ── 3. Avaliar requisitos de desbloqueio ─────────────────────────────────────
  const requisitos = (meta.requisitosDesbloqueio ?? {}) as RequisitosDesbloqueio;

  // 3a. Verificar XP mínimo
  if (requisitos.xpMinimo && requisitos.xpMinimo > 0) {
    const [xpUsuario] = await db
      .select({ xpTotal: userXp.xpTotal })
      .from(userXp)
      .where(eq(userXp.userId, userId))
      .limit(1);

    const xpAtual = xpUsuario?.xpTotal ?? 0;
    if (xpAtual < requisitos.xpMinimo) {
      const xpFaltando = requisitos.xpMinimo - xpAtual;
      return {
        liberado: false,
        motivoBloqueio: "XP_INSUFICIENTE",
        xpFaltando,
        dica: `Você precisa de mais ${xpFaltando} XP para desbloquear ${agentId.toUpperCase()}. Continue interagindo com outros agentes!`,
      };
    }
  }

  // 3b. Verificar agentes pré-requisito
  const agentesRequisito = requisitos.agentesCompletos ?? [];
  if (agentesRequisito.length > 0) {
    const progressosRequisito = await db
      .select({ agentId: userAgentProgress.agentId, completadoEm: userAgentProgress.completadoEm })
      .from(userAgentProgress)
      .where(
        and(
          eq(userAgentProgress.userId, userId),
          inArray(userAgentProgress.agentId, agentesRequisito),
        ),
      );

    const agentesCompletos = new Set(
      progressosRequisito.filter((p) => p.completadoEm !== null).map((p) => p.agentId),
    );

    const agentesNaoConcluidos = agentesRequisito.filter((id) => !agentesCompletos.has(id));
    if (agentesNaoConcluidos.length > 0) {
      return {
        liberado: false,
        motivoBloqueio: "AGENTE_PREREQUISITO",
        agentesPreRequisito: agentesNaoConcluidos,
        dica: `Conclua primeiro: ${agentesNaoConcluidos.map((id) => id.toUpperCase()).join(", ")}`,
      };
    }
  }

  // 3c. Verificar fase (reservado para Fase 3+, hoje retorna bloqueado)
  if ((requisitos.faseMinima ?? 1) > 2) {
    return {
      liberado: false,
      motivoBloqueio: "FASE_BLOQUEADA",
      dica: `Este agente estará disponível em uma fase futura do MENTE.AI.`,
    };
  }

  // ── 4. Todos os requisitos satisfeitos → liberar ──────────────────────────────
  return { liberado: true };
}

// ─── Helper: desbloquear agente e emitir evento XP ───────────────────────────

/**
 * Registra o desbloqueio de um agente e dispara o evento XP correspondente.
 * Idempotente: não duplica o evento se o agente já estava desbloqueado.
 */
export async function unlockAgent(
  userId: number,
  agentId: string,
): Promise<{ desbloqueado: boolean; jaEraDesbloqueado: boolean }> {
  const [progresso] = await db
    .select()
    .from(userAgentProgress)
    .where(and(eq(userAgentProgress.userId, userId), eq(userAgentProgress.agentId, agentId)))
    .limit(1);

  if (progresso?.desbloqueado) {
    return { desbloqueado: true, jaEraDesbloqueado: true };
  }

  // Importa o webhook apenas aqui para evitar ciclo de dependência
  const { emitXpEvent } = await import("@/lib/xp-webhook");
  await emitXpEvent({ userId, tipo: "AGENTE_DESBLOQUEADO", metadata: { agentId } });

  return { desbloqueado: true, jaEraDesbloqueado: false };
}
