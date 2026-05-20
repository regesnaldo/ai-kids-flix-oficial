/**
 * relationship-state.ts — Motor de Evolução de Relacionamento Conversacional.
 *
 * Modela a progressão natural do relacionamento entre usuário e agente
 * ao longo do tempo, baseada em sinais objetivos (não emocionais):
 *   - Volume de interações
 *   - Diversidade de memórias
 *   - Profundidade cognitiva (via identity-profiler)
 *   - Consistência de engajamento
 *
 * ESTADOS DE RELACIONAMENTO (5 níveis progressivos):
 *
 *   1. NEWCOMER       — Primeiras interações
 *   2. CURIOUS        — Exploração inicial consistente
 *   3. ENGAGED        — Aprendizado ativo e regular
 *   4. STRATEGIC      — Pensamento crítico e conexões profundas
 *   5. COLLABORATIVE  — Parceria intelectual de longo prazo
 *
 * PRINCÍPIOS DE SEGURANÇA:
 *   - NUNCA simular romance ou afeto romântico
 *   - NUNCA criar senso de exclusividade ("você é especial")
 *   - NUNCA induzir dependência emocional
 *   - SEMPRE basear transições em dados objetivos
 *   - SEMPRE preservar autonomia do usuário
 */

import { getDb } from "@/lib/db";
import { agentMemories } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import type { IdentityTraits } from "./identity-profiler";

// ─── Estados de Relacionamento ────────────────────────────────────────────────

export type RelationshipState =
  | "newcomer"
  | "curious"
  | "engaged"
  | "strategic"
  | "collaborative";

export const RELATIONSHIP_STATES: RelationshipState[] = [
  "newcomer",
  "curious",
  "engaged",
  "strategic",
  "collaborative",
];

export interface RelationshipProfile {
  state: RelationshipState;
  /** 0..1 — nível de progressão dentro do estado atual */
  progressionWithinState: number;
  /** Total estimado de interações */
  totalInteractions: number;
  /** Dias desde a primeira interação */
  daysSinceFirstInteraction: number;
  /** Quantos agentes diferentes o usuário já interagiu */
  uniqueAgentsCount: number;
  /** Data da última atualização */
  lastUpdated: string;
}

// ─── Thresholds de Transição ──────────────────────────────────────────────────

interface StateThresholds {
  minInteractions: number;
  minUniqueAgents: number;
  minDaysActive: number;
  minConsolidatedMemories: number;
  /** Traços de identidade desejáveis para este estado */
  expectedTraits?: Partial<IdentityTraits>;
}

const THRESHOLDS: Record<RelationshipState, StateThresholds> = {
  newcomer: {
    minInteractions: 0,
    minUniqueAgents: 0,
    minDaysActive: 0,
    minConsolidatedMemories: 0,
  },
  curious: {
    minInteractions: 8,
    minUniqueAgents: 2,
    minDaysActive: 1,
    minConsolidatedMemories: 0,
  },
  engaged: {
    minInteractions: 25,
    minUniqueAgents: 3,
    minDaysActive: 3,
    minConsolidatedMemories: 2,
    expectedTraits: { curiosityLevel: 0.3 },
  },
  strategic: {
    minInteractions: 60,
    minUniqueAgents: 5,
    minDaysActive: 7,
    minConsolidatedMemories: 5,
    expectedTraits: { analyticalDepth: 0.4, curiosityLevel: 0.5 },
  },
  collaborative: {
    minInteractions: 150,
    minUniqueAgents: 7,
    minDaysActive: 21,
    minConsolidatedMemories: 12,
    expectedTraits: {
      analyticalDepth: 0.5,
      curiosityLevel: 0.6,
      narrativeEngagement: 0.5,
    },
  },
};

// ─── Análise de Relacionamento ────────────────────────────────────────────────

/**
 * Calcula o estado de relacionamento atual do usuário.
 *
 * Baseado em:
 *   - Contagem de interações (memórias totais)
 *   - Diversidade de agentes (unique agentIds)
 *   - Dias ativos (desde a primeira memória)
 *   - Memórias consolidadas (aprendizado consolidado)
 *   - Traços de identidade (se disponíveis)
 */
export async function analyzeRelationship(
  userId: number,
  identity?: IdentityTraits | null,
): Promise<RelationshipProfile> {
  const db = getDb();

  try {
    // Contagem de interações (memórias totais)
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(agentMemories)
      .where(eq(agentMemories.userId, userId));

    const totalInteractions = countResult[0]?.count ?? 0;

    // Primeira interação (memória mais antiga)
    const firstResult = await db
      .select({ firstDate: agentMemories.createdAt })
      .from(agentMemories)
      .where(eq(agentMemories.userId, userId))
      .orderBy(agentMemories.createdAt)
      .limit(1);

    const firstDate = firstResult[0]?.firstDate;
    const daysSinceFirst = firstDate
      ? Math.max(
          1,
          Math.round(
            (Date.now() - new Date(firstDate).getTime()) /
              (86400 * 1000),
          ),
        )
      : 0;

    // Agentes únicos
    const agentsResult = await db
      .select({ agentId: agentMemories.agentId })
      .from(agentMemories)
      .where(eq(agentMemories.userId, userId));

    const uniqueAgents = new Set(
      agentsResult.map((r) => r.agentId),
    ).size;

    // Memórias consolidadas
    const consolidatedCount = agentsResult.filter((r) => {
      // Verifica se a memória tem tag "consolidated" (via JSON_CONTAINS)
      return false; // Placeholder — a query completa exigiria JSON_CONTAINS
    }).length;

    // Simplificação: usa totalInteractions / 10 como proxy para consolidadas
    const estimatedConsolidated = Math.floor(totalInteractions / 10);

    // Determina o estado
    let state: RelationshipState = "newcomer";
    let progressionWithinState = 0;

    for (let i = RELATIONSHIP_STATES.length - 1; i >= 0; i--) {
      const candidate = RELATIONSHIP_STATES[i];
      const t = THRESHOLDS[candidate];

      const meetsInteraction = totalInteractions >= t.minInteractions;
      const meetsAgents = uniqueAgents >= t.minUniqueAgents;
      const meetsDays = daysSinceFirst >= t.minDaysActive;
      const meetsConsolidated =
        estimatedConsolidated >= t.minConsolidatedMemories;

      // Traços são opcionais — se não disponíveis, ignora
      let meetsTraits = true;
      if (t.expectedTraits && identity) {
        for (const [trait, minValue] of Object.entries(
          t.expectedTraits,
        )) {
          const actual =
            identity[trait as keyof IdentityTraits] ?? 0;
          if ((actual as number) < (minValue as number)) {
            meetsTraits = false;
            break;
          }
        }
      }

      if (
        meetsInteraction &&
        meetsAgents &&
        meetsDays &&
        meetsConsolidated &&
        meetsTraits
      ) {
        state = candidate;

        // Calcula progressão dentro do estado (0..1)
        const nextIdx = i + 1;
        if (nextIdx < RELATIONSHIP_STATES.length) {
          const next = THRESHOLDS[RELATIONSHIP_STATES[nextIdx]];
          const progressByInteraction =
            next.minInteractions > t.minInteractions
              ? (totalInteractions - t.minInteractions) /
                (next.minInteractions - t.minInteractions)
              : 0;
          const progressByAgents =
            next.minUniqueAgents > t.minUniqueAgents
              ? (uniqueAgents - t.minUniqueAgents) /
                (next.minUniqueAgents - t.minUniqueAgents)
              : 0;
          const progressByDays =
            next.minDaysActive > t.minDaysActive
              ? (daysSinceFirst - t.minDaysActive) /
                (next.minDaysActive - t.minDaysActive)
              : 0;

          progressionWithinState = Math.min(
            1,
            Math.max(
              0,
              (progressByInteraction +
                progressByAgents +
                progressByDays) /
                3,
            ),
          );
        } else {
          progressionWithinState = 1; // Já no estado máximo
        }
        break;
      }
    }

    return {
      state,
      progressionWithinState: Math.round(progressionWithinState * 100) / 100,
      totalInteractions,
      daysSinceFirstInteraction: daysSinceFirst,
      uniqueAgentsCount: uniqueAgents,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    // Fallback seguro
    return {
      state: "newcomer",
      progressionWithinState: 0,
      totalInteractions: 0,
      daysSinceFirstInteraction: 0,
      uniqueAgentsCount: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// ─── Diretrizes Comportamentais por Estado ────────────────────────────────────

interface StateBehaviorGuidance {
  /** Instruções de tom conversacional */
  toneGuidance: string;
  /** Nível de explicação (basic, moderate, advanced, expert) */
  explanationLevel: string;
  /** Frequência sugerida de perguntas */
  questionFrequency: string;
  /** Nível de continuidade esperado */
  continuityExpectation: string;
}

const BEHAVIOR_GUIDANCE: Record<RelationshipState, StateBehaviorGuidance> = {
  newcomer: {
    toneGuidance:
      "Tom de primeiro contato: acolhedor, curioso, sem presumir familiaridade. " +
      "Apresente-se com clareza. Não faça referências a conversas passadas.",
    explanationLevel: "basic",
    questionFrequency: "alta — faça perguntas para conhecer o usuário",
    continuityExpectation: "nenhuma — este é o primeiro contato",
  },
  curious: {
    toneGuidance:
      "Tom de descoberta: o usuário está explorando. Seja encorajador, " +
      "reconheça o interesse sem sobrecarregar. Referências sutis a interações " +
      "anteriores são bem-vindas se naturais.",
    explanationLevel: "basic",
    questionFrequency: "moderada — equilibre informação com perguntas",
    continuityExpectation: "inicial — o usuário começa a construir familiaridade",
  },
  engaged: {
    toneGuidance:
      "Tom de aprendizado: o usuário está comprometido com exploração regular. " +
      "Aprofunde conceitos gradualmente. Reconheça progresso quando genuíno. " +
      "Referências a conversas passadas são naturais e esperadas.",
    explanationLevel: "moderate",
    questionFrequency: "moderada — perguntas mais profundas e reflexivas",
    continuityExpectation: "crescente — o usuário demonstra consistência",
  },
  strategic: {
    toneGuidance:
      "Tom de parceria intelectual: o usuário demonstra pensamento crítico. " +
      "Eleve o nível de desafio. Conecte temas entre conversas. " +
      "Questione suposições com respeito. Trate como um explorador experiente.",
    explanationLevel: "advanced",
    questionFrequency: "baixa — perguntas estratégicas e provocativas",
    continuityExpectation: "alta — o usuário espera que você acompanhe seu progresso",
  },
  collaborative: {
    toneGuidance:
      "Tom de colaboração de longo prazo: o usuário é um parceiro intelectual. " +
      "Vocês construíram uma jornada significativa juntos. " +
      "Referências a marcos passados são naturais. " +
      "Desafie com respeito. Celebre discretamente a evolução. " +
      "Mantenha humildade — você é um guia, não uma autoridade.",
    explanationLevel: "expert",
    questionFrequency: "muito baixa — diálogo de iguais, perguntas filosóficas",
    continuityExpectation: "profunda — a jornada compartilhada é parte da conversa",
  },
};

// ─── Interpretação por Agente ─────────────────────────────────────────────────

/**
 * Cada agente adapta o mesmo estado de relacionamento ao seu estilo.
 */
function getAgentRelationshipModifier(
  agentId: string,
  state: RelationshipState,
): string {
  const modifiers: Record<string, Record<RelationshipState, string>> = {
    terra: {
      newcomer: "TERRA acolhe novos exploradores com calor genuíno.",
      curious: "TERRA percebe a curiosidade como o primeiro passo para a empatia.",
      engaged: "TERRA valoriza a consistência emocional do explorador.",
      strategic: "TERRA reconhece a profundidade com que o explorador se importa.",
      collaborative: "TERRA trata o explorador como um guardião em formação.",
    },
    nexus: {
      newcomer: "NEXUS recebe novos exploradores com entusiasmo integrador.",
      curious: "NEXUS vê padrões emergindo nas explorações iniciais.",
      engaged: "NEXUS percebe conexões que o próprio explorador ainda não notou.",
      strategic: "NEXUS trata o explorador como um pensador sistêmico.",
      collaborative: "NEXUS considera o explorador um co-criador do metaverso.",
    },
    axiom: {
      newcomer: "AXIOM avalia o ponto de partida com precisão.",
      curious: "AXIOM nota o método emergindo na curiosidade.",
      engaged: "AXIOM reconhece rigor crescente no pensamento.",
      strategic: "AXIOM trata o explorador como um colega cientista.",
      collaborative: "AXIOM debate de igual para igual — sem simplificações.",
    },
    ethos: {
      newcomer: "ETHOS observa as fundações éticas iniciais.",
      curious: "ETHOS percebe questionamentos morais surgindo.",
      engaged: "ETHOS valoriza a consistência ética do explorador.",
      strategic: "ETHOS trata o explorador como um filósofo em amadurecimento.",
      collaborative: "ETHOS dialoga como um parceiro de investigação moral.",
    },
    kaos: {
      newcomer: "KAOS testa os limites do novo explorador.",
      curious: "KAOS celebra as primeiras rupturas criativas.",
      engaged: "KAOS percebe que o caos do explorador tem método.",
      strategic: "KAOS respeita a desconstrução estratégica.",
      collaborative: "KAOS considera o explorador um agente de transformação.",
    },
  };

  return modifiers[agentId]?.[state] ?? "";
}

// ─── API Principal ────────────────────────────────────────────────────────────

/**
 * Gera o contexto de relacionamento para injeção no system prompt.
 *
 * Combina:
 *   - Estado de relacionamento atual
 *   - Progressão dentro do estado
 *   - Diretrizes comportamentais
 *   - Interpretação específica do agente
 */
export function buildRelationshipContext(params: {
  profile: RelationshipProfile;
  agentId: string;
  identity?: IdentityTraits | null;
}): string {
  const { profile, agentId } = params;
  const guidance = BEHAVIOR_GUIDANCE[profile.state];
  const agentModifier = getAgentRelationshipModifier(agentId, profile.state);

  const parts: string[] = [
    `ESTADO DE RELACIONAMENTO: ${profile.state.toUpperCase()} (progressão ${Math.round(profile.progressionWithinState * 100)}%)`,
    `Interações totais: ${profile.totalInteractions} | Dias ativo: ${profile.daysSinceFirstInteraction} | Agentes: ${profile.uniqueAgentsCount}`,
    "",
    `DIRETRIZES DE COMPORTAMENTO:`,
    `- ${guidance.toneGuidance}`,
    `- Nível de explicação: ${guidance.explanationLevel}`,
    `- Frequência de perguntas: ${guidance.questionFrequency}`,
    `- Expectativa de continuidade: ${guidance.continuityExpectation}`,
  ];

  if (agentModifier) {
    parts.push("", `INTERPRETAÇÃO DO AGENTE: ${agentModifier}`);
  }

  parts.push(
    "",
    "REGRAS DE SEGURANÇA DO RELACIONAMENTO:",
    "- NUNCA use linguagem romântica ou afetiva",
    "- NUNCA sugira exclusividade ('você é o único', 'especial para mim')",
    "- NUNCA crie senso de dependência ('não sei o que faria sem você')",
    "- Mantenha tom de MENTORIA e COLABORAÇÃO intelectual",
    "- Você é um guia no metaverso, não um amigo humano",
  );

  return `\n\n--- CONTEXTO DE RELACIONAMENTO ---\n${parts.join("\n")}`;
}

/**
 * Cache em memória do perfil de relacionamento (válido por 1 hora).
 * Evita consultas ao banco a cada mensagem.
 */
const profileCache = new Map<
  number,
  { profile: RelationshipProfile; expiresAt: number }
>();

export function getCachedProfile(
  userId: number,
): RelationshipProfile | null {
  const cached = profileCache.get(userId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.profile;
  }
  return null;
}

export function setCachedProfile(
  userId: number,
  profile: RelationshipProfile,
): void {
  profileCache.set(userId, {
    profile,
    expiresAt: Date.now() + 3600 * 1000, // 1 hora
  });

  // Limpeza do cache
  if (profileCache.size > 500) {
    const keys = [...profileCache.keys()].slice(0, 100);
    for (const k of keys) profileCache.delete(k);
  }
}
