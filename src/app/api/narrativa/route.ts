/**
 * /api/narrativa — Motor de Narrativa Adaptativa (Fase MENTE.AI)
 *
 * Entregáveis desta rota:
 * 1) Tabela userProfile alimentada em tempo real
 * 2) Tabela interactiveDecisions registrada por decisão
 * 3) Roteamento de 6 arquétipos com saída NEXUS -> VOLT/AXIOM
 * 4) Backtracking automático quando há estagnação
 */

import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interactiveDecisions, universeTransitions, userProfile, type UserProfileAgentHistoryEntry } from "@/lib/db/schema";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { computeAdaptiveRoute } from "@/lib/narrativa/adaptive-routing-engine";
import { gerarPromptDoAgente } from "@/lib/narrativa/dimension-router";
import { profileInteraction } from "@/engine/profiler";
import { buildTransitionSeed } from "@/lib/narrativa/transition-seed";
import type { PerfilId } from "@/types/narrativa";
import type { UniversoId } from "@/data/universos";

interface NarrativaRequest {
  mensagem: string;
  perfilAtual?: PerfilId | null;
  fase?: number;
  historico?: string[];
  agenteAtual?: UniversoId | "axiom";
  episodeId?: number;
  seriesId?: number;
  choiceId?: string;
  choiceLabel?: string;
}

async function getAuthenticatedUserId(req: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(req);
  if (!token) return null;
  const payload = await verifyToken(token);
  const userId = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

function normalizeAgentIdForClient(agentId: UniversoId): string {
  if (agentId === "axim") return "axiom";
  return agentId;
}

function numericOrFallback(value: unknown, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body: NarrativaRequest = await req.json();
    const { mensagem, perfilAtual, fase = 1, historico = [] } = body;

    if (!mensagem?.trim()) {
      return NextResponse.json({ error: "Mensagem obrigatória." }, { status: 400 });
    }

    const userId = await getAuthenticatedUserId(req);
    const choiceId = body.choiceId?.trim() || `msg-${Date.now()}`;
    const choiceLabel = body.choiceLabel?.trim() || mensagem.slice(0, 255);
    const agenteAtual: UniversoId =
      body.agenteAtual === "axiom" ? "axim" : ((body.agenteAtual as UniversoId | undefined) ?? "nexus");

    let dimensaoEmocionalAtual = 0;
    let dimensaoIntelectualAtual = 0;
    let dimensaoMoralAtual = 0;
    let agentHistory: UserProfileAgentHistoryEntry[] = [];
    let decisionsRecentes: { choiceId: string; choiceLabel: string }[] = [];

    if (userId) {
      const [existingProfile] = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, userId))
        .limit(1);

      if (existingProfile) {
        dimensaoEmocionalAtual = existingProfile.dimensaoEmocional;
        dimensaoIntelectualAtual = existingProfile.dimensaoIntelectual;
        dimensaoMoralAtual = existingProfile.dimensaoMoral;
        agentHistory = existingProfile.agentHistory ?? [];
      }

      const recentDecisions = await db
        .select({
          choiceId: interactiveDecisions.choiceId,
          choiceLabel: interactiveDecisions.choiceLabel,
        })
        .from(interactiveDecisions)
        .where(eq(interactiveDecisions.userId, userId))
        .orderBy(desc(interactiveDecisions.id))
        .limit(8);

      decisionsRecentes = recentDecisions.reverse();
    }

    const profiled = profileInteraction({
      texto: mensagem,
      escolha: choiceLabel,
      historico,
      escolhasRecentes: decisionsRecentes.map((d) => d.choiceLabel),
      dimensoesAtuais: {
        emocional: dimensaoEmocionalAtual,
        intelectual: dimensaoIntelectualAtual,
        moral: dimensaoMoralAtual,
      },
    });

    const adaptiveRoute = computeAdaptiveRoute({
      mensagem,
      historico,
      fase,
      agenteAtual,
      perfilAtual: perfilAtual ?? null,
      dimensaoEmocionalAtual: profiled.dimensoes.emocional,
      dimensaoIntelectualAtual: profiled.dimensoes.intelectual,
      dimensaoMoralAtual: profiled.dimensoes.moral,
      decisionsRecentes,
      agentHistory,
    });

    const ultimaFalaSemente = buildTransitionSeed(agenteAtual, adaptiveRoute.agentePrimario);

    const promptSistema = gerarPromptDoAgente(
      adaptiveRoute.agentePrimario,
      adaptiveRoute.perfilDetectado,
      adaptiveRoute.dimensaoDetectada,
    );

    if (userId) {
      const decisionPayload = {
        userId,
        episodeId: numericOrFallback(body.episodeId, 0),
        seriesId: numericOrFallback(body.seriesId, 0),
        choiceId,
        choiceLabel,
        narrativeResponse: adaptiveRoute.justificativa,
        graphState: {
          perfil: adaptiveRoute.perfilDetectado,
          dimensao: adaptiveRoute.dimensaoDetectada,
          agentePrimario: adaptiveRoute.agentePrimario,
          backtrackingAplicado: adaptiveRoute.backtrackingAplicado,
        },
        decisionPath: adaptiveRoute.thoughtCandidates,
      };

      await db.insert(interactiveDecisions).values(decisionPayload);

      const newHistoryEntry: UserProfileAgentHistoryEntry = {
        agentId: adaptiveRoute.agentePrimario,
        archetype: adaptiveRoute.perfilDetectado,
        dimensao: adaptiveRoute.dimensaoDetectada,
        choiceId,
        choiceLabel,
        dimensaoEmocional: adaptiveRoute.dimensaoEmocional,
        dimensaoIntelectual: adaptiveRoute.dimensaoIntelectual,
        dimensaoMoral: adaptiveRoute.dimensaoMoral,
        backtrackingApplied: adaptiveRoute.backtrackingAplicado,
        timestamp: new Date().toISOString(),
      };

      const nextHistory = [...agentHistory.slice(-19), newHistoryEntry];

      await db
        .insert(userProfile)
        .values({
          userId,
          dimensaoEmocional: adaptiveRoute.dimensaoEmocional,
          dimensaoIntelectual: adaptiveRoute.dimensaoIntelectual,
          dimensaoMoral: adaptiveRoute.dimensaoMoral,
          agentHistory: nextHistory,
          updatedAt: new Date(),
        })
        .onDuplicateKeyUpdate({
          set: {
            dimensaoEmocional: adaptiveRoute.dimensaoEmocional,
            dimensaoIntelectual: adaptiveRoute.dimensaoIntelectual,
            dimensaoMoral: adaptiveRoute.dimensaoMoral,
            agentHistory: nextHistory,
            updatedAt: new Date(),
          },
        });

      await db.insert(universeTransitions).values({
        userId,
        episodeId: numericOrFallback(body.episodeId, 0),
        seriesId: numericOrFallback(body.seriesId, 0),
        fromAgent: adaptiveRoute.agenteOrigem,
        toAgent: adaptiveRoute.agentePrimario,
        reason: adaptiveRoute.backtrackingReason ?? "routing",
        transitionNarrative: adaptiveRoute.narrativaTransicao,
        metadata: {
          backtrackingAplicado: adaptiveRoute.backtrackingAplicado,
          thoughtCandidates: adaptiveRoute.thoughtCandidates,
        },
      });
    }

    return NextResponse.json({
      dimensaoDetectada: adaptiveRoute.dimensaoDetectada,
      perfilDetectado: adaptiveRoute.perfilDetectado,
      arquetipoClassificado: adaptiveRoute.perfilDetectado,
      agentePrimario: adaptiveRoute.agentePrimario,
      agentePrimarioCanonico: normalizeAgentIdForClient(adaptiveRoute.agentePrimario),
      agentesSecundarios: adaptiveRoute.agentesSecundarios,
      promptSistema,
      ultimaFalaSemente,
      narrativaTransicao: adaptiveRoute.narrativaTransicao,
      justificativa: adaptiveRoute.justificativa,
      backtrackingAplicado: adaptiveRoute.backtrackingAplicado,
      thoughtCandidates: adaptiveRoute.thoughtCandidates,
      dimensaoEmocional: adaptiveRoute.dimensaoEmocional,
      dimensaoIntelectual: adaptiveRoute.dimensaoIntelectual,
      dimensaoMoral: adaptiveRoute.dimensaoMoral,
      xpGanho: adaptiveRoute.backtrackingAplicado ? 20 : 15,
    });
  } catch (error) {
    console.error("[API /api/narrativa] Erro:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    descricao: "API do Motor de Narrativa Adaptativa MENTE.AI",
    uso: "POST com { mensagem, perfilAtual?, fase?, historico?, agenteAtual?, episodeId?, seriesId?, choiceId?, choiceLabel? }",
    dimensoes: ["D1_EMOCIONAL", "D2_INTELECTUAL", "D3_MORAL"],
    entregaveis: [
      "Tabela userProfile no TiDB",
      "Tabela interactiveDecisions registrada por interação",
      "Tabela universeTransitions registrada por transição",
      "Roteamento de 6 arquétipos",
      "NEXUS -> VOLT ou AXIOM",
      "Backtracking automático",
    ],
  });
}

