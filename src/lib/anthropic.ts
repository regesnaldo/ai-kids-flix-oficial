/**
 * MENTE.AI — Shim de back-compat para o adapter Anthropic.
 *
 * A lógica (SDK + retry + streaming) foi movida para
 * src/lib/llm/adapters/anthropic.ts (dentro da camada centralizada).
 * Este arquivo apenas re-exporta a API legada para não quebrar
 * importadores existentes. NÃO importa @anthropic-ai/sdk aqui.
 *
 * Novo código deve usar generateLLM()/streamLLM() de @/lib/llm.
 */

export {
  anthropicCompletionText,
  anthropicStream,
  ANTHROPIC_MODELO_PADRAO,
  type AnthropicMensagem,
} from "@/lib/llm/adapters/anthropic";
