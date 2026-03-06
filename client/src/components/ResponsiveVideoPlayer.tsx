import { useState, useEffect } from "react";
import { Layers, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import HLSPlayer from "./HLSPlayer";

interface Episode {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  seriesId: number;
  seasonNumber: number;
  episodeNumber: number;
}

export default function ResponsiveVideoPlayer() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [initialTime, setInitialTime] = useState(0);

  // Mutations para salvar progresso
  const updateProgressMutation = trpc.watchProgress.updateProgress.useMutation();

  // Query para buscar progresso do episódio atual
  const { data: progressData } = trpc.watchProgress.getEpisodeProgress.useQuery(
    { episodeId: currentEpisodeId! },
    { enabled: !!currentEpisodeId }
  );

  // Buscar episódios do banco de dados (usando série ID 1 como padrão)
  const { data: episodesData, isLoading } = trpc.episodes.getBySeriesId.useQuery({
    seriesId: 1,
  });

  const episodes: Episode[] =
    episodesData?.map((ep: any) => ({
      id: ep.id,
      title: ep.title,
      duration: `${Math.floor((ep.durationSeconds || 0) / 60)}:${((ep.durationSeconds || 0) % 60).toString().padStart(2, "0")}`,
      videoUrl: ep.videoUrl || "",
      seriesId: ep.seriesId,
      seasonNumber: ep.seasonNumber,
      episodeNumber: ep.episodeNumber,
    })) || [];

  const handleEpisodeClick = async (episode: Episode) => {
    console.log("Episódio selecionado:", episode);
    setCurrentEpisodeId(episode.id);
    setVideoUrl(episode.videoUrl);
    setShowSidebar(false);
  };

  // Atualizar initialTime quando progresso for carregado
  useEffect(() => {
    if (progressData && progressData.progressSeconds) {
      setInitialTime(progressData.progressSeconds);
    } else {
      setInitialTime(0);
    }
  }, [progressData]);

  // Callback para salvar progresso a cada 5 segundos
  const handleProgress = (currentTime: number, duration: number) => {
    if (!currentEpisode) return;

    const isCompleted = currentTime / duration >= 0.9;

    updateProgressMutation.mutate({
      seriesId: currentEpisode.seriesId,
      episodeId: currentEpisode.id,
      seasonNumber: currentEpisode.seasonNumber,
      episodeNumber: currentEpisode.episodeNumber,
      progressSeconds: Math.floor(currentTime),
      totalSeconds: Math.floor(duration),
      isCompleted,
    });
  };

  // Callback quando vídeo termina
  const handleVideoEnded = () => {
    if (!currentEpisode) return;

    // Marcar como completo
    updateProgressMutation.mutate({
      seriesId: currentEpisode.seriesId,
      episodeId: currentEpisode.id,
      seasonNumber: currentEpisode.seasonNumber,
      episodeNumber: currentEpisode.episodeNumber,
      progressSeconds: 0,
      totalSeconds: 0,
      isCompleted: true,
    });

    // Avançar para próximo episódio
    handleNextEpisode();
  };

  const handleNextEpisode = () => {
    if (!currentEpisodeId || episodes.length === 0) return;
    const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      handleEpisodeClick(nextEpisode);
    }
  };

  const handleClosePlayer = () => {
    setCurrentEpisodeId(null);
    setVideoUrl(null);
  };

  const currentEpisode = episodes.find((ep) => ep.id === currentEpisodeId);

  // Se não há episódio selecionado, mostrar lista
  if (!currentEpisodeId || !videoUrl) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-6xl w-full px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
            Selecione um Episódio
          </h1>

          {isLoading ? (
            <div className="text-white text-center text-xl">Carregando episódios...</div>
          ) : episodes.length === 0 ? (
            <div className="text-white text-center text-xl">
              Nenhum episódio disponível no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((episode, index) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeClick(episode)}
                  className="group relative p-4 bg-white/5 border border-white/10 rounded-lg transition-all duration-200 hover:bg-cyan-500/20 hover:scale-[1.02] hover:border-cyan-400 text-left"
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded flex items-center justify-center mb-3 border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold text-3xl">
                      {episode.episodeNumber}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="text-white font-medium text-base mb-1 line-clamp-2">
                    {episode.title}
                  </div>
                  <div className="text-gray-400 text-sm">{episode.duration}</div>

                  {/* Badge NOVO no primeiro episódio */}
                  {index === 0 && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      NOVO
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Player ativo
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* HLSPlayer Real */}
      <HLSPlayer
        videoUrl={videoUrl}
        title={currentEpisode?.title || "Episódio"}
        subtitle={`Temporada ${currentEpisode?.seasonNumber} • Episódio ${currentEpisode?.episodeNumber}`}
        onClose={handleClosePlayer}
        onProgress={handleProgress}
        onEnded={handleVideoEnded}
        initialTime={initialTime}
      />

      {/* Botão Lista de Episódios (flutuante) */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute top-20 right-4 z-30 p-3 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:text-cyan-400 hover:bg-black/80 transition-all duration-200 hover:scale-110"
        aria-label="Lista de episódios"
      >
        <Layers className="w-6 h-6" />
      </button>

      {/* Overlay (fecha sidebar ao clicar fora) */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSidebar(false)}
            className="absolute inset-0 bg-black/70 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar de Episódios - Desktop/Tablet (lateral direita) */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Desktop/Tablet: Sidebar lateral */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="hidden sm:block fixed top-0 right-0 bottom-0 w-64 md:w-80 bg-black/90 backdrop-blur-xl border-l border-cyan-500/30 z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-cyan-500/30 p-4 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg md:text-xl">Episódios</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-white hover:text-cyan-400 transition p-1"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Lista de Episódios */}
              <div className="p-4 space-y-3">
                {episodes.map((episode, index) => (
                  <button
                    key={episode.id}
                    onClick={() => handleEpisodeClick(episode)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-cyan-500/20 hover:scale-[1.02] ${
                      episode.id === currentEpisodeId
                        ? "bg-cyan-500/30 border border-cyan-400"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold text-lg">
                        {episode.episodeNumber}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium text-base mb-1 line-clamp-2">
                        {episode.title}
                      </div>
                      <div className="text-gray-400 text-sm">{episode.duration}</div>
                    </div>

                    {/* Badge NOVO no primeiro episódio */}
                    {index === 0 && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                        NOVO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Mobile: Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="sm:hidden fixed bottom-0 left-0 right-0 h-[70vh] bg-black/95 backdrop-blur-xl border-t border-cyan-500/30 z-50 overflow-y-auto rounded-t-3xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-cyan-500/30 p-4 flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">Episódios</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-white hover:text-cyan-400 transition p-1"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Lista de Episódios */}
              <div className="p-4 space-y-3">
                {episodes.map((episode, index) => (
                  <button
                    key={episode.id}
                    onClick={() => handleEpisodeClick(episode)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all active:scale-95 ${
                      episode.id === currentEpisodeId
                        ? "bg-cyan-500/30 border border-cyan-400"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold text-sm">
                        {episode.episodeNumber}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium text-sm mb-1 line-clamp-2">
                        {episode.title}
                      </div>
                      <div className="text-gray-400 text-xs">{episode.duration}</div>
                    </div>

                    {/* Badge NOVO no primeiro episódio */}
                    {index === 0 && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                        NOVO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
