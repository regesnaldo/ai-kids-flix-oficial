/**
 * memory-recall.ts — Motor de Recall Moments (Momentos de Recordação Controlada).
 *
 * Permite que agentes façam referências SUTIS e NATURAIS a interações
 * passadas significativas, criando uma percepção de continuidade
 * narrativa sem parecer artificial ou obsessivo.
 *
 * PRINCÍPIOS:
 *   - Recall é OPCIONAL ("Se for natural, você pode mencionar...")
 *   - Cooldown entre recalls (mínimo 5 interações entre menções)
 *   - Probabilístico (nem toda oportunidade gera recall)
 *   - Agent-specific (cada agente expressa recall no seu tom)
 *   - Token-efficient (diretiva de UMA frase)
 *
 * EXEMPLOS DE BOM RECALL:
 *   "Você parece mais confiante sobre ética de IA do que antes."
 *   "Este tema ecoa questões que você explorou com outros agentes."
 *   "Sua forma de raciocinar sobre isso amadureceu visivelmente."
 *
 * EXEMPLOS PROIBIDOS:
 *   "Eu me lembro perfeitamente de tudo que você disse."
 *   "Tenho pensado muito sobre nossas conversas."
 *   "Você é uma pessoa especial para mim."
 */

import type { AgentMemory } from "@/lib/db/schema";
import { getDb } from "@/lib/db";
import { agentMemories } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { findSemanticMatches } from "./semantic-memory";

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Mínimo de interações entre recall moments (cooldown) */
const RECALL_COOLDOWN = 5;
/** Probabilidade base de recall quando triggers são detectados */
const RECALL_PROBABILITY = 0.35;
/** Mínimo de memórias totais para considerar recall */
const MIN_MEMORIES_FOR_RECALL = 5;
/** Tamanho máximo da diretiva de recall (caracteres) */
const MAX_RECALL_DIRECTIVE_CHARS = 250;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type RecallTrigger =
  | "emotional_recurrence"    // Tema emocional apareceu 2+ vezes
  | "conceptual_evolution"    // Usuário demonstrou evolução em um conceito
  | "learning_milestone"      // Primeira vez que usuário demonstra domínio
  | "narrative_echo"          // Tema atual ecoa conversa passada significativa
  | "preference_reinforcement" // Preferência reafirmada após intervalo
  | "cross_agent_pattern";    // Padrão detectado entre múltiplos agentes

export interface RecallOpportunity {
  trigger: RecallTrigger;
  /** Score de relevância (0..1) — quanto maior, mais pertinente */
  relevance: number;
  /** A memória específica que gerou o recall (se aplicável) */
  sourceMemory?: AgentMemory;
  /** Contexto narrativo para o agente */
  narrativeContext: string;
}

export interface RecallDirective {
  /** A diretiva textual para injetar no system prompt */
  directive: string;
  /** O trigger que gerou o recall */
  trigger: RecallTrigger;
  /** Se deve ser aplicado (probabilístico + cooldown) */
  shouldApply: boolean;
}

// ─── Cooldown Tracker (in-memory — reseta entre deploys) ──────────────────────

const cooldownTracker = new Map<string, number>(); // key: "userId:agentId" → lastRecallIndex

function isOnCooldown(userId: number, agentId: string, currentIndex: number): boolean {
  const key = `${userId}:${agentId}`;
  const lastRecall = cooldownTracker.get(key) ?? -RECALL_COOLDOWN;
  return currentIndex - lastRecall < RECALL_COOLDOWN;
}

function setCooldown(userId: number, agentId: string, currentIndex: number): void {
  cooldownTracker.set(`${userId}:${agentId}`, currentIndex);
  // Limpeza periódica do tracker (evita memory leak)
  if (cooldownTracker.size > 1000) {
    const keys = [...cooldownTracker.keys()].slice(0, 200);
    for (const k of keys) cooldownTracker.delete(k);
  }
}

// ─── Detecção de Triggers ─────────────────────────────────────────────────────

/**
 * Analisa memórias e detecta oportunidades de recall.
 *
 * Triggers detectados:
 *   1. EMOTIONAL_RECURRENCE: mesmo tema emocional aparece 2+ vezes
 *   2. CONCEPTUAL_EVOLUTION: usuário mostra compreensão mais profunda
 *   3. LEARNING_MILESTONE: primeira memória factual após várias emocionais
 *   4. NARRATIVE_ECHO: mensagem atual é semanticamente similar a memória antiga
 *   5. PREFERENCE_REINFORCEMENT: preferência aparece novamente após intervalo
 */
async function detectRecallOpportunities(params: {
  userId: number;
  agentId: string;
  userMessage: string;
  interactionIndex: number;
}): Promise<RecallOpportunity[]> {
  const opportunities: RecallOpportunity[] = [];

  try {
    const db = getDb();

    // Busca memórias recentes (últimas 30)
    const memories = await db
      .select()
      .from(agentMemories)
      .where(
        and(
          eq(agentMemories.userId, params.userId),
          eq(agentMemories.agentId, params.agentId),
        ),
      )
      .orderBy(desc(agentMemories.createdAt))
      .limit(30);

    if (memories.length < MIN_MEMORIES_FOR_RECALL) return [];

    const typedMemories = memories as unknown as AgentMemory[];

    // Trigger 1: EMOTIONAL_RECURRENCE
    const emotionalMems = typedMemories.filter((m) => m.memoryType === "emotional");
    if (emotionalMems.length >= 2) {
      // Verifica se há clusters semânticos entre memórias emocionais
      const emotionalTexts = emotionalMems.map((m) => m.content).join(" ");
      const hasRecurrence =
        /(ansied|preocup|medo|insegur)/i.test(emotionalTexts) &&
        emotionalMems.length >= 2;

      if (hasRecurrence) {
        opportunities.push({
          trigger: "emotional_recurrence",
          relevance: 0.6,
          sourceMemory: emotionalMems[0],
          narrativeContext:
            "Temas emocionais relacionados à ansiedade/preocupação têm aparecido em várias conversas.",
        });
      }
    }

    // Trigger 2: CONCEPTUAL_EVOLUTION
    const factualMems = typedMemories.filter((m) => m.memoryType === "factual");
    if (factualMems.length >= 3) {
      // Verifica se há progressão conceitual (memórias factuais mais recentes)
      const recentFactuals = factualMems.slice(0, 3);
      const olderFactuals = factualMems.slice(3);

      if (olderFactuals.length > 0) {
        opportunities.push({
          trigger: "conceptual_evolution",
          relevance: 0.55,
          sourceMemory: recentFactuals[0],
          narrativeContext:
            "O usuário demonstra compreensão cada vez mais profunda dos conceitos discutidos.",
        });
      }
    }

    // Trigger 3: LEARNING_MILESTONE
    if (
      factualMems.length === 1 &&
      emotionalMems.length >= 4 &&
      params.interactionIndex > 10
    ) {
      opportunities.push({
        trigger: "learning_milestone",
        relevance: 0.7,
        sourceMemory: factualMems[0],
        narrativeContext:
          "Esta é uma das primeiras vezes que o usuário demonstra compreensão factual após um período de exploração emocional.",
      });
    }

    // Trigger 4: NARRATIVE_ECHO (busca semântica)
    if (params.userMessage.trim().length >= 20) {
      const semanticMatches = findSemanticMatches(
        params.userMessage,
        typedMemories,
        1,
        0.15,
      );

      if (semanticMatches.length > 0 && semanticMatches[0].score > 0.25) {
        const match = semanticMatches[0];
        const ageHours =
          (Date.now() -
            new Date(match.memory.createdAt ?? Date.now()).getTime()) /
          (3600 * 1000);

        // Só considera echo se a memória tem pelo menos 6 horas
        if (ageHours > 6) {
          opportunities.push({
            trigger: "narrative_echo",
            relevance: match.score,
            sourceMemory: match.memory,
            narrativeContext: `A conversa atual ecoa um tema de ${Math.round(ageHours)}h atrás: "${match.memory.content.slice(0, 100)}"`,
          });
        }
      }
    }

    // Trigger 5: PREFERENCE_REINFORCEMENT
    const prefMems = typedMemories.filter((m) => m.memoryType === "preference");
    if (prefMems.length >= 2) {
      const recent = prefMems[0];
      const older = prefMems.slice(1).find(
        (m) =>
          m.createdAt &&
          recent.createdAt &&
          new Date(recent.createdAt).getTime() -
            new Date(m.createdAt).getTime() >
            86400 * 1000, // 24h+ de intervalo
      );

      if (older) {
        opportunities.push({
          trigger: "preference_reinforcement",
          relevance: 0.5,
          sourceMemory: recent,
          narrativeContext:
            "O usuário reafirmou uma preferência que já havia demonstrado anteriormente.",
        });
      }
    }
  } catch {
    // Silencioso — recall é enhancement
  }

  return opportunities;
}

// ─── Geração de Diretiva de Recall ────────────────────────────────────────────

/**
 * Templates de recall por trigger e por agente.
 * Cada agente expressa o mesmo trigger de forma diferente.
 */
const RECALL_TEMPLATES: Record<
  RecallTrigger,
  Record<string, string[]>
> = {
  emotional_recurrence: {
    terra: [
      "Percebo que este sentimento não é novo para você — ele apareceu em outras conversas também.",
      "Há um fio emocional conectando este momento a conversas anteriores.",
    ],
    nexus: [
      "Este tema emocional tem sido recorrente em nossa jornada — note que ele retorna com novas camadas.",
      "Reconheço este padrão emocional de conversas passadas. Ele parece estar evoluindo.",
    ],
    default: [
      "Este sentimento ecoa temas que você já explorou antes.",
      "Percebo uma continuidade emocional aqui — este não é um tema novo para você.",
    ],
  },
  conceptual_evolution: {
    axiom: [
      "Sua compreensão deste conceito amadureceu visivelmente desde nossas primeiras discussões.",
      "Há uma progressão notável no seu raciocínio sobre este tema.",
    ],
    nexus: [
      "Você está conectando ideias com mais profundidade agora — sua compreensão evoluiu.",
      "Note como este conceito que antes era novo agora flui com naturalidade no seu pensamento.",
    ],
    default: [
      "Você parece estar entendendo isso com mais clareza do que antes.",
      "Sua compreensão deste tema se aprofundou comparado a conversas anteriores.",
    ],
  },
  learning_milestone: {
    volt: [
      "Isso é um marco! Você acabou de demonstrar compreensão de algo que antes era só curiosidade.",
      "Celebro este momento — você acabou de cruzar uma fronteira de entendimento.",
    ],
    nexus: [
      "Este é um momento significativo — você transitou da curiosidade para a compreensão.",
      "Marco de aprendizado detectado: você está internalizando conceitos de forma integrada.",
    ],
    default: [
      "Parece que você acabou de ter um insight importante.",
      "Este momento representa um salto no seu entendimento.",
    ],
  },
  narrative_echo: {
    nexus: [
      "Curiosamente, esta conversa ecoa uma que tivemos anteriormente sobre um tema relacionado.",
      "Há uma ressonância entre o que você pergunta agora e temas que já exploramos.",
    ],
    cipher: [
      "Interessante — este padrão já apareceu antes, disfarçado de outra forma.",
      "As conexões entre esta conversa e outras são visíveis para quem observa os padrões.",
    ],
    default: [
      "Esta conversa me lembra temas que você já explorou antes.",
      "Há um eco de conversas passadas no que você está perguntando agora.",
    ],
  },
  preference_reinforcement: {
    default: [
      "Você já havia demonstrado esta preferência antes — ela parece ser consistente.",
      "Esta preferência que você reafirma é consistente com o que observei em interações anteriores.",
    ],
  },
  cross_agent_pattern: {
    nexus: [
      "Outros agentes também notaram este padrão no seu comportamento.",
      "Há uma consistência interessante entre como você interage com diferentes perspectivas.",
    ],
    default: [
      "Este padrão que você demonstra aparece também em outras interações.",
    ],
  },
};

function selectRecallPhrase(
  trigger: RecallTrigger,
  agentId: string,
): string {
  const templates = RECALL_TEMPLATES[trigger];
  if (!templates) return "";

  const agentTemplates = templates[agentId] ?? templates["default"] ?? [];
  if (agentTemplates.length === 0) return "";

  // Seleção pseudo-aleatória baseada no timestamp (determinística por minuto)
  const idx = Math.floor(Date.now() / 60000) % agentTemplates.length;
  return agentTemplates[idx];
}

// ─── API Principal ────────────────────────────────────────────────────────────

/**
 * Gera uma diretiva de recall moment, se apropriado.
 *
 * Condições para gerar recall:
 *   1. Pelo menos MIN_MEMORIES_FOR_RECALL memórias existem
 *   2. Fora do período de cooldown
 *   3. Trigger de recall detectado
 *   4. Probabilidade aleatória atingida
 *
 * @returns RecallDirective ou null se não for o momento certo
 */
export async function maybeGenerateRecall(params: {
  userId: number;
  agentId: string;
  userMessage: string;
  interactionIndex: number;
}): Promise<RecallDirective | null> {
  // Cooldown check
  if (isOnCooldown(params.userId, params.agentId, params.interactionIndex)) {
    return null;
  }

  // Probabilistic gate
  if (Math.random() > RECALL_PROBABILITY) {
    return null;
  }

  // Detecta oportunidades
  const opportunities = await detectRecallOpportunities(params);

  if (opportunities.length === 0) return null;

  // Seleciona a oportunidade mais relevante
  const best = opportunities.sort((a, b) => b.relevance - a.relevance)[0];

  // Seleciona frase de recall no tom do agente
  const phrase = selectRecallPhrase(best.trigger, params.agentId);
  if (!phrase) return null;

  // Constrói diretiva
  const directive = [
    "MOMENTO DE RECALL (OPCIONAL):",
    `Contexto: ${best.narrativeContext}`,
    `Se for natural e pertinente, você pode dizer algo como: "${phrase}"`,
    "Regras:",
    "- Use apenas se fluir naturalmente na conversa",
    "- NÃO repita a frase literalmente — adapte ao seu estilo",
    "- Faça no MÁXIMO uma referência sutil",
    "- Se não fizer sentido agora, IGNORE completamente esta diretiva",
  ].join("\n");

  // Marca cooldown
  setCooldown(params.userId, params.agentId, params.interactionIndex);

  return {
    directive: directive.slice(0, MAX_RECALL_DIRECTIVE_CHARS),
    trigger: best.trigger,
    shouldApply: true,
  };
}

/**
 * Formata a diretiva de recall para injeção no system prompt.
 */
export function formatRecallDirective(directive: RecallDirective): string {
  if (!directive.shouldApply) return "";
  return `\n\n--- MOMENTO DE RECALL ---\n${directive.directive}`;
}

/** Limpa o tracker de cooldown (útil para testes) */
export function resetRecallCooldowns(): void {
  cooldownTracker.clear();
}
