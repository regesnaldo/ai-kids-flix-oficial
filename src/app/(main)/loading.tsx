/**
 * loading.tsx — Fallback de carregamento para TODAS as rotas do route group (main).
 *
 * Exibido durante navegação e carregamento inicial de páginas.
 * Usa o layout (main) com header — apenas o conteúdo é substituído.
 */

export default function MainLoading() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner cinemático */}
        <div className="relative h-12 w-12">
          {/* Anel externo */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#00f0ff] border-r-[#a855f7] opacity-70" />
          {/* Anel interno — rotação reversa */}
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-[#ec4899] border-l-[#00f0ff] [animation-direction:reverse] [animation-duration:0.8s]" />
          {/* Núcleo pulsante */}
          <div className="absolute inset-[30%] animate-pulse rounded-full bg-[#00f0ff]/20 shadow-[0_0_12px_rgba(0,240,255,0.3)]" />
        </div>

        <p className="text-sm font-medium text-white/40">
          Conectando ao metaverso...
        </p>
      </div>
    </div>
  );
}
