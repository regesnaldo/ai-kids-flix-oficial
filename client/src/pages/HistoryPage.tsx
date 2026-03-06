import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Play, Calendar, BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface WatchedEpisode {
  id: number;
  title: string;
  seriesTitle: string;
  progressPercentage: number;
  lastWatchedDate: string;
  thumbnail?: string;
  episodeNumber: number;
  seasonNumber: number;
}

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const [watchedEpisodes, setWatchedEpisodes] = useState<WatchedEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch watch history
  const { data: historyData } = trpc.watchProgress.getWatchHistory.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (historyData) {
      const episodes: WatchedEpisode[] = historyData.map((item: any) => ({
        id: item.episodeId,
        title: item.episodeTitle || `Episódio ${item.episodeNumber}`,
        seriesTitle: item.seriesTitle || "Série",
        progressPercentage: item.progressPercentage || 0,
        lastWatchedDate: new Date(item.lastWatchedDate).toLocaleDateString("pt-BR"),
        episodeNumber: item.episodeNumber,
        seasonNumber: item.seasonNumber,
      }));
      setWatchedEpisodes(episodes);
      setIsLoading(false);
    }
  }, [historyData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080c18", color: "#ffffff" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 sm:px-6 md:px-8 py-4 border-b" style={{ borderColor: "rgba(0,140,255,0.1)", background: "linear-gradient(to bottom, rgba(8,12,24,0.95) 0%, rgba(8,12,24,0.8) 70%, transparent 100%)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <ChevronLeft size={24} color="#fff" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Histórico de Assistência</h1>
            <p className="text-gray-400 text-sm mt-1">
              {watchedEpisodes.length} episódio{watchedEpisodes.length !== 1 ? "s" : ""} assistido{watchedEpisodes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Carregando histórico...</div>
          </div>
        ) : watchedEpisodes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-block p-4 rounded-full bg-cyan-500/10 mb-4">
              <BarChart3 size={32} color="#00d4ff" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum episódio assistido</h2>
            <p className="text-gray-400 mb-6">
              Comece a assistir conteúdo para ver seu histórico aqui
            </p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Explorar Conteúdo
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchedEpisodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-lg overflow-hidden cursor-pointer"
                style={{ aspectRatio: "16/9" }}
              >
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      S{episode.seasonNumber}E{episode.episodeNumber}
                    </div>
                    <div className="text-sm text-gray-300">{episode.seriesTitle}</div>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Progress Bar */}
                {episode.progressPercentage > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                    <div
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${Math.min(episode.progressPercentage, 100)}%` }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">
                        {episode.title}
                      </h3>
                      <p className="text-xs text-gray-300">{episode.seriesTitle}</p>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="space-y-2">
                    {/* Progress Info */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Progresso</span>
                      <span className="text-cyan-400 font-semibold">
                        {Math.round(episode.progressPercentage)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${episode.progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      />
                    </div>

                    {/* Date and Resume Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar size={12} />
                        <span>{formatDate(episode.lastWatchedDate)}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                      >
                        <Play size={12} fill="#fff" color="#fff" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
