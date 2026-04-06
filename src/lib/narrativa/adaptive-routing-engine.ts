import type { UniversoId } from "@/data/universos";
import type { UserProfileAgentHistoryEntry } from "@/lib/db/schema";
import { rotearAgente } from "@/lib/narrativa/dimension-router";
import { calcularConfiancaPerfil, detectarDimensao, detectarPerfilPorTexto } from "@/lib/narrativa/profile-detector";
import type { DimensaoId, PerfilId } from "@/types/narrativa";

interface DecisionResumo {
  choiceId: string;
  choiceLabel: string;
}

export interface AdaptiveRouteInput {
  mensagem: string;
  historico: string[];
  fase: number;
  agenteAtual: UniversoId;
  perfilAtual: PerfilId | null;
  dimensaoEmocionalAtual: number;
  dimensaoIntelectualAtual: number;
  dimensaoMoralAtual: number;
  decisionsRecentes: DecisionResumo[];
  agentHistory: UserProfileAgentHistoryEntry[];
}

interface ThoughtCandidate {
  step: "perfil" | "dimensao" | "roteamento" | "backtracking";
  score: number;
  note: string;
}

export interface AdaptiveRouteOutput {
  perfilDetectado: PerfilId;
  dimensaoDetectada: DimensaoId;
  agentePrimario: UniversoId;
  agentesSecundarios: UniversoId[];
  justificativa: string;
  backtrackingAplicado: boolean;
  backtrackingReason: "stagnation" | null;
  agenteOrigem: UniversoId;
  narrativaTransicao: string;
  thoughtCandidates: ThoughtCandidate[];
  dimensaoEmocional: number;
  dimensaoIntelectual: number;
  dimensaoMoral: number;
}

const MIN_DIMENSION = 0;
const MAX_DIMENSION = 100;

function clamp(value: number): number {
  return Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, Math.round(value)));
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function isStagnated(decisions: DecisionResumo[], agentHistory: UserProfileAgentHistoryEntry[]): boolean {
  if (decisions.length < 3 || agentHistory.length < 5) return false;

  const lastThreeChoices = decisions.slice(-3).map((d) => normalizeText(d.choiceLabel));
  const hasThreeIdenticalChoices =
    lastThreeChoices.length === 3 &&
    lastThreeChoices[0] === lastThreeChoices[1] &&
    lastThreeChoices[1] === lastThreeChoices[2];

  const lastFiveEmotional = agentHistory.slice(-5).map((h) => Number(h.dimensaoEmocional) || 0);
  const emotionalUnchanged =
    lastFiveEmotional.length === 5 &&
    lastFiveEmotional.every((value) => value === lastFiveEmotional[0]);

  return hasThreeIdenticalChoices && emotionalUnchanged;
}

function pickBacktrackingAgent(
  currentAgent: UniversoId,
  agentHistory: UserProfileAgentHistoryEntry[],
): UniversoId | null {
  for (let i = agentHistory.length - 1; i >= 0; i -= 1) {
    const historicalAgent = agentHistory[i]?.agentId as UniversoId | undefined;
    if (!historicalAgent) continue;
    if (historicalAgent !== currentAgent) return historicalAgent;
  }

  return null;
}

function adjustDimensions(
  dimensao: DimensaoId,
  baseline: { emocional: number; intelectual: number; moral: number },
  confidence: number,
  backtrackingApplied: boolean,
): { emocional: number; intelectual: number; moral: number } {
  const boost = backtrackingApplied ? 6 : 8;
  const decay = backtrackingApplied ? 1 : 2;
  const confidenceBonus = confidence >= 0.65 ? 2 : 0;

  const next = {
    emocional: baseline.emocional,
    intelectual: baseline.intelectual,
    moral: baseline.moral,
  };

  if (dimensao === "D1_EMOCIONAL") {
    next.emocional += boost + confidenceBonus;
    next.intelectual -= decay;
    next.moral -= decay;
  } else if (dimensao === "D2_INTELECTUAL") {
    next.intelectual += boost + confidenceBonus;
    next.emocional -= decay;
    next.moral -= decay;
  } else {
    next.moral += boost + confidenceBonus;
    next.emocional -= decay;
    next.intelectual -= decay;
  }

  return {
    emocional: clamp(next.emocional),
    intelectual: clamp(next.intelectual),
    moral: clamp(next.moral),
  };
}

function routeFromNexus(perfil: PerfilId, dimensao: DimensaoId): UniversoId {
  if (
    perfil === "rebelde-experimentador" ||
    perfil === "criativo-experimental" ||
    dimensao === "D1_EMOCIONAL"
  ) {
    return "volt";
  }

  return "axim";
}

export function computeAdaptiveRoute(input: AdaptiveRouteInput): AdaptiveRouteOutput {
  const contexto = [input.mensagem, ...input.historico].filter(Boolean).join(" \n ");

  const perfilDetectado = input.perfilAtual ?? detectarPerfilPorTexto(contexto);
  const dimensaoDetectada = detectarDimensao(contexto);
  const confiancaPerfil = calcularConfiancaPerfil([input.mensagem, ...input.historico], perfilDetectado);

  let rota = rotearAgente(perfilDetectado, dimensaoDetectada, input.fase);

  if (input.agenteAtual === "nexus") {
    const nextAfterNexus = routeFromNexus(perfilDetectado, dimensaoDetectada);
    rota = {
      agentePrimario: nextAfterNexus,
      agentesSecundarios: ["nexus", ...rota.agentesSecundarios.filter((agent) => agent !== nextAfterNexus)],
      justificativa: `Transicao canonica NEXUS -> ${nextAfterNexus.toUpperCase()} para continuidade narrativa.`,
    };
  }

  const shouldBacktrack = isStagnated(input.decisionsRecentes, input.agentHistory);
  let backtrackingAplicado = false;
  let backtrackingReason: "stagnation" | null = null;
  const agenteOrigem = rota.agentePrimario;
  let narrativaTransicao = `A próxima etapa abre com ${rota.agentePrimario.toUpperCase()}, mantendo a continuidade da jornada.`;

  if (shouldBacktrack) {
    const backtrackingAgent = pickBacktrackingAgent(rota.agentePrimario, input.agentHistory);
    if (backtrackingAgent) {
      backtrackingAplicado = true;
      backtrackingReason = "stagnation";
      rota = {
        agentePrimario: backtrackingAgent,
        agentesSecundarios: [rota.agentePrimario, ...rota.agentesSecundarios.filter((a) => a !== backtrackingAgent)],
        justificativa: `Retorno narrativo estratégico: ${backtrackingAgent.toUpperCase()} assume para oferecer nova perspectiva.`,
      };
      narrativaTransicao = `Mudamos o eixo da conversa para ${backtrackingAgent.toUpperCase()}, abrindo um novo ângulo de leitura para sua jornada.`;
    }
  }

  const dimensions = adjustDimensions(
    dimensaoDetectada,
    {
      emocional: input.dimensaoEmocionalAtual,
      intelectual: input.dimensaoIntelectualAtual,
      moral: input.dimensaoMoralAtual,
    },
    confiancaPerfil,
    backtrackingAplicado,
  );

  const thoughtCandidates: ThoughtCandidate[] = [
    {
      step: "perfil",
      score: Number(confiancaPerfil.toFixed(2)),
      note: `Perfil classificado como ${perfilDetectado}.`,
    },
    {
      step: "dimensao",
      score: 0.8,
      note: `Dimensao dominante detectada: ${dimensaoDetectada}.`,
    },
    {
      step: "roteamento",
      score: 0.9,
      note: `Agente primario selecionado: ${rota.agentePrimario}.`,
    },
    {
      step: "backtracking",
      score: backtrackingAplicado ? 0.95 : 0.35,
      note: backtrackingAplicado
        ? "Padrao repetitivo detectado com estagnação emocional. Retorno de agente ativado."
        : "Sem estagnacao relevante no historico recente.",
    },
  ];

  return {
    perfilDetectado,
    dimensaoDetectada,
    agentePrimario: rota.agentePrimario,
    agentesSecundarios: rota.agentesSecundarios,
    justificativa: rota.justificativa,
    backtrackingAplicado,
    backtrackingReason,
    agenteOrigem,
    narrativaTransicao,
    thoughtCandidates,
    dimensaoEmocional: dimensions.emocional,
    dimensaoIntelectual: dimensions.intelectual,
    dimensaoMoral: dimensions.moral,
  };
}
