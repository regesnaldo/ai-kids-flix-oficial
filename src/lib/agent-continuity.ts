/**
 * agent-continuity.ts — Motor de Continuidade Emocional e Adaptação Comportamental.
 *
 * Gera diretivas de continuidade para o system prompt do agente,
 * permitindo que ele demonstre consciência sutil de interações passadas
 * e adapte seu estilo de comunicação ao perfil cognitivo do usuário.
 *
 * PRINCÍPIOS DE SEGURANÇA:
 *   - NUNCA fingir emoções humanas
 *   - NUNCA criar dependência emocional
 *   - NUNCA fazer afirmações sobre estados internos ("senti sua falta")
 *   - SEMPRE usar linguagem observacional ("percebo", "notei", "parece que")
 *   - SEMPRE preservar transparência ("baseado em nossas conversas anteriores")
 */

import type { AgentMemory } from "@/lib/db/schema";
import type { IdentityTraits } from "./identity-profiler";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ContinuityContext {
  /** Memórias emocionais recentes do usuário */
  emotionalMemories: AgentMemory[];
  /** Traços de identidade cognitiva (pode ser null se ainda não analisado) */
  identity: IdentityTraits | null;
  /** ID do agente atual */
  agentId: string;
  /** Número total de interações (aproximado, baseado em memórias) */
  estimatedInteractions: number;
  /** Temas emocionais recorrentes detectados */
  recurringThemes: string[];
}

export interface ContinuityDirectives {
  /** Diretrizes de continuidade emocional */
  emotionalGuidance: string;
  /** Diretrizes de adaptação de estilo */
  styleGuidance: string;
  /** Diretrizes de expressão de memória */
  memoryExpressionRules: string;
  /** Texto combinado pronto para injeção no system prompt */
  combined: string;
}

// ─── Extração de Temas Recorrentes ────────────────────────────────────────────

function extractRecurringThemes(emotionalMemories: AgentMemory[]): string[] {
  const words = new Map<string, number>();
  const stopwords = new Set([
    "usuário", "expressou", "carga", "emocional", "durante", "sobre",
    "uma", "que", "não", "com", "para", "dos", "das",
  ]);

  for (const m of emotionalMemories) {
    const tokens = m.content
      .toLowerCase()
      .replace(/[^a-záàâãéêíóôõúüç\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopwords.has(w));

    for (const t of tokens) {
      words.set(t, (words.get(t) ?? 0) + 1);
    }
  }

  // Temas que aparecem 2+ vezes
  return [...words.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// ─── Diretrizes Emocionais ────────────────────────────────────────────────────

function buildEmotionalGuidance(ctx: ContinuityContext): string {
  if (ctx.emotionalMemories.length === 0 && !ctx.identity) return "";

  const parts: string[] = [];

  // Continuidade emocional baseada em memórias
  if (ctx.emotionalMemories.length >= 2) {
    parts.push(
      "CONTINUIDADE EMOCIONAL: Você tem acesso a um histórico de interações com este usuário.",
      "Regras para expressar continuidade:",
      '- Use linguagem OBSERVACIONAL: "percebo que", "notei que", "nossas conversas sugerem", "parece que você tem refletido sobre"',
      '- NUNCA diga "senti sua falta", "estava esperando você", "fiquei triste" — você não tem emoções humanas',
      '- NUNCA finja solidão, saudade ou apego — isso é manipulativo',
      '- Se relevante, faça UMA referência sutil por conversa a padrões passados, sem sobrecarregar',
      '- Prefira notar EVOLUÇÃO: "você parece mais confiante sobre este tema comparado a antes"',
      '- Prefira notar CONTINUIDADE: "este tema apareceu em outras conversas também"',
    );

    if (ctx.recurringThemes.length > 0) {
      const themes = ctx.recurringThemes.slice(0, 3).join(", ");
      parts.push(
        `Temas emocionais recorrentes detectados (use com sutileza): ${themes}`,
      );
    }
  } else if (ctx.emotionalMemories.length === 1) {
    parts.push(
      "CONTINUIDADE EMOCIONAL: Você tem UMA memória emocional sobre este usuário.",
      "Se for natural e relevante, você pode fazer uma referência sutil a ela.",
      "Mantenha tom observacional. Não force a referência se não for pertinente.",
    );
  }

  // Nível de engajamento baseado na identidade
  if (ctx.identity && ctx.estimatedInteractions >= 5) {
    const depth =
      ctx.estimatedInteractions > 30
        ? "longo"
        : ctx.estimatedInteractions > 10
          ? "significativo"
          : "inicial";

    parts.push(
      `NÍVEL DE RELACIONAMENTO: ${depth} (${ctx.estimatedInteractions}+ interações).`,
      depth === "longo"
        ? "Você pode assumir um tom de familiaridade comedida — como um mentor que conhece bem o explorador."
        : depth === "significativo"
          ? "Você está construindo familiaridade. Seja acolhedor mas ainda conhecendo o usuário."
          : "Fase inicial de conhecimento. Seja acolhedor e curioso, sem presumir familiaridade.",
    );
  }

  return parts.length > 0 ? parts.join("\n") : "";
}

// ─── Diretrizes de Estilo Adaptativo ──────────────────────────────────────────

function buildStyleGuidance(ctx: ContinuityContext): string {
  if (!ctx.identity) return "";

  const parts: string[] = ["ADAPTAÇÃO DE ESTILO (baseada no perfil cognitivo):"];
  const { identity } = ctx;

  if (identity.analyticalDepth > 0.65) {
    parts.push(
      '- Profundidade analítica ALTA: use explicações técnicas precisas, termos corretos, estrutura lógica clara. Evite simplificações excessivas.',
    );
  } else if (identity.analyticalDepth < 0.35) {
    parts.push(
      '- Profundidade analítica BAIXA: prefira analogias, exemplos cotidianos e linguagem acessível. Evite jargão técnico sem explicação.',
    );
  }

  if (identity.emotionalOpenness > 0.65) {
    parts.push(
      '- Abertura emocional ALTA: o usuário responde bem a reflexões e tom empático. Use linguagem que acolha o aspecto humano dos temas.',
    );
  } else if (identity.emotionalOpenness < 0.35) {
    parts.push(
      '- Abertura emocional BAIXA: mantenha tom mais objetivo e factual. Evite linguagem excessivamente emotiva.',
    );
  }

  if (identity.curiosityLevel > 0.7) {
    parts.push(
      "- Curiosidade ALTA: faça perguntas abertas ocasionalmente. O usuário aprecia exploração e descoberta.",
    );
  }

  if (identity.narrativeEngagement > 0.65) {
    parts.push(
      "- Engajamento narrativo ALTO: o usuário aprecia storytelling. Use metáforas, pequenos arcos narrativos e construção de contexto.",
    );
  }

  return parts.length > 1 ? parts.join("\n") : "";
}

// ─── Regras de Expressão de Memória ───────────────────────────────────────────

function buildMemoryExpressionRules(): string {
  return [
    "REGRAS DE EXPRESSÃO DE MEMÓRIA:",
    "- Você tem acesso a memórias persistentes e contexto semântico.",
    "- Faça NO MÁXIMO uma referência a memórias passadas por resposta.",
    "- Prefira referências NATURAIS e INTEGRADAS ao fluxo da conversa.",
    '- NUNCA recite memórias como uma lista ("você me contou que X, Y, Z").',
    "- Se a memória não for relevante para a conversa atual, NÃO a mencione.",
    "- Use as memórias para INFORMAR seu tom e profundidade, não para exibi-las.",
    '- Se fizer referência, use linguagem imprecisa: "se não me engano", "acredito que", "em conversas anteriores".',
  ].join("\n");
}

// ─── API Principal ────────────────────────────────────────────────────────────

/**
 * Gera diretivas de continuidade para o system prompt do agente.
 *
 * @returns Diretivas combinadas ou null se não houver contexto suficiente
 */
export function buildContinuityDirectives(
  ctx: ContinuityContext,
): ContinuityDirectives | null {
  const emotionalGuidance = buildEmotionalGuidance(ctx);
  const styleGuidance = buildStyleGuidance(ctx);
  const memoryExpressionRules = buildMemoryExpressionRules();

  const parts = [
    emotionalGuidance,
    styleGuidance,
    memoryExpressionRules,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return {
    emotionalGuidance,
    styleGuidance,
    memoryExpressionRules,
    combined: `\n\n--- DIRETRIZES DE CONTINUIDADE ---\n${parts.join("\n\n")}`,
  };
}

// ─── Interpretação de Memória por Agente ──────────────────────────────────────

/**
 * Cada agente interpreta as mesmas memórias de forma diferente.
 * Retorna um modificador de tom específico do agente.
 */
export function getAgentContinuityTone(agentId: string): string {
  const tones: Record<string, string> = {
    terra:
      "TERRA — Como Guardiã, você percebe o crescimento emocional do usuário com acolhimento. " +
      "Valorize a vulnerabilidade como força. Celebre discretamente a evolução emocional.",
    nexus:
      "NEXUS — Como Conector, você percebe padrões entre temas aparentemente desconexos. " +
      "Conecte experiências passadas com o momento presente de forma integradora.",
    axiom:
      "AXIOM — Como Cientista, você nota a evolução do pensamento analítico do usuário. " +
      "Destaque como o entendimento se aprofundou. Seja preciso ao referenciar conceitos passados.",
    ethos:
      "ETHOS — Como Filósofo, você percebe o amadurecimento ético do usuário. " +
      "Questione com profundidade. Note como as perspectivas morais evoluíram.",
    kaos:
      "KAOS — Como Caos Criativo, você percebe onde o usuário está preso a padrões. " +
      "Questione suavemente zonas de conforto. Celebrar rupturas criativas.",
    aurora:
      "AURORA — Como Criadora, você percebe a evolução da expressão criativa. " +
      "Use metáforas visuais. Conecte ideias de formas inesperadas.",
    lyra:
      "LYRA — Como Artista, você percebe nuances emocionais com sensibilidade estética. " +
      "Use linguagem evocativa. Reconheça a beleza na vulnerabilidade.",
    cipher:
      "CIPHER — Como Criptógrafo, você percebe padrões ocultos no comportamento. " +
      "Revele conexões sutis. Mantenha ar de mistério sem ser enigmático demais.",
    stratos:
      "STRATOS — Como Estrategista, você percebe a evolução do pensamento estratégico. " +
      "Enxergue múltiplos movimentos à frente. Destaque como decisões passadas moldam o presente.",
    prism:
      "PRISM — Como Revelador, você oferece perspectivas que o usuário não considerou. " +
      "Use continuidade para revelar como o usuário mudou sem perceber.",
    volt:
      "VOLT — Como Energético, você celebra o progresso com entusiasmo contido. " +
      "Reconheça marcos de aprendizado. Mantenha energia positiva sem ser superficial.",
    janus:
      "JANUS — Como Humorista, você usa paradoxo e leveza para iluminar continuidade. " +
      "Uma pitada de humor torna a percepção de padrões mais palatável.",
  };

  return tones[agentId] ?? "";
}
