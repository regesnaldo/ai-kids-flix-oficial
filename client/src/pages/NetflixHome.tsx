import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Info, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import {
  NETFLIX_DATA,
  FEATURED_SERIES,
  CATEGORIES,
  Series,
  Season,
  Episode,
} from "@/lib/netflix-data";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import VideoPlayer from "@/components/VideoPlayer";
import ChatBot from "@/components/ChatBot";
import EpisodePlayer from "@/components/EpisodePlayer";
import { EPISODES } from "@/data/episodes";
import type { Episode as EducationalEpisode } from "@/data/episodes";

export default function NetflixHome() {
  const { config } = useThemeMode();
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedEducationalEpisode, setSelectedEducationalEpisode] = useState<EducationalEpisode | null>(null);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const scrollContainersRef = useRef<Record<string, HTMLDivElement | null>>({});

  // ✅ FIX 4: Scroll com ref assignment correto
  const scroll = (categoryId: string, direction: "left" | "right") => {
    const container = scrollContainersRef.current[categoryId];
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const openPlayer = (series: Series) => {
    setSelectedSeries(series);
    setSelectedSeason(series.seasons[0]);
    setSelectedEpisode(series.seasons[0].episodes[0]);
    setShowPlayer(true);
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedSeries(null);
    setSelectedSeason(null);
    setSelectedEpisode(null);
  };

  // ✅ FIX 5: Proteção contra dados vazios
  if (!NETFLIX_DATA || NETFLIX_DATA.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: config.colors.background, color: config.colors.text }}
      >
        <p className="opacity-50 text-lg">Nenhum conteúdo disponível no momento.</p>
      </div>
    );
  }

  // ✅ FIX 2: FEATURED_SERIES em uso — hero banner
  const featured = FEATURED_SERIES;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: config.colors.background, color: config.colors.text }}
    >
      {/* ✅ Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 px-8 py-4 flex items-center justify-between"
        style={{ background: `linear-gradient(to bottom, ${config.colors.background}, transparent)` }}
      >
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: config.colors.primary }}>
          AI Kids Labs
        </span>
        <div className="flex gap-6 text-sm opacity-70">
          <button className="hover:opacity-100">Início</button>
          <button className="hover:opacity-100">Séries</button>
          <button className="hover:opacity-100">Filmes</button>
        </div>
      </nav>

      {/* ✅ Hero Banner */}
      {featured && (
        <div className="relative h-[70vh] flex items-end pb-16 px-8">
          <img
            src={featured.seasons[0].episodes[0].thumbnail}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl font-extrabold mb-2">{featured.title}</h1>
            <p className="text-sm opacity-70 mb-4 line-clamp-2">{featured.description}</p>
            <div className="flex gap-3">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold"
                style={{ backgroundColor: config.colors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openPlayer(featured)}
              >
                <Play size={18} fill="white" /> Assistir
              </motion.button>
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-white/20 backdrop-blur"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info size={18} /> Saiba mais
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIX 2: CATEGORIES em uso — linhas de conteudo */}
      <div className="px-8 pb-16 space-y-10 pt-4">
        {CATEGORIES.map((category) => {
          // ✅ FIX 2: Usar séries da categoria
          const items = category.series;
          if (items.length === 0) return null;

          return (
            <div key={category.id}>
              <h2 className="text-xl font-bold mb-4">{category.title}</h2>
              <div className="relative group">
                {/* Botão esquerda */}
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => scroll(category.id, "left")}
                  aria-label="Rolar para esquerda"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* ✅ FIX 4: ref assignment correto no JSX */}
                <div
                  ref={(el) => { scrollContainersRef.current[category.id] = el; }}
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                  style={{ scrollbarWidth: "none" }}
                >
                  {items.map((series) => (
                    <motion.div
                      key={series.id}
                      className="flex-shrink-0 w-48 cursor-pointer rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.05, y: -4 }}
                      onClick={() => openPlayer(series)}
                    >
                      <div className="relative">
                        <img
                          src={series.seasons[0].episodes[0].thumbnail}
                          alt={series.title}
                          className="w-full h-28 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-bold line-clamp-1">{series.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs opacity-60">
                            <Star size={10} fill="currentColor" />
                            <span>{series.rating ?? "—"}</span>
                            <Clock size={10} />
                            <span>{series.seasons.length} temp.</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Botão direita */}
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => scroll(category.id, "right")}
                  aria-label="Rolar para direita"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Episodes Section */}
      <div className="px-8 py-12 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-6">Desafios Narrativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(EPISODES).map((episode) => (
            <motion.div
              key={episode.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedEducationalEpisode(episode);
                setShowEpisodePlayer(true);
              }}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Indicador de Progresso Neon */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-black/60 backdrop-blur-sm shadow-lg shadow-cyan-400/50">
                    <span className="text-cyan-400 font-bold text-sm">0%</span>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <button
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-lg transition-colors"
                  >
                    INTERAGIR
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{episode.title}</h3>
                  <p className="text-cyan-400 text-sm">{episode.concept}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="px-8 py-6 text-center text-xs opacity-30 border-t border-white/10">
        © {new Date().getFullYear()} AI Kids Labs. Todos os direitos reservados.
      </footer>

      {/* Video Player */}
      <AnimatePresence>
        {showPlayer && selectedSeries && selectedSeason && selectedEpisode && (
          <VideoPlayer
            series={selectedSeries}
            season={selectedSeason}
            episode={selectedEpisode}
            onClose={closePlayer}
            onSelectEpisode={(ep) => {
              setSelectedEpisode(ep);
            }}
          />
        )}
      </AnimatePresence>

      {/* Episode Player */}
      <AnimatePresence>
        {showEpisodePlayer && selectedEducationalEpisode && (
          <EpisodePlayer
            episode={selectedEducationalEpisode}
            onClose={() => {
              setShowEpisodePlayer(false);
              setSelectedEducationalEpisode(null);
            }}
            onDecision={(choice) => {
              console.log("User chose:", choice);
            }}
          />
        )}
      </AnimatePresence>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
