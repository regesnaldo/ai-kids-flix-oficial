import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Maximize, X } from "lucide-react";
import { Series, Season, Episode } from "@/lib/netflix-data";
import { useThemeMode } from "@/contexts/ThemeModeContext";

export default function VideoPlayer({
  series,
  season,
  episode,
  onClose,
  onSelectEpisode,
}: {
  series: Series;
  season: Season;
  episode: Episode;
  onClose: () => void;
  onSelectEpisode: (ep: Episode) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const { config } = useThemeMode();

  // ✅ Simular progresso enquanto isPlaying = true
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + 0.5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // ✅ Atalho de teclado Space para play/pause
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (e.code === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ✅ Navegar entre episódios com SkipBack / SkipForward
  const currentIndex = season.episodes.findIndex((ep) => ep.id === episode.id);

  const handleSkipBack = () => {
    if (currentIndex > 0) {
      setProgress(0);
      setIsPlaying(false);
      onSelectEpisode(season.episodes[currentIndex - 1]);
    }
  };

  const handleSkipForward = () => {
    if (currentIndex < season.episodes.length - 1) {
      setProgress(0);
      setIsPlaying(false);
      onSelectEpisode(season.episodes[currentIndex + 1]);
    }
  };

  // ✅ Fullscreen
  const handleMaximize = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* CONTAINER PRINCIPAL - relative para absolute positioning */}
      <div className="relative w-full h-screen bg-black overflow-hidden">
        
        {/* VÍDEO - ocupa 100% SEMPRE */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover opacity-30"
          />
          <motion.button
            className="absolute p-6 rounded-full"
            style={{
              backgroundColor: config.colors.primary,
              boxShadow: `0 0 40px ${config.colors.primary}66`,
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause size={40} /> : <Play size={40} fill="white" />}
          </motion.button>
        </div>

        {/* HEADER - sobre o vídeo */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              aria-label="Voltar"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold">
                {series.title} - Temporada {season.seasonNumber}
              </h2>
              <p className="text-sm opacity-70">{episode.title}</p>
            </div>
          </div>
        </div>

        {/* CONTROLES - barra inferior fixa sobre o vídeo */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
          {/* Progress */}
          <div className="mb-4">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: config.colors.primary }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 opacity-70">
              <span>0:00</span>
              <span>{episode.duration}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30"
                onClick={handleSkipBack}
                disabled={currentIndex === 0}
                aria-label="Episódio anterior"
              >
                <SkipBack size={24} />
              </button>

              <button
                className="p-3 rounded-full"
                style={{ backgroundColor: config.colors.primary }}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
              </button>

              <button
                className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30"
                onClick={handleSkipForward}
                disabled={currentIndex === season.episodes.length - 1}
                aria-label="Próximo episódio"
              >
                <SkipForward size={24} />
              </button>

              <button
                className="p-2 hover:bg-white/10 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Ativar som" : "Mutar"}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Botão de Episódios */}
              <button
                className="p-2 hover:bg-white/10 rounded-full"
                onClick={() => setShowEpisodes(!showEpisodes)}
                aria-label="Mostrar episódios"
              >
                <motion.div
                  animate={{ rotate: showEpisodes ? 180 : 0 }}
                >
                  <ChevronLeft size={24} />
                </motion.div>
              </button>

              {/* Maximize */}
              <button
                className="p-2 hover:bg-white/10 rounded-full"
                onClick={handleMaximize}
                aria-label="Tela cheia"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* PAINEL FLUTUANTE - só aparece quando showEpisodes = true */}
        {showEpisodes && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-0 right-0 h-full w-[380px] z-40 
                       bg-[#1a1a1a] overflow-y-auto shadow-2xl"
          >
            {/* HEADER DO PAINEL */}
            <div className="flex justify-between items-center px-5 py-4 
                            border-b border-white/10 sticky top-0 bg-[#1a1a1a]">
              <h2 className="text-white font-bold text-lg">Minissérie</h2>
              <button
                onClick={() => setShowEpisodes(false)}
                className="text-white text-xl hover:text-gray-400 transition"
                aria-label="Fechar painel"
              >
                <X size={24} />
              </button>
            </div>

            {/* LISTA DE EPISÓDIOS */}
            {season.episodes.map((ep) => {
              const isActive = ep.id === episode.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setProgress(0);
                    setIsPlaying(false);
                    onSelectEpisode(ep);
                    setShowEpisodes(false);
                  }}
                  className={`flex gap-3 p-4 cursor-pointer border-b border-white/10
                    transition ${
                      isActive
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                >
                  <span className="text-gray-400 w-5 pt-1 text-sm font-semibold">
                    {ep.id}
                  </span>
                  <img
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-28 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-white text-sm font-semibold line-clamp-2">
                      {ep.title}
                    </p>
                    <p className="text-gray-400 text-xs">{ep.duration}</p>
                    {isActive && (
                      <p className="text-gray-300 text-xs leading-snug line-clamp-3">
                        {ep.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* OVERLAY INVISÍVEL PARA FECHAR PAINEL AO CLICAR FORA */}
        {showEpisodes && (
          <div
            className="absolute inset-0 z-30"
            onClick={() => setShowEpisodes(false)}
          />
        )}
      </div>
    </motion.div>
  );
}
