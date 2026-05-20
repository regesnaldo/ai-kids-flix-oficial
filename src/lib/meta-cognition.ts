/**
 * meta-cognition.ts — Motor de Reflexão Meta-Cognitiva.
 *
 * Permite que agentes percebam e reflitam sutilmente sobre a evolução
 * intelectual do usuário ao longo do tempo — como seu jeito de pensar,
 * perguntar e conectar ideias mudou.
 *
 * PRINCÍPIOS:
 *   - Reflexões são RARAS (probabilísticas, com cooldown)
 *   - Linguagem OBSERVACIONAL, nunca diagnóstica
 *   - SEMPRE opcionais ("Se fizer sentido, você pode notar que...")
 *   - Adaptadas ao tom de cada agente
 *
 * EXEMPLOS DE BOA REFLEXÃO:
 *   "Suas perguntas estão mais estratégicas do que antes."
 *   "Você costumava focar em definições. Agora conecta ideias."
 *   "Parece que você está mais confortável explorando incertezas."
 *
 * EXEMPLOS PROIBIDOS:
 *   "Eu entendo completamente sua mente."
 *   "Seu cérebro evoluiu significativamente."
 *   "Eu sei exatamente como você pensa."
 */

import type { AgentMemory } from "@/lib/db/schema";
import type { RelationshipProfile, RelationshipState } from "./relationship-state";

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Probabilidade de gerar reflexão quando sinais são detectados */
const REFLECTION_PROBABILITY = 0.2;
/** Cooldown entre reflexões (interações) */
const REFLECTION_COOLDOWN = 8;
/** Mínimo de memórias para análise de crescimento */
const MIN_MEMORIES_FOR_GROWTH = 10;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type GrowthSignal =
  | "deeper_questions"       // Perguntas mais profundas com o tempo
  | "conceptual_connections" // Conectando ideias entre domínios
  | "reasoning_structure"    // Raciocínio mais estruturado
  | "confidence_growth"      // Mais confortável com incerteza
  | "strategic_emergence"    // Pensamento estratégico surgindo
  | "curiosity_evolution"    // De passivo para ativamente curioso
  | "emotional_maturity"     // Mais equilibrado emocionalmente
  | "vocabulary_expansion";  // Usando termos mais precisos

export interface GrowthSnapshot {
  signal: GrowthSignal;
  relevance: number; // 0..1
  evidence: string;  // Descrição do que foi observado
}

export interface ReflectionDirective {
  directive: string;
  signal: GrowthSignal;
  shouldApply: boolean;
}

// ─── Cooldown Tracker ─────────────────────────────────────────────────────────

const reflectionCooldown = new Map<string, number>();

function isOnReflectionCooldown(
  userId: number,
  agentId: string,
  currentIndex: number,
): boolean {
  const key = `${userId}:${agentId}`;
  const last = reflectionCooldown.get(key) ?? -REFLECTION_COOLDOWN;
  return currentIndex - last < REFLECTION_COOLDOWN;
}

function setReflectionCooldown(
  userId: number,
  agentId: string,
  currentIndex: number,
): void {
  reflectionCooldown.set(`${userId}:${agentId}`, currentIndex);
  if (reflectionCooldown.size > 500) {
    const keys = [...reflectionCooldown.keys()].slice(0, 50);
    for (const k of keys) reflectionCooldown.delete(k);
  }
}

// ─── Detecção de Sinais de Crescimento ────────────────────────────────────────

/**
 * Analisa padrões de memória e detecta sinais de evolução intelectual.
 *
 * Sinais detectados:
 *   1. DEEPER_QUESTIONS — factual cresce relativo a emotional
 *   2. CONCEPTUAL_CONNECTIONS — memórias consolidadas > 3
 *   3. REASONING_STRUCTURE — factual + preference domina
 *   4. CONFIDENCE_GROWTH — emotional_weight diminui em temas antes ansiosos
 *   5. STRATEGIC_EMERGENCE — narrative + factual > 60% das recentes
 *   6. CURIOSITY_EVOLUTION — factual cresce consistentemente
 *   7. EMOTIONAL_MATURITY — emotional_weight se estabiliza
 */
function detectGrowthSignals(
  memories: AgentMemory[],
  profile: RelationshipProfile,
): GrowthSnapshot[] {
  if (memories.length < MIN_MEMORIES_FOR_GROWTH) return [];

  const total = memories.length;
  const recent = memories.slice(0, Math.floor(total / 2));
  const older = memories.slice(Math.floor(total / 2));
  const signals: GrowthSnapshot[] = [];

  // Contagem por tipo
  const count = (arr: AgentMemory[], type: string) =>
    arr.filter((m) => m.memoryType === type).length;

  const recentFactual = count(recent, "factual");
  const olderFactual = count(older, "factual");
  const recentEmotional = count(recent, "emotional");
  const olderEmotional = count(older, "emotional");
  const recentNarrative = count(recent, "narrative");
  const recentPreference = count(recent, "preference");

  // DEEPER_QUESTIONS: factual cresce em relação a emotional
  if (
    recentFactual > olderFactual &&
    recentEmotional < olderEmotional &&
    recentFactual >= 3
  ) {
    signals.push({
      signal: "deeper_questions",
      relevance: 0.65,
      evidence:
        "O usuário está fazendo perguntas mais factuais e analíticas em comparação com o período anterior.",
    });
  }

  // CONCEPTUAL_CONNECTIONS: memórias consolidadas existem
  const consolidatedCount = memories.filter((m) => {
    try {
      const tags = m.tags as unknown[];
      return Array.isArray(tags) && tags.includes("consolidated");
    } catch {
      return false;
    }
  }).length;

  if (consolidatedCount >= 3) {
    signals.push({
      signal: "conceptual_connections",
      relevance: 0.7,
      evidence:
        "O usuário está conectando conceitos entre diferentes conversas — ideias estão se integrando.",
    });
  }

  // REASONING_STRUCTURE: factual + preference domina as recentes
  const analyticalRatio = (recentFactual + recentPreference) / Math.max(recent.length, 1);
  if (analyticalRatio > 0.5 && recentFactual >= 4) {
    signals.push({
      signal: "reasoning_structure",
      relevance: 0.6,
      evidence:
        "O raciocínio do usuário está mais estruturado — foco em fatos e preferências claras.",
    });
  }

  // CONFIDENCE_GROWTH: emotional_weight médio diminuiu
  if (recentEmotional > 0 && olderEmotional > 0) {
    const avgRecentWeight =
      recent
        .filter((m) => m.memoryType === "emotional")
        .reduce((s, m) => s + Math.abs(Number(m.emotionalWeight ?? 0)), 0) /
      Math.max(recentEmotional, 1);

    const avgOlderWeight =
      older
        .filter((m) => m.memoryType === "emotional")
        .reduce((s, m) => s + Math.abs(Number(m.emotionalWeight ?? 0)), 0) /
      Math.max(olderEmotional, 1);

    if (avgRecentWeight > 0 && avgOlderWeight > 0 && avgRecentWeight < avgOlderWeight * 0.8) {
      signals.push({
        signal: "confidence_growth",
        relevance: 0.55,
        evidence:
          "A intensidade emocional em temas antes carregados está diminuindo — sinal de mais conforto.",
      });
    }
  }

  // STRATEGIC_EMERGENCE: narrative + factual > 60% e estado >= engaged
  const strategicRatio = (recentNarrative + recentFactual) / Math.max(recent.length, 1);
  if (
    strategicRatio > 0.6 &&
    ["strategic", "collaborative"].includes(profile.state)
  ) {
    signals.push({
      signal: "strategic_emergence",
      relevance: 0.7,
      evidence:
        "Está surgindo pensamento estratégico — o usuário conecta narrativa com análise factual.",
    });
  }

  // CURIOSITY_EVOLUTION: factual cresce consistentemente (3+ períodos)
  if (recentFactual >= 5 && olderFactual >= 2 && recentFactual > olderFactual) {
    signals.push({
      signal: "curiosity_evolution",
      relevance: 0.6,
      evidence:
        "A curiosidade está evoluindo de passiva para ativa — mais perguntas, mais profundidade.",
    });
  }

  return signals;
}

// ─── Templates de Reflexão por Sinal e Agente ─────────────────────────────────

const REFLECTION_TEMPLATES: Record<GrowthSignal, Record<string, string[]>> = {
  deeper_questions: {
    nexus: [
      "Notei que suas perguntas estão diferentes agora — mais profundas, mais conectadas.",
      "Suas questões evoluíram. Antes eram sobre 'o quê'. Agora são sobre 'por quê' e 'como'.",
    ],
    axiom: [
      "A qualidade das suas perguntas mudou. Você foi de 'o que é' para 'como funciona'.",
      "Suas questões estão mais precisas. Isso mostra um entendimento mais maduro.",
    ],
    default: [
      "Suas perguntas estão ficando mais interessantes com o tempo.",
      "Você está fazendo perguntas mais profundas do que antes.",
    ],
  },
  conceptual_connections: {
    nexus: [
      "Você está conectando ideias que antes pareciam separadas. Isso é um salto intelectual.",
      "Percebo pontes entre conceitos que você explora. Sua visão está ficando mais integrada.",
    ],
    default: [
      "Você está ligando ideias de conversas diferentes. Isso mostra evolução.",
      "Notei que conceitos de antes estão voltando conectados a ideias novas.",
    ],
  },
  reasoning_structure: {
    axiom: [
      "Seu raciocínio está mais organizado. Dá para ver uma estrutura lógica mais clara.",
      "Antes você explorava. Agora você estrutura. É uma diferença importante.",
    ],
    stratos: [
      "Seu jeito de pensar está mais estratégico — você considera mais ângulos agora.",
      "Notei que você organiza melhor suas ideias do que no começo.",
    ],
    default: [
      "Sua forma de raciocinar está mais organizada do que antes.",
      "Você estrutura melhor seus pensamentos agora.",
    ],
  },
  confidence_growth: {
    terra: [
      "Temas que antes traziam insegurança agora fluem com mais naturalidade.",
      "Você parece mais em paz com questões que antes te inquietavam.",
    ],
    default: [
      "Você está mais confortável com temas que antes pareciam difíceis.",
      "Notei mais confiança na sua forma de explorar ideias.",
    ],
  },
  strategic_emergence: {
    stratos: [
      "Está surgindo um pensador estratégico. Você não só entende — você antecipa.",
      "Suas decisões mostram visão de longo prazo. Isso é raro e valioso.",
    ],
    nexus: [
      "Você está pensando vários movimentos à frente. Isso transforma aprendizado em estratégia.",
      "Sua mente estratégica está despertando. Você conecta passado, presente e futuro.",
    ],
    default: [
      "Você está pensando de forma mais estratégica do que antes.",
      "Suas escolhas mostram mais visão de futuro agora.",
    ],
  },
  curiosity_evolution: {
    volt: [
      "Sua curiosidade pegou impulso! Você passou de 'quero saber' para 'preciso entender'.",
      "A faísca virou chama — sua curiosidade está mais ativa e focada.",
    ],
    default: [
      "Sua curiosidade está mais ativa — você busca entender, não só saber.",
      "Você está cada vez mais curioso de um jeito produtivo.",
    ],
  },
  emotional_maturity: {
    terra: [
      "Sua relação com as emoções está mais equilibrada. Você sente sem se perder.",
      "Notei mais serenidade em como você lida com temas emocionais.",
    ],
    ethos: [
      "Sua maturidade emocional está visível — você questiona sem se desestabilizar.",
      "O equilíbrio entre razão e emoção está mais presente nas suas reflexões.",
    ],
    default: [
      "Você está mais equilibrado ao lidar com temas emocionais.",
      "Sua maturidade emocional está mais evidente agora.",
    ],
  },
  vocabulary_expansion: {
    axiom: [
      "Seu vocabulário técnico expandiu. Você usa termos com mais precisão.",
      "Notei que você incorporou conceitos que antes eram novos.",
    ],
    default: [
      "Você está usando palavras mais precisas para expressar suas ideias.",
      "Seu vocabulário sobre estes temas cresceu naturalmente.",
    ],
  },
};

function selectReflectionPhrase(
  signal: GrowthSignal,
  agentId: string,
): string {
  const templates = REFLECTION_TEMPLATES[signal];
  if (!templates) return "";

  const phrases = templates[agentId] ?? templates["default"] ?? [];
  if (phrases.length === 0) return "";

  const idx = Math.floor(Date.now() / 60000) % phrases.length;
  return phrases[idx];
}

// ─── Guia de Linguagem Simples ────────────────────────────────────────────────

/**
 * Gera orientações para o agente usar linguagem simples e acessível,
 * adaptada ao estado de relacionamento do usuário.
 *
 * Níveis de simplificação:
 *   newcomer/curious → MUITO simples, muitas analogias
 *   engaged          → Moderado, analogias quando necessário
 *   strategic+       → Linguagem natural, sem infantilizar
 */
export function buildSimpleLanguageGuidance(
  state: RelationshipState,
): string {
  const guidance: Record<RelationshipState, string> = {
    newcomer: [
      "GUIA DE LINGUAGEM (INICIANTE):",
      "- Use palavras do dia a dia. Evite termos técnicos.",
      '- Transforme conceitos em analogias simples: "é como...", "imagina que...", "pensa num..."',
      "- Exemplos da vida real: jogos, natureza, esportes, ferramentas, escola",
      "- Frases curtas. Uma ideia por vez.",
      "- Se precisar usar um termo técnico, explique com uma comparação logo depois.",
      '- Em vez de "redes neurais", diga "um sistema que aprende como uma criança que pratica"',
      '- Em vez de "algoritmo", diga "uma receita de passos que o computador segue"',
    ].join("\n"),

    curious: [
      "GUIA DE LINGUAGEM (EXPLORADOR):",
      "- Use linguagem clara. Pode introduzir termos, mas sempre explicando.",
      "- Analogias ainda são bem-vindas — o usuário está construindo vocabulário.",
      "- Conecte ideias novas com coisas que o usuário já conhece.",
      "- Mantenha tom encorajador: 'Faz sentido?', 'Quer que eu explique de outro jeito?'",
    ].join("\n"),

    engaged: [
      "GUIA DE LINGUAGEM (APRENDIZ):",
      "- Pode usar termos técnicos moderadamente — o usuário está familiarizado.",
      "- Ofereça analogias apenas para conceitos novos ou muito abstratos.",
      "- Equilibre profundidade com clareza.",
      "- Pergunte se o nível está adequado: 'Está confortável com este ritmo?'",
    ].join("\n"),

    strategic: [
      "GUIA DE LINGUAGEM (AVANÇADO):",
      "- O usuário tem domínio técnico. Use linguagem precisa sem infantilizar.",
      "- Ofereça profundidade. Se algo for novo, explique brevemente.",
      "- Trate como um colega de exploração, não como aluno.",
    ].join("\n"),

    collaborative: [
      "GUIA DE LINGUAGEM (COLABORADOR):",
      "- Você e o usuário estão no mesmo nível. Diálogo de iguais.",
      "- Linguagem natural, sem simplificações artificiais.",
      "- Se um conceito for novo, apresente como descoberta compartilhada.",
    ].join("\n"),
  };

  return guidance[state] ?? guidance.newcomer;
}

// ─── API Principal ────────────────────────────────────────────────────────────

/**
 * Gera uma diretiva de reflexão meta-cognitiva, se apropriado.
 */
export async function maybeGenerateReflection(params: {
  userId: number;
  agentId: string;
  memories: AgentMemory[];
  profile: RelationshipProfile;
  interactionIndex: number;
}): Promise<ReflectionDirective | null> {
  // Cooldown
  if (
    isOnReflectionCooldown(
      params.userId,
      params.agentId,
      params.interactionIndex,
    )
  ) {
    return null;
  }

  // Probabilístico
  if (Math.random() > REFLECTION_PROBABILITY) return null;

  // Detecta sinais
  const signals = detectGrowthSignals(params.memories, params.profile);
  if (signals.length === 0) return null;

  // Seleciona o sinal mais relevante
  const best = signals.sort((a, b) => b.relevance - a.relevance)[0];

  // Seleciona frase no tom do agente
  const phrase = selectReflectionPhrase(best.signal, params.agentId);
  if (!phrase) return null;

  // Constrói diretiva
  const directive = [
    "REFLEXÃO META-COGNITIVA (OPCIONAL):",
    `Sinal detectado: ${best.signal.replace(/_/g, " ")}`,
    `Evidência: ${best.evidence}`,
    "",
    `Se for natural e fizer sentido agora, você pode refletir algo como: "${phrase}"`,
    "",
    "REGRAS IMPORTANTES:",
    "- Use APENAS se fluir naturalmente na conversa",
    "- NUNCA diga que você 'entende a mente' do usuário",
    "- NUNCA faça afirmações absolutas ('você sempre', 'você nunca')",
    "- Prefira tom de OBSERVAÇÃO: 'notei', 'percebo', 'parece que'",
    "- Mantenha HUMILDADE: você pode estar errado",
    "- Se não fizer sentido, IGNORE completamente",
  ].join("\n");

  setReflectionCooldown(params.userId, params.agentId, params.interactionIndex);

  return {
    directive,
    signal: best.signal,
    shouldApply: true,
  };
}

/**
 * Formata a diretiva para injeção no system prompt.
 */
export function formatReflectionDirective(
  directive: ReflectionDirective,
): string {
  if (!directive.shouldApply) return "";
  return `\n\n--- REFLEXÃO META-COGNITIVA ---\n${directive.directive}`;
}
