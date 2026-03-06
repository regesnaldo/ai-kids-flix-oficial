import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import VideoInteractionOverlay from "./VideoInteractionOverlay";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  X,
  Settings,
  Subtitles,
  ChevronLeft,
} from "lucide-react";

interface HLSPlayerProps {
  videoUrl: string | null;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  onClose: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  initialTime?: number;
  seriesId?: number;
  episodeId?: number;
  seriesTitle?: string;
  ageGroup?: "child" | "teen" | "adult";
}

// Demo HLS streams for testing when no real URL is available
const DEMO_STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
  "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8",
];

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HLSPlayer({
  videoUrl,
  title,
  subtitle,
  thumbnail,
  onClose,
  onProgress,
  onEnded,
  initialTime = 0,
  seriesId,
  episodeId,
  seriesTitle,
  ageGroup = "teen",
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qualityLevels, setQualityLevels] = useState<{ height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showInteractionOverlay, setShowInteractionOverlay] = useState(false);

  // Determine the stream URL
  const streamUrl = videoUrl || DEMO_STREAMS[Math.floor(Math.random() * DEMO_STREAMS.length)];

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1, // auto quality
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          setIsLoading(false);
          const levels = data.levels.map((l) => ({
            height: l.height,
            bitrate: l.bitrate,
          }));
          setQualityLevels(levels);
          if (initialTime > 0) {
            video.currentTime = initialTime;
          }
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError("Erro de rede. Tentando reconectar...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Erro de mídia. Recuperando...");
                hls.recoverMediaError();
                break;
              default:
                setError("Erro ao carregar o vídeo.");
                hls.destroy();
                break;
            }
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          setCurrentQuality(data.level);
        });

        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          if (initialTime > 0) video.currentTime = initialTime;
        });
      }
    };

    initHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [streamUrl, initialTime]);

  // Track time updates (throttled - only update UI state, not save)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastUpdateTime = 0;
    const throttleMs = 500; // Update UI every 500ms to reduce re-renders

    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastUpdateTime >= throttleMs) {
        setCurrentTime(video.currentTime);
        setDuration(video.duration || 0);

        if (video.buffered.length > 0) {
          setBuffered(video.buffered.end(video.buffered.length - 1));
        }
        lastUpdateTime = now;
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onEndedHandler = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("ended", onEndedHandler);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("ended", onEndedHandler);
    };
  }, [onEnded]);

  // Progress save interval (every 5 seconds) + save on pause/unmount
  useEffect(() => {
    progressIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (video && isPlaying && onProgress) {
        onProgress(video.currentTime, video.duration || 0);
      }
    }, 5000);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      // Save progress when pausing or unmounting
      const video = videoRef.current;
      if (video && onProgress) {
        onProgress(video.currentTime, video.duration || 0);
      }
    };
  }, [isPlaying, onProgress]);

  // Save progress when video is paused
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPauseHandler = () => {
      if (onProgress) {
        onProgress(video.currentTime, video.duration || 0);
      }
    };

    video.addEventListener("pause", onPauseHandler);
    return () => {
      video.removeEventListener("pause", onPauseHandler);
    };
  }, [onProgress]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      resetHideTimer();

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
        case "ArrowUp":
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          setVolume(video.volume);
          break;
        case "ArrowDown":
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          setVolume(video.volume);
          break;
        case "m":
          video.muted = !video.muted;
          setIsMuted(video.muted);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFullscreen, onClose, resetHideTimer]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    if (val === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const setQuality = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
    }
    setShowQualityMenu(false);
  };

  const getQualityLabel = (height: number) => {
    if (height >= 2160) return "4K";
    if (height >= 1440) return "1440p";
    if (height >= 1080) return "1080p";
    if (height >= 720) return "720p";
    if (height >= 480) return "480p";
    if (height >= 360) return "360p";
    return `${height}p`;
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={resetHideTimer}
      onClick={(e) => {
        if (e.target === e.currentTarget) togglePlay();
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={thumbnail}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                {/* Video Interaction Overlay */}
      <AnimatePresence>
        {showInteractionOverlay && seriesId && episodeId && (
          <VideoInteractionOverlay
            seriesId={seriesId}
            episodeId={episodeId}
            seriesTitle={seriesTitle || title}
            episodeTitle={title}
            currentTime={currentTime}
            ageGroup={ageGroup}
            onClose={() => setShowInteractionOverlay(false)}
            onChoiceSelected={() => {
              setShowInteractionOverlay(false);
              setIsPlaying(true);
              videoRef.current?.play();
            }}
          />
        )}
      </AnimatePresence>

</motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-6 py-4 rounded-lg text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              setError(null);
              if (hlsRef.current) {
                hlsRef.current.startLoad();
              }
            }}
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Top Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute top-0 left-0 right-0 p-4 md:p-6 z-10"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <ChevronLeft size={24} color="#fff" />
              </motion.button>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            </div>
                {/* Video Interaction Overlay */}
      <AnimatePresence>
        {showInteractionOverlay && seriesId && episodeId && (
          <VideoInteractionOverlay
            seriesId={seriesId}
            episodeId={episodeId}
            seriesTitle={seriesTitle || title}
            episodeTitle={title}
            currentTime={currentTime}
            ageGroup={ageGroup}
            onClose={() => setShowInteractionOverlay(false)}
            onChoiceSelected={() => {
              setShowInteractionOverlay(false);
              setIsPlaying(true);
              videoRef.current?.play();
            }}
          />
        )}
      </AnimatePresence>

</motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Button (when paused) */}
      <AnimatePresence>
        {!isPlaying && !isLoading && showControls && (
          <motion.button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-full bg-red-600/90"
            style={{ boxShadow: "0 0 40px rgba(229,9,20,0.6)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
          >
            <Play size={40} fill="white" color="white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Progress Bar */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-4 group relative"
              onClick={handleSeek}
            >
              {/* Buffered */}
              <div
                className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
                style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }}
              />
              {/* Progress */}
              <div
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 8px)` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Play/Pause */}
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={24} color="#fff" /> : <Play size={24} fill="#fff" color="#fff" />}
                </motion.button>

                {/* Skip Back 10s */}
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => skip(-10)}
                >
                  <SkipBack size={20} color="#fff" />
                </motion.button>

                {/* Skip Forward 10s */}
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => skip(10)}
                >
                  <SkipForward size={20} color="#fff" />
                </motion.button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/vol">
                  <motion.button
                    className="p-2 hover:bg-white/10 rounded-full transition"
                    whileHover={{ scale: 1.1 }}
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} color="#fff" />
                    ) : (
                      <Volume2 size={20} color="#fff" />
                    )}
                  </motion.button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-red-600 h-1"
                  />
                </div>

                {/* Time */}
                <span className="text-sm text-white/80 hidden md:block">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Subtitles */}
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  title="Legendas"
                >
                  <Subtitles size={20} color="#fff" />
                </motion.button>

                {/* Quality Settings */}
                <div className="relative">
                  <motion.button
                    className="p-2 hover:bg-white/10 rounded-full transition"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    title="Qualidade"
                  >
                    <Settings size={20} color="#fff" />
                  </motion.button>

                  <AnimatePresence>
                    {showQualityMenu && (
                      <motion.div
                        className="absolute bottom-12 right-0 bg-black/95 border border-gray-700 rounded-lg p-2 min-w-[160px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <p className="text-xs text-gray-400 px-3 py-1 mb-1">Qualidade</p>
                        <button
                          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-white/10 ${
                            currentQuality === -1 ? "text-red-500 font-bold" : "text-white"
                          }`}
                          onClick={() => setQuality(-1)}
                        >
                          Auto
                        </button>
                        {qualityLevels.map((level, i) => (
                          <button
                            key={i}
                            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-white/10 ${
                              currentQuality === i ? "text-red-500 font-bold" : "text-white"
                            }`}
                            onClick={() => setQuality(i)}
                          >
                            {getQualityLabel(level.height)}
                          </button>
                        ))}
                            {/* Video Interaction Overlay */}
      <AnimatePresence>
        {showInteractionOverlay && seriesId && episodeId && (
          <VideoInteractionOverlay
            seriesId={seriesId}
            episodeId={episodeId}
            seriesTitle={seriesTitle || title}
            episodeTitle={title}
            currentTime={currentTime}
            ageGroup={ageGroup}
            onClose={() => setShowInteractionOverlay(false)}
            onChoiceSelected={() => {
              setShowInteractionOverlay(false);
              setIsPlaying(true);
              videoRef.current?.play();
            }}
          />
        )}
      </AnimatePresence>

</motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fullscreen */}
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize size={20} color="#fff" />
                  ) : (
                    <Maximize size={20} color="#fff" />
                  )}
                </motion.button>

                {/* Close */}
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  onClick={onClose}
                >
                  <X size={20} color="#fff" />
                </motion.button>
              </div>
            </div>
                {/* Video Interaction Overlay */}
      <AnimatePresence>
        {showInteractionOverlay && seriesId && episodeId && (
          <VideoInteractionOverlay
            seriesId={seriesId}
            episodeId={episodeId}
            seriesTitle={seriesTitle || title}
            episodeTitle={title}
            currentTime={currentTime}
            ageGroup={ageGroup}
            onClose={() => setShowInteractionOverlay(false)}
            onChoiceSelected={() => {
              setShowInteractionOverlay(false);
              setIsPlaying(true);
              videoRef.current?.play();
            }}
          />
        )}
      </AnimatePresence>

</motion.div>
        )}
      </AnimatePresence>
          {/* Video Interaction Overlay */}
      <AnimatePresence>
        {showInteractionOverlay && seriesId && episodeId && (
          <VideoInteractionOverlay
            seriesId={seriesId}
            episodeId={episodeId}
            seriesTitle={seriesTitle || title}
            episodeTitle={title}
            currentTime={currentTime}
            ageGroup={ageGroup}
            onClose={() => setShowInteractionOverlay(false)}
            onChoiceSelected={() => {
              setShowInteractionOverlay(false);
              setIsPlaying(true);
              videoRef.current?.play();
            }}
          />
        )}
      </AnimatePresence>

</motion.div>
  );
}
