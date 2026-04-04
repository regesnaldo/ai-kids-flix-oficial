/**
 * MENTE.AI — Sistema Central de Eventos XP (Fase 2)
 * src/lib/xp-webhook.ts
 *
 * Responsabilidades:
 *  1. Recebe eventos tipados de XP (AGENTE_INTERACAO, COMBINACAO_DESCOBERTA, etc.)
 *  2. Executa transação Drizzle ATÔMICA: userXp + userAgentProgress simultaneamente
 *  3. Verifica conquistas (badges) após cada ganho de XP
 *  4. Retorna XpEventResult com todos os dados para o chamador usar (SSE / resposta JSON)
 *
 * DESIGN: Não usa cache global (incompatível com serverless Vercel).
 * O chamador (route handler) decide como propagar o resultado para o cliente.
 */

import { db } from "@/lib/db";
import { userXp, userAgentProgress } from "@/lib/db/schema";
import { XP_REWARDS } from "@/lib/xp";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import {
  logXPGain,
  logBadgeEarned,
  logStreakUpdate,
  logError,
} from "@/lib/gamification-logger";

// ─── Tipos de eventos ──────────────────────────────────────────────────────────

export type XpEventType = keyof typeof XP_REWARDS;

/** Metadata opcional por tipo de evento */
interface XpEventMetadata {
  agentId?: string;          // Obrigatório em eventos de agente
  combinationId?: string;    // Obrigatório em eventos de combinação
  duracaoSegundos?: number;  // Duração da interação (métricas)
}

export interface XpEvent {
  userId: number;
  tipo: XpEventType;
  metadata?: XpEventMetadata;
}

/** Resultado retornado ao chamador após processar o evento */
export interface XpEventResult {
  sucesso: boolean;
  xpGanho: number;
  xpTotalAtualizado: number;
  xpSemanaAtualizado: number;
  streakDias: number;
  badgesDesbloqueadas: string[];
  /** Novo nível de interação com o agente (0-5), se aplicável */
  nivelInteracaoAgente?: number;
  /** true se o agente foi concluído neste evento */
  agenteConcluido?: boolean;
  erro?: string;
}

// ─── Constantes de gamificação ────────────────────────────────────────────────

/** Interações necessárias para cada nível de relacionamento com um agente */
const NIVEL_INTERACAO_THRESHOLDS = [0, 2, 5, 10, 20, 35] as const; // nível 0-5

/** Regras de badges: id → condição avaliada sobre XP total */
const REGRAS_BADGES: { id: string; label: string; xpNecessario: number }[] = [
  { id: "explorador",    label: "Explorador",          xpNecessario: 50   },
  { id: "aprendiz",      label: "Aprendiz da IA",       xpNecessario: 150  },
  { id: "conector",      label: "Conector de Agentes",  xpNecessario: 300  },
  { id: "investigador",  label: "Investigador",         xpNecessario: 500  },
  { id: "mestre",        label: "Mestre MENTE.AI",      xpNecessario: 1000 },
];

// ─── Helpers internos ─────────────────────────────────────────────────────────

function getMondayAtual(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

function calcularNivelInteracao(interacoesTotal: number): number {
  for (let nivel = NIVEL_INTERACAO_THRESHOLDS.length - 1; nivel >= 0; nivel--) {
    if (interacoesTotal >= NIVEL_INTERACAO_THRESHOLDS[nivel]) return nivel;
  }
  return 0;
}

function verificarBadgesDesbloqueadas(xpAntes: number, xpDepois: number): string[] {
  return REGRAS_BADGES
    .filter((b) => xpAntes < b.xpNecessario && xpDepois >= b.xpNecessario)
    .map((b) => b.id);
}

// ─── Função principal: emitXpEvent ────────────────────────────────────────────

/**
 * Processa um evento XP em transação atômica.
 *
 * Para eventos de agente, atualiza TANTO userXp (global) QUANTO
 * userAgentProgress (por agente) no mesmo commit — sem risco de inconsistência.
 */
export async function emitXpEvent(evento: XpEvent): Promise<XpEventResult> {
  const { userId, tipo, metadata } = evento;
  const xpGanho = XP_REWARDS[tipo];
  const hoje = new Date().toISOString().split("T")[0];
  const monday = getMondayAtual();

  try {
    const resultado = await db.transaction(async (tx) => {
      // ── 1. Atualizar userXp (global) ────────────────────────────────────────
      const [xpAtual] = await tx
        .select()
        .from(userXp)
        .where(eq(userXp.userId, userId))
        .limit(1);

      let xpTotal: number;
      let xpThisWeek: number;
      let streakDias: number;

      if (!xpAtual) {
        // Primeiro evento do usuário
        await tx.insert(userXp).values({
          id: crypto.randomUUID(),
          userId,
          xpTotal: xpGanho,
          xpThisWeek: xpGanho,
          streakDays: 1,
          lastActivityDate: hoje,
          weekStartDate: monday,
        });
        xpTotal = xpGanho;
        xpThisWeek = xpGanho;
        streakDias = 1;
      } else {
        const lastDate = xpAtual.lastActivityDate ?? null;
        const diffDias = lastDate
          ? Math.floor((new Date(hoje).getTime() - new Date(lastDate).getTime()) / 86_400_000)
          : 999;

        streakDias = diffDias === 0 ? (xpAtual.streakDays ?? 1)
                   : diffDias === 1 ? (xpAtual.streakDays ?? 0) + 1
                   : 1;

        const semanaResetou = xpAtual.weekStartDate !== monday;
        xpTotal    = (xpAtual.xpTotal ?? 0) + xpGanho;
        xpThisWeek = semanaResetou ? xpGanho : (xpAtual.xpThisWeek ?? 0) + xpGanho;

        await tx
          .update(userXp)
          .set({ xpTotal, xpThisWeek, streakDays: streakDias, lastActivityDate: hoje, weekStartDate: monday })
          .where(eq(userXp.userId, userId));
      }

      // ── 2. Atualizar userAgentProgress (por agente) — se aplicável ──────────
      let nivelInteracaoAgente: number | undefined;
      let agenteConcluido = false;

      const agentId = metadata?.agentId;
      const ehEventoDeAgente =
        tipo === "AGENTE_INTERACAO" ||
        tipo === "AGENTE_DESBLOQUEADO" ||
        tipo === "AGENTE_COMPLETADO";

      if (agentId && ehEventoDeAgente) {
        const [progressoAtual] = await tx
          .select()
          .from(userAgentProgress)
          .where(and(eq(userAgentProgress.userId, userId), eq(userAgentProgress.agentId, agentId)))
          .limit(1);

        if (!progressoAtual) {
          // Primeiro contato com este agente
          const eDesbloqueio = tipo === "AGENTE_DESBLOQUEADO";
          await tx.insert(userAgentProgress).values({
            id: crypto.randomUUID(),
            userId,
            agentId,
            desbloqueado: eDesbloqueio,
            desbloqueadoEm: eDesbloqueio ? new Date() : null,
            interacoesTotal: tipo === "AGENTE_INTERACAO" ? 1 : 0,
            xpGanho,
            nivelInteracao: 0,
          });
          nivelInteracaoAgente = 0;
        } else {
          const novasInteracoes =
            tipo === "AGENTE_INTERACAO"
              ? progressoAtual.interacoesTotal + 1
              : progressoAtual.interacoesTotal;

          const novoNivel = calcularNivelInteracao(novasInteracoes);
          const concluido = novasInteracoes >= NIVEL_INTERACAO_THRESHOLDS[5];

          const update: Partial<typeof userAgentProgress.$inferInsert> = {
            interacoesTotal: novasInteracoes,
            xpGanho: progressoAtual.xpGanho + xpGanho,
            nivelInteracao: novoNivel,
          };

          if (tipo === "AGENTE_DESBLOQUEADO" && !progressoAtual.desbloqueado) {
            update.desbloqueado = true;
            update.desbloqueadoEm = new Date();
          }
          if (concluido && !progressoAtual.completadoEm) {
            update.completadoEm = new Date();
            agenteConcluido = true;
          }

          await tx
            .update(userAgentProgress)
            .set(update)
            .where(eq(userAgentProgress.id, progressoAtual.id));

          nivelInteracaoAgente = novoNivel;
        }
      }

      // ── 3. Verificar badges desbloqueadas ────────────────────────────────────
      const xpAntes = xpTotal - xpGanho;
      const badges = verificarBadgesDesbloqueadas(xpAntes, xpTotal);

      // Logging estruturado
      logXPGain(
        {
          xpGanho,
          xpTotal,
          xpSemana: xpThisWeek,
          tipoEvento: evento.tipo,
          agentId: metadata?.agentId,
          combinationId: metadata?.combinationId,
        },
        userId,
      );

      if (badges.length > 0) {
        for (const badgeId of badges) {
          const badge = REGRAS_BADGES.find((b) => b.id === badgeId);
          if (badge) {
            logBadgeEarned(
              {
                badgeId,
                badgeLabel: badge.label,
                xpTotal,
              },
              userId,
            );
          }
        }
      }

      logStreakUpdate(
        {
          streakDias,
          ultimaAtividade: hoje,
        },
        userId,
      );

      return {
        xpTotal,
        xpThisWeek,
        streakDias,
        badges,
        nivelInteracaoAgente,
        agenteConcluido,
      };
    });

    return {
      sucesso: true,
      xpGanho,
      xpTotalAtualizado: resultado.xpTotal,
      xpSemanaAtualizado: resultado.xpThisWeek,
      streakDias: resultado.streakDias,
      badgesDesbloqueadas: resultado.badges,
      nivelInteracaoAgente: resultado.nivelInteracaoAgente,
      agenteConcluido: resultado.agenteConcluido,
    };

  } catch (erro) {
    console.error(`[xp-webhook] Falha ao processar evento ${tipo} para userId=${userId}:`, erro);
    return {
      sucesso: false,
      xpGanho: 0,
      xpTotalAtualizado: 0,
      xpSemanaAtualizado: 0,
      streakDias: 0,
      badgesDesbloqueadas: [],
      erro: erro instanceof Error ? erro.message : String(erro),
    };
  }
}
