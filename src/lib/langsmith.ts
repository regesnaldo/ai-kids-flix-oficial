// ─── src/lib/langsmith.ts ───────────────────────────────────────────────────
//
// LangSmith tracing — auto-instrumenta chamadas LLM para monitoramento.
// Docs: https://docs.smith.langchain.com
//
// Configurar no .env.local:
//   LANGSMITH_API_KEY=ls__...
//   LANGSMITH_PROJECT=mente-ai
//   LANGSMITH_TRACING=true
//
// Se LANGSMITH_API_KEY não estiver definida, o tracing é desabilitado
// sem erros — seguro para desenvolvimento local.

let initialized = false;

export function initLangSmith() {
  if (initialized) return;
  if (!process.env.LANGSMITH_API_KEY) return;

  // LangSmith auto-instrumenta via variáveis de ambiente.
  // Apenas precisamos confirmar que estão configuradas.
  if (process.env.LANGSMITH_TRACING !== 'true') {
    process.env.LANGSMITH_TRACING = 'true';
  }

  initialized = true;
  console.log('[LangSmith] Tracing enabled for project:', process.env.LANGSMITH_PROJECT || 'mente-ai');
}

// Health check para o Sentinela
export async function checkLangSmithHealth(): Promise<{ enabled: boolean; project: string | null }> {
  return {
    enabled: !!process.env.LANGSMITH_API_KEY,
    project: process.env.LANGSMITH_PROJECT || null,
  };
}
