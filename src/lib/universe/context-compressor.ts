/**
 * ─── CONTEXT COMPRESSOR — Memory Compaction Before Inference ──────────────────
 *
 * NEVER send full conversation history to the AI.
 *
 * Compression pipeline:
 *   1. Extract key concepts from message history
 *   2. Summarize insights as compact bullet points
 *   3. Identify user intent from last messages
 *   4. Enforce maxContextTokens from planet registry
 *   5. Return compressed memory + last 3 raw messages
 *
 * The AI receives: compressedContext (small) + recent messages (bounded).
 * Full history stays in the database — never in the prompt.
 */

import { planetRegistry, type PlanetId } from "./planet-registry";
import { nexusBus } from "@/lib/nexus/nexus.events";
import type { MessageStub, CompressedContext } from "./context.types";

// Re-export for backward compatibility (nexus.types.ts and others)
export type { MessageStub, CompressedContext } from "./context.types";

// ─── ESTIMATION ───────────────────────────────────────────────────────────────

/**
 * Rough token estimation (4 chars ≈ 1 token for English/Portuguese mix).
 * Overestimate slightly to stay safely under limits.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

// ─── EXTRACTION HELPERS ───────────────────────────────────────────────────────

/**
 * Extract key concepts from messages using lightweight heuristics.
 * No AI call needed — this is pre-inference compression.
 */
function extractKeyConcepts(messages: MessageStub[]): string[] {
  const concepts = new Set<string>();

  // Common concept markers in Portuguese and English
  const conceptPatterns = [
    /\b(aprender|ensinar|explicar|entender|compreender)\b/gi,
    /\b(criar|construir|desenvolver|programar|codificar)\b/gi,
    /\b(erro|bug|falha|problema|consertar|corrigir)\b/gi,
    /\b(otimizar|melhorar|performance|rápido|lento)\b/gi,
    /\b(segurança|proteger|privacidade|cripto)\b/gi,
    /\b(dados|informação|conhecimento|sabedoria)\b/gi,
    /\b(emoção|sentir|medo|raiva|alegria|tristeza)\b/gi,
    /\b(decisão|escolha|caminho|futuro|destino)\b/gi,
    /\b(conectar|rede|sistema|fluxo|arquitetura)\b/gi,
    /\b(transformar|mudar|evoluir|crescer)\b/gi,
  ];

  for (const msg of messages) {
    for (const pattern of conceptPatterns) {
      const matches = msg.content.match(pattern);
      if (matches) {
        for (const m of matches) {
          concepts.add(m.toLowerCase());
        }
      }
    }
  }

  // Limit to 8 key concepts
  return Array.from(concepts).slice(0, 8);
}

/**
 * Generate compact insight summaries from message content.
 * Uses sentence boundary detection to extract meaningful fragments.
 */
function extractInsights(messages: MessageStub[]): string[] {
  const insights: string[] = [];
  const seen = new Set<string>();

  for (const msg of messages) {
    // Extract sentences that contain insight markers
    const sentences = msg.content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(
        (s) =>
          s.length > 20 &&
          s.length < 150 &&
          !s.startsWith("http") &&
          !seen.has(s)
      );

    for (const sentence of sentences) {
      // Insight markers: revelatory or discovery-oriented language
      const insightPatterns = [
        /\b(descobri|percebi|notei|entendi|aprendi)\b/i,
        /\b(o importante é|a chave é|o segredo|o ponto)\b/i,
        /\b(agora eu sei|ficou claro|finalmente)\b/i,
        /\b(mudou minha|transformou|revelou)\b/i,
      ];

      if (insightPatterns.some((p) => p.test(sentence))) {
        insights.push(sentence);
        seen.add(sentence);
      }
    }
  }

  // Take last 5 insights, or fill with generic summaries from last messages
  if (insights.length === 0 && messages.length > 0) {
    const lastUserMessages = messages
      .filter((m) => m.role === "user")
      .slice(-3);
    for (const msg of lastUserMessages) {
      const truncated =
        msg.content.length > 120
          ? msg.content.slice(0, 117) + "..."
          : msg.content;
      insights.push(`Usuário perguntou: ${truncated}`);
    }
  }

  return insights.slice(-5);
}

/**
 * Detect user level from message complexity.
 */
function detectUserLevel(messages: MessageStub[]): "beginner" | "intermediate" | "advanced" {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return "beginner";

  let complexityScore = 0;

  for (const msg of userMessages) {
    const text = msg.content;
    // Longer messages → more experienced
    if (text.length > 200) complexityScore += 2;
    else if (text.length > 80) complexityScore += 1;

    // Technical vocabulary → advanced
    const technicalTerms =
      /\b(api|async|await|hook|state|props|component|render|server|client|database|query|mutation|schema|migration|deploy|pipeline|docker|kubernetes|lambda|function|class|interface|type|generic|promise|observable|subscription)\b/gi;
    const techMatches = text.match(technicalTerms);
    if (techMatches) complexityScore += techMatches.length;

    // Abstract concepts → advanced
    const abstractTerms =
      /\b(arquitetura|design pattern|paradigma|abstração|encapsulamento|polimorfismo|herança|composição|injeção|inversão|declarativo|imperativo|funcional|reativo)\b/gi;
    const abstractMatches = text.match(abstractTerms);
    if (abstractMatches) complexityScore += abstractMatches.length * 2;
  }

  if (complexityScore >= 10) return "advanced";
  if (complexityScore >= 4) return "intermediate";
  return "beginner";
}

/**
 * Infer user intent from the last 2 messages.
 */
function inferIntent(messages: MessageStub[]): string {
  const recent = messages.filter((m) => m.role === "user").slice(-2);
  if (recent.length === 0) return "exploração inicial";

  const combined = recent.map((m) => m.content).join(" ").toLowerCase();

  if (/\b(aprender|ensinar|explicar|como|o que é|entender)\b/i.test(combined)) {
    return "aprendizado";
  }
  if (/\b(criar|construir|fazer|implementar|desenvolver)\b/i.test(combined)) {
    return "criação";
  }
  if (/\b(consertar|corrigir|bug|erro|problema|falha|debug)\b/i.test(combined)) {
    return "correção";
  }
  if (/\b(analisar|avaliar|revisar|opinião|acha|pensa)\b/i.test(combined)) {
    return "análise";
  }
  if (/\b(explorar|descobrir|conhecer|mostrar|apresentar)\b/i.test(combined)) {
    return "exploração";
  }
  if (/\b(ajuda|socorro|perdido|confuso|não sei|difícil)\b/i.test(combined)) {
    return "suporte";
  }

  return "conversa";
}

// ─── MAIN COMPRESSOR ──────────────────────────────────────────────────────────

/**
 * Compress full message history into a compact context object.
 *
 * @param messages - Full message history (oldest first)
 * @param planetId - Current planet for token limit
 * @returns CompressedContext ready for prompt injection
 */
export function compressMemory(
  messages: MessageStub[],
  planetId: PlanetId
): CompressedContext {
  const planet = planetRegistry[planetId];
  const maxTokens = planet.maxContextTokens;

  const keyConcepts = extractKeyConcepts(messages);
  const unlockedInsights = extractInsights(messages);
  const userLevel = detectUserLevel(messages);
  const lastIntent = inferIntent(messages);

  const context: CompressedContext = {
    keyConcepts,
    unlockedInsights,
    userLevel,
    lastIntent,
    compressedAt: Date.now(),
    planetId,
    estimatedTokens: 0,
  };

  // Estimate token count of the compressed context
  const contextText = JSON.stringify(context);
  context.estimatedTokens = estimateTokens(contextText);

  // If compressed context alone exceeds the limit, trim insights
  while (context.estimatedTokens > maxTokens * 0.4 && context.unlockedInsights.length > 0) {
    context.unlockedInsights.pop();
    context.estimatedTokens = estimateTokens(JSON.stringify(context));
  }

  // Emit compression event for diagnostics
  nexusBus.emit({
    type: "CONTEXT_COMPRESSED",
    planetId,
    tokenCount: context.estimatedTokens,
  });

  return context;
}

/**
 * Build the final prompt payload: compressed context + last 3 messages.
 * This is what gets sent to the AI — never the full history.
 */
export function buildInferencePayload(
  compressed: CompressedContext,
  recentMessages: MessageStub[],
  systemPrompt: string
): { system: string; messages: MessageStub[] } {
  const planet = planetRegistry[compressed.planetId];

  // Build compressed system context
  const contextBlock = [
    `[CONTEXTO COMPRIMIDO — PLANETA: ${planet.name}]`,
    `Nível do usuário: ${compressed.userLevel}`,
    `Intenção atual: ${compressed.lastIntent}`,
    compressed.keyConcepts.length > 0
      ? `Conceitos-chave: ${compressed.keyConcepts.join(", ")}`
      : "",
    compressed.unlockedInsights.length > 0
      ? `Insights desbloqueados:\n${compressed.unlockedInsights.map((i) => `  - ${i}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const fullSystemPrompt = `${systemPrompt}\n\n${contextBlock}`;

  // Take only the last 3 messages
  const trimmedMessages = recentMessages.slice(-3);

  return {
    system: fullSystemPrompt,
    messages: trimmedMessages,
  };
}
