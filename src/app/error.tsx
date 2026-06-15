"use client";

/**
 * error.tsx — Barreira de erros do segmento raiz.
 *
 * Captura falhas em páginas do segmento "/" (ex: page.tsx que redireciona).
 * NÃO captura falhas no layout raiz (isso é papel do global-error.tsx).
 *
 * Quando um erro ocorre em children de layout.tsx, este componente
 * renderiza no lugar da página com erro, preservando o layout ao redor.
 */

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a] px-4">
      <div className="w-full max-w-md text-center">
        {/* Glass card */}
        <div className="rounded-modal border border-white/10 bg-[rgba(20,20,50,0.6)] p-8 backdrop-blur-[16px]">
          <div className="mb-4 text-4xl">🔮</div>

          <h2 className="mb-3 text-xl font-bold text-[#00f0ff] [text-shadow:0_0_12px_rgba(0,240,255,0.3)]">
            Oscilação Detectada
          </h2>

          <p className="mb-2 text-sm leading-relaxed text-white/50">
            Um erro inesperado interrompeu este segmento. O NEXUS já foi
            notificado.
          </p>

          {error.digest && (
            <p className="mb-5 font-mono text-[0.7rem] text-white/20 break-all">
              {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="rounded-[10px] border border-purple-500/40 bg-gradient-to-br from-purple-500/30 to-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-purple-500/50 hover:to-cyan-400/25 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}
