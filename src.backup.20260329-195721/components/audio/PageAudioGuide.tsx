"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";

interface PageAudioGuideProps {
  pageTitle: string;
  audioPath: string;
  description: string;
  script: string;
}

export default function PageAudioGuide({
  pageTitle,
  audioPath,
  description,
  script,
}: PageAudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [usingSpeechFallback, setUsingSpeechFallback] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visitKey = useMemo(
    () =>
      `audio_visited_${pageTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")}`,
    [pageTitle],
  );

  useEffect(() => {
    const visited = localStorage.getItem(visitKey);
    setHasVisited(Boolean(visited));
    if (!visited) {
      setShowModal(true);
      localStorage.setItem(visitKey, "true");
      setHasVisited(true);
    }
  }, [visitKey]);

  useEffect(() => {
    const audio = new Audio(audioPath);
    audio.preload = "auto";
    audioRef.current = audio;
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.currentTime = 0;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioPath]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const t = window.setTimeout(loadVoices, 120);
    return () => {
      window.clearTimeout(t);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakWithTts = () => {
    if (!("speechSynthesis" in window)) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    const ptVoice =
      voices.find((voice) => voice.lang.toLowerCase().includes("pt-br")) ??
      voices.find((voice) => voice.lang.toLowerCase().includes("pt")) ??
      null;
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isPlaying) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const play = async () => {
      try {
        setUsingSpeechFallback(false);
        await audioRef.current?.play();
      } catch {
        setUsingSpeechFallback(true);
        speakWithTts();
      }
    };

    play();
  }, [isPlaying, script, voices]);

  return (
    <>
      <div className="pointer-events-auto fixed bottom-6 left-6 z-[150]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowModal(true)}
          className="relative rounded-full border-2 border-white/20 bg-gradient-to-r from-purple-600 to-cyan-600 p-4 shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all hover:shadow-[0_0_50px_rgba(147,51,234,1)]"
          aria-label={`Tour de Áudio - ${pageTitle}`}
          title={`Tour de Áudio - ${pageTitle}`}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isPlaying ? (
              <Volume2 className="h-7 w-7 text-white" />
            ) : (
              <VolumeX className="h-7 w-7 text-white" />
            )}
          </motion.div>

          {!hasVisited ? (
            <motion.div
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ) : null}
        </motion.button>

        <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-lg border border-purple-500/60 bg-[#1a1a2e] px-3 py-2 text-xs text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]">
          <p className="font-semibold">{pageTitle}</p>
          <p className="mt-1 text-[11px] text-gray-300">Clique para ouvir</p>
        </div>
      </div>

      <AnimatePresence>
        {showModal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setIsPlaying(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl border-2 border-purple-600 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 shadow-[0_0_60px_rgba(147,51,234,0.5)]"
            >
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setIsPlaying(false);
                }}
                className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center">
                <h2 className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                  {pageTitle}
                </h2>
                <p className="mt-2 text-gray-400">{description}</p>
              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-300">
                {script}
              </p>

              {usingSpeechFallback ? (
                <p className="mt-4 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
                  Áudio MP3 indisponível. Usando narração do navegador.
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 font-bold text-white transition-all hover:brightness-110"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pausar Áudio
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Ouvir Explicação
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsPlaying(false);
                  }}
                  className="rounded-xl border border-gray-600 px-6 py-3 text-gray-300 transition-colors hover:border-gray-300 hover:text-white"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
