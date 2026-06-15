"use client";

/**
 * error.tsx — Barreira de erros do route group (main).
 *
 * Captura falhas em qualquer página dentro de /home, /lab, /universo,
 * /aulas, /player, /agentes, /explorar, /perfil, /conta, etc.
 *
 * O layout (main)/layout.tsx (header + navegação) é PRESERVADO.
 * Apenas o conteúdo da página com erro é substituído por este fallback.
 */

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a] px-4">
      <div className="w-full max-w-lg text-center">
        {/* Glass card */}
        <div className="rounded-modal border border-white/[0.06] bg-[rgba(20,20,50,0.5)] p-8 backdrop-blur-[12px] sm:p-10">
          {/* Icon com glow */}
          <div className="mb-5 text-5xl [filter:drop-shadow(0_0_16px_rgba(0,240,255,0.4))]">
            ⚡
          </div>

          <h2 className="mb-3 text-2xl font-bold text-white">
            <span className="text-[#00f0ff]">MENTE</span>
            <span className="text-[#E50914]">.AI</span>
          </h2>

          <p className="mb-2 text-base font-semibold text-white/80">
            Sinal Perdido no Metaverso
          </p>

          <p className="mb-5 text-sm leading-relaxed text-white/40">
            Uma interferência narrativa interrompeu este universo. O agente
            responsável está recalibrando a conexão.
          </p>

          {/* Error digest sutil para debug */}
          {error.digest && (
            <p className="mb-5 font-mono text-[0.7rem] text-white/15 break-all">
              rastro: {error.digest}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-[10px] border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-6 py-2.5 text-sm font-semibold text-[#00f0ff] transition-all duration-200 hover:bg-[#00f0ff]/20 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)]"
            >
              Reconectar
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-[10px] border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white/80"
            >
              Recarregar Página
            </button>
          </div>

          <p className="mt-6 text-xs text-white/20">
            Se o erro persistir, volte ao início ou tente em instantes.
          </p>
        </div>
      </div>
    </div>
  );
}
