/**
 * context-classifier.ts — Context Priority Engine (Estratégia B — Moderate).
 *
 * Classifica cada conversa em 5 categorias e determina quais
 * camadas cognitivas devem ser injetadas no system prompt.
 *
 * Inspirado pelo diagnóstico de consumo de tokens:
 *   Prompt padrão: ~950 tokens → Com compressão: ~620 tokens (-35%)
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ConversationType =
  | "factual-simple"
  | "emotional"
  | "strategic"
  | "technical"
  | "conflito";

export type CognitiveLayer =
  | "memory"
  | "recall"
  | "relationship"
  | "reflection"
  | "conflicts"
  | "continuity"
  | "language"
  | "identity";

// ─── Mapa de Ativação (Estratégia B) ──────────────────────────────────────────

const ACTIVATION_MAP: Record<ConversationType, Record<CognitiveLayer, boolean>> = {
  "factual-simple": {
    memory: true,
    recall: false,
    relationship: false,
    reflection: false,
    conflicts: true,
    continuity: false,
    language: true,
    identity: true,
  },
  emotional: {
    memory: true,
    recall: true,
    relationship: true,
    reflection: true,
    conflicts: true,
    continuity: true,
    language: true,
    identity: true,
  },
  strategic: {
    memory: true,
    recall: true,
    relationship: true,
    reflection: true,
    conflicts: true,
    continuity: true,
    language: true,
    identity: true,
  },
  technical: {
    memory: true,
    recall: true,
    relationship: false,
    reflection: false,
    conflicts: true,
    continuity: true,
    language: false,
    identity: true,
  },
  conflito: {
    memory: true,
    recall: true,
    relationship: true,
    reflection: true,
    conflicts: true,
    continuity: true,
    language: true,
    identity: true,
  },
};

// ─── Safety Nets ──────────────────────────────────────────────────────────────

/** Usuários com muitas interações merecem todas as camadas */
const POWER_USER_THRESHOLD = 50;

// ─── Classificador ────────────────────────────────────────────────────────────

/**
 * Classifica a conversa atual baseado no conteúdo da mensagem e no histórico.
 *
 * Ordem de precedência:
 *   1. Conflito ativo → "conflito"
 *   2. Palavras emocionais → "emotional"
 *   3. Palavras estratégicas + interações > 30 → "strategic"
 *   4. Palavras técnicas + mensagem > 60 chars → "technical"
 *   5. Fallback → "factual-simple"
 */
export function classifyConversation(
  message: string,
  interactionCount: number,
  hasActiveConflict: boolean,
): ConversationType {
  if (hasActiveConflict) return "conflito";

  const text = message.toLowerCase().trim();
  const chars = text.length;

  const hasEmotion =
    /(sinto|medo|ansio|triste|feliz|preocup|insegur|angust|raiva|depress)/i.test(
      text,
    );

  if (hasEmotion) return "emotional";

  const hasStrategy =
    /(decidir|estrateg|planejar|evoluir|proxim|carreira|aplicar|caminho|futuro|meta)/i.test(
      text,
    );

  if (hasStrategy && interactionCount > 30) return "strategic";

  const hasTechnical =
    /(algoritm|gradient|arquitetur|otimiz|parametr|camada|função|loss|code|bug|error|react|api|database)/i.test(
      text,
    );

  if (hasTechnical && chars > 60) return "technical";

  return "factual-simple";
}

// ─── Decisor de Injeção ───────────────────────────────────────────────────────

/**
 * Decide se uma camada cognitiva deve ser injetada no prompt.
 *
 * Regras (em ordem):
 *   1. Usuário com +50 interações → TODAS as camadas ativas
 *   2. Caso contrário → segue o mapa de ativação da categoria
 */
export function shouldInject(
  layer: CognitiveLayer,
  type: ConversationType,
  interactionCount: number,
): boolean {
  // Safety net: power users get everything
  if (interactionCount > POWER_USER_THRESHOLD) return true;

  return ACTIVATION_MAP[type][layer];
}
