// ─── CONTENT ENGINE — Camada única de geração de conteúdo ───────────────
//
// Responsabilidades:
//   1. Resolução de provedor (com fallback automático)
//   2. Chamada ao LLM
//   3. Tratamento de erros
//   4. Logs padronizados
//   5. Retorno padronizado
//
// Todo fluxo de geração de conteúdo DEVE passar por esta camada.

import { resolveProviderWithFallback, chat } from "./provider";
import type { LLMProvider } from "./provider";

export interface ContentRequest {
  messages: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
}

export interface ContentResponse {
  provider: LLMProvider;
  content: string;
}

/**
 * Gera conteúdo através do provedor LLM disponível.
 * Fluxo: resolveProviderWithFallback() → DeepSeek ping → Groq ping → chat()
 *
 * @throws Se nenhum provedor estiver disponível
 */
export async function generateContent(
  request: ContentRequest,
): Promise<ContentResponse> {
  const resolved = await resolveProviderWithFallback();

  console.log(
    `[CONTENT_ENGINE] GENERATING VIA ${resolved.provider.toUpperCase()}`,
  );

  const content = await chat(resolved, request.messages, {
    maxTokens: request.maxTokens,
    temperature: request.temperature,
  });

  return { provider: resolved.provider, content };
}

/**
 * Versão simplificada para chamadas system + user.
 * Mantida para compatibilidade com agentRunner e APIs antigas.
 */
export async function generateChat(
  system: string,
  prompt: string,
  options?: { maxTokens?: number; temperature?: number },
): Promise<ContentResponse> {
  return generateContent({
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    ...options,
  });
}
