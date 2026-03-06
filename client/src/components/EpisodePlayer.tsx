import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Volume2, Loader } from "lucide-react";

interface EpisodeData {
  id: string;
  title: string;
  concept: string;
  introduction: string;
  problem: string;
  decision: {
    question: string;
    optionA: string;
    optionB: string;
  };
  responses: {
    A: string;
    B: string;
  };
  learning: string;
  thumbnail: string;
}

interface EpisodePlayerProps {
  episode: EpisodeData;
  onClose: () => void;
  onDecision: (choice: "A" | "B") => void;
}

export default function EpisodePlayer({
  episode,
  onClose,
  onDecision,
}: EpisodePlayerProps) {
  const [stage, setStage] = useState<
    "intro" | "problem" | "decision" | "response" | "learning"
  >("intro");
  const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleChoice = (choice: "A" | "B") => {
    setSelectedChoice(choice);
    setStage("response");
    onDecision(choice);
  };

  const handleNext = () => {
    if (stage === "intro") {
      setStage("problem");
    } else if (stage === "problem") {
      setStage("decision");
    } else if (stage === "response") {
      setStage("learning");
    }
  };

  const handleClose = () => {
    setStage("intro");
    setSelectedChoice(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    onClose();
  };

  const getTextForCurrentStage = (): string => {
    switch (stage) {
      case "intro":
        return episode.introduction;
      case "problem":
        return episode.problem;
      case "decision":
        return `${episode.decision.question}\nOpcao A: ${episode.decision.optionA}\nOpcao B: ${episode.decision.optionB}`;
      case "response":
        return selectedChoice === "A" ? episode.responses.A : episode.responses.B;
      case "learning":
        return episode.learning;
      default:
        return "";
    }
  };

  const handlePlayAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const textToRead = getTextForCurrentStage();

    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "pt-BR";
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          setIsPlayingAudio(false);
        };

        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Erro ao reproduzir audio:", error);
      setIsPlayingAudio(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={episode.thumbnail}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors z-10"
              aria-label="Fechar episódio"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {episode.title}
              </h1>
              <p className="text-cyan-400 font-semibold">
                Conceito: {episode.concept}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <AnimatePresence mode="wait">
              {/* Introduction Stage */}
              {stage === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-lg text-white leading-relaxed flex-1">
                        {episode.introduction}
                      </p>
                      <button
                        onClick={handlePlayAudio}
                        disabled={isPlayingAudio}
                        className="flex-shrink-0 p-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Ler em voz alta"
                      >
                        {isPlayingAudio ? (
                          <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-cyan-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Continuar
                  </button>
                </motion.div>
              )}

              {/* Problem Stage */}
              {stage === "problem" && (
                <motion.div
                  key="problem"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-yellow-400 mb-4">
                          ⚠️ Situação-Problema
                        </h2>
                        <p className="text-lg text-white leading-relaxed">
                          {episode.problem}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsPlayingAudio(true);
                          const utterance = new SpeechSynthesisUtterance(episode.problem);
                          utterance.lang = "pt-BR";
                          utterance.rate = 1;
                          utterance.onend = () => setIsPlayingAudio(false);
                          utterance.onerror = () => setIsPlayingAudio(false);
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utterance);
                        }}
                        disabled={isPlayingAudio}
                        className="flex-shrink-0 p-2 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Ler em voz alta"
                      >
                        {isPlayingAudio ? (
                          <Loader className="w-6 h-6 text-yellow-400 animate-spin" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-yellow-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Tomar Decisão
                  </button>
                </motion.div>
              )}

              {/* Decision Stage */}
              {stage === "decision" && (
                <motion.div
                  key="decision"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <h2 className="text-xl font-bold text-purple-400 flex-1">
                        🎯 {episode.decision.question}
                      </h2>
                      <button
                        onClick={() => {
                          setIsPlayingAudio(true);
                          const utterance = new SpeechSynthesisUtterance(episode.decision.question);
                          utterance.lang = "pt-BR";
                          utterance.rate = 1;
                          utterance.onend = () => setIsPlayingAudio(false);
                          utterance.onerror = () => setIsPlayingAudio(false);
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utterance);
                        }}
                        disabled={isPlayingAudio}
                        className="flex-shrink-0 p-2 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Ler em voz alta"
                      >
                        {isPlayingAudio ? (
                          <Loader className="w-6 h-6 text-purple-400 animate-spin" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-purple-400" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => handleChoice("A")}
                        className="w-full p-4 text-left bg-slate-700/50 hover:bg-slate-600/70 border border-cyan-500/30 hover:border-cyan-500/60 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="text-cyan-400 font-bold">A) </span>
                        <span className="text-white">{episode.decision.optionA}</span>
                      </button>
                      <button
                        onClick={() => handleChoice("B")}
                        className="w-full p-4 text-left bg-slate-700/50 hover:bg-slate-600/70 border border-blue-500/30 hover:border-blue-500/60 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="text-blue-400 font-bold">B) </span>
                        <span className="text-white">{episode.decision.optionB}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Response Stage */}
              {stage === "response" && selectedChoice && (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-green-400 mb-4">
                          ✨ Resultado da Sua Escolha
                        </h2>
                        <p className="text-lg text-white leading-relaxed">
                          {episode.responses[selectedChoice]}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsPlayingAudio(true);
                          const utterance = new SpeechSynthesisUtterance(episode.responses[selectedChoice]);
                          utterance.lang = "pt-BR";
                          utterance.rate = 1;
                          utterance.onend = () => setIsPlayingAudio(false);
                          utterance.onerror = () => setIsPlayingAudio(false);
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utterance);
                        }}
                        disabled={isPlayingAudio}
                        className="flex-shrink-0 p-2 bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Ler em voz alta"
                      >
                        {isPlayingAudio ? (
                          <Loader className="w-6 h-6 text-green-400 animate-spin" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-green-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Ver Aprendizado
                  </button>
                </motion.div>
              )}

              {/* Learning Stage */}
              {stage === "learning" && (
                <motion.div
                  key="learning"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">
                      💡 O Aprendizado
                    </h2>
                    <p className="text-lg text-white leading-relaxed">
                      {episode.learning}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Voltar à Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
