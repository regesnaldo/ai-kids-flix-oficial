"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";

const VISIT_KEY = "laboratorio_visited";

const WELCOME_SCRIPT =
  'Bem-vindo ao Laboratório de Inteligência Viva do MENTE A I. Eu sou NEXUS, o Conector. ' +
  "À esquerda, a Biblioteca Viva: quatro andares de conhecimento. " +
  "À direita, o Laboratório Prático: estações para experimentar com mentoria dos agentes. " +
  "As partículas são vaga-lumes conceituais. Passe o mouse e clique para navegar. " +
  "Use Descoberta em Camadas para filtrar por nível. Explore, experimente e evolua.";

export default function AudioWelcome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usingSpeechFallback, setUsingSpeechFallback] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasSpeechSupport = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  useEffect(() => {
    const visited = window.localStorage.getItem(VISIT_KEY);
    if (!visited) {
      setShowModal(true);
      window.localStorage.setItem(VISIT_KEY, "true");
    }
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const timer = window.setTimeout(loadVoices, 150);

    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio("/audio/laboratorio-welcome.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", onEnded);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      audioRef.current?.pause();
      audioRef.current && (audioRef.current.currentTime = 0);
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
        if (!hasSpeechSupport) {
          setIsPlaying(false);
          return;
        }

        setUsingSpeechFallback(true);
        const utterance = new SpeechSynthesisUtterance(WELCOME_SCRIPT);
        utterance.lang = "pt-BR";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        const bestVoice =
          availableVoices.find((voice) => voice.lang.toLowerCase().includes("pt-br")) ??
          availableVoices.find((voice) => voice.lang.toLowerCase().includes("pt")) ??
          availableVoices.find((voice) => voice.name.toLowerCase().includes("portuguese")) ??
          null;
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    };

    play();
  }, [availableVoices, hasSpeechSupport, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    setShowModal(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsPlaying(false);
  };

  return (
    <>
      <div className="pointer-events-auto fixed bottom-6 left-6 z-[150]">
        <div className="group relative">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowModal(true)}
            className="relative rounded-full border-2 border-white/20 bg-gradient-to-r from-purple-600 to-cyan-600 p-4 shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(147,51,234,1)]"
            aria-label="Tour de Áudio"
            title="Tour de Áudio do Laboratório"
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
            <motion.div
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>

          <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-lg border border-purple-500/60 bg-[#1a1a2e] px-3 py-2 text-xs text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <p className="font-semibold">Tour de Áudio</p>
            <p className="mt-1 text-[11px] text-gray-300">Clique para ouvir</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(event) => event.stopPropagation()}
              className="relative mx-4 w-full max-w-2xl rounded-2xl border-2 border-purple-600 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 shadow-[0_0_60px_rgba(147,51,234,0.45)]"
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
                aria-label="Fechar modal de boas-vindas"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <h2 className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                  Bem-vindo ao Laboratório de Inteligência Viva
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Orquestrado por NEXUS &quot;O Conector&quot;
                </p>
              </div>

              <div className="mt-6 space-y-4 text-sm text-gray-300">
                <p>
                  1. Aqui você explora a Biblioteca Viva, o Lab Prático e os
                  fluxos interativos coordenados pelo NEXUS.
                </p>
                <p>
                  2. As partículas exibem sussurros conceituais no hover e
                  navegam por temporada ao clicar.
                </p>
                <p>
                  3. Use Descoberta em Camadas para ir direto do nível
                  Fundamentos até Mestre.
                </p>
              </div>

              {usingSpeechFallback ? (
                <p className="mt-4 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
                  MP3 indisponível. Usando narração por voz do navegador.
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pausar áudio
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Ouvir tour de áudio
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-gray-500 px-5 py-3 text-sm text-gray-300 transition-colors hover:border-gray-300 hover:text-white"
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
