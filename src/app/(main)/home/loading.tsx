/**
 * loading.tsx — Fallback de carregamento da Home.
 *
 * A home é a porta de entrada do metaverso.
 * Carrega partículas, hero banner e grid de universos.
 */

export default function HomeLoading() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col items-center justify-center bg-[#0a0a1a]">
      {/* Spinner de entrada */}
      <div className="relative mb-6 h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#00f0ff] border-r-[#a855f7]" />
        <div className="absolute inset-3 animate-pulse rounded-full bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          ⚡
        </span>
      </div>

      <p className="text-lg font-bold text-white">
        <span>MENTE</span>
        <span className="text-[#E50914]">.AI</span>
      </p>

      <p className="mt-3 text-sm text-white/30">
        Inicializando o metaverso narrativo...
      </p>

      {/* Barra de progresso */}
      <div className="mt-6 h-0.5 w-56 overflow-hidden rounded-full bg-white/5">
        <div className="h-full animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent [background-size:200%_100%]" />
      </div>
    </div>
  );
}
