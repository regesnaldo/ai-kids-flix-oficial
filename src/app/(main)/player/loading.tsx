/**
 * loading.tsx — Fallback de carregamento do Player.
 *
 * O player carrega vídeo + chat NEXUS + TTS (ElevenLabs).
 * Fallback cinemático enquanto os recursos são inicializados.
 */

export default function PlayerLoading() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-[#0a0a1a]">
      <div className="flex flex-col items-center gap-5">
        {/* Ícone de play pulsante */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-[#E50914]/30 [animation-duration:2s]" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#E50914]/10" />
          <svg
            className="relative z-10 h-8 w-8 text-[#E50914]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-white/50">
            Preparando seu episódio
          </p>
          <p className="mt-1 text-xs text-white/20">
            Conectando ao NEXUS e carregando mídia...
          </p>
        </div>
      </div>
    </div>
  );
}
