/**
 * loading.tsx — Fallback de carregamento específico do Laboratório.
 *
 * O Lab carrega Three.js, partículas, e componentes pesados.
 * Este fallback é mais imersivo que o genérico.
 */

export default function LabLoading() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a]">
      <div className="flex flex-col items-center gap-5">
        {/* Ícone do laboratório */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#a855f7]/10 shadow-[0_0_24px_rgba(168,85,247,0.2)]" />
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-[#a855f7] border-r-[#00f0ff]" />
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            🧪
          </span>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-white/60">
            Preparando o Laboratório
          </p>
          <p className="mt-1 text-xs text-white/25">
            Inicializando agentes e partículas...
          </p>
        </div>

        {/* Barra de progresso indeterminada */}
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-[shimmer_2s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-[#a855f7] to-transparent [background-size:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
