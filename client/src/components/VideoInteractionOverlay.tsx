import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Loader2, X } from "lucide-react";

interface VideoInteractionOverlayProps {
  seriesId: number;
  episodeId: number;
  seriesTitle: string;
  episodeTitle: string;
  currentTime?: number;
  ageGroup?: "child" | "teen" | "adult";
  onClose: () => void;
  onChoiceSelected: (choiceId: string, choiceLabel: string) => void;
}

interface Question {
  question: string;
  options: Array<{ id: string; label: string }>;
}

export default function VideoInteractionOverlay({
  seriesId,
  episodeId,
  seriesTitle,
  episodeTitle,
  currentTime = 0,
  ageGroup = "teen",
  onClose,
  onChoiceSelected,
}: VideoInteractionOverlayProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateQuestionMutation = trpc.videoInteraction.generateQuestion.useMutation();
  const recordChoiceMutation = trpc.videoInteraction.recordChoice.useMutation();

  // Generate question on mount
  useEffect(() => {
    generateQuestionMutation.mutate(
      {
        seriesId,
        episodeId,
        seriesTitle,
        episodeTitle,
        currentTime,
        ageGroup,
      },
      {
        onSuccess: (data) => {
          setQuestion(data as Question);
          setIsLoading(false);
        },
        onError: () => {
          setQuestion({
            question: "O que você achou do que viu neste momento?",
            options: [
              { id: "option_1", label: "Muito interessante" },
              { id: "option_2", label: "Preciso pensar mais" },
              { id: "option_3", label: "Quero saber mais" },
            ],
          });
          setIsLoading(false);
        },
      }
    );
  }, []);

  const handleSelectOption = (optionId: string, optionLabel: string) => {
    setSelectedOption(optionId);
    setIsSubmitting(true);

    recordChoiceMutation.mutate(
      {
        seriesId,
        episodeId,
        choiceId: optionId,
        choiceLabel: optionLabel,
      },
      {
        onSuccess: () => {
          onChoiceSelected(optionId, optionLabel);
          setTimeout(() => onClose(), 800);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
    >
      {/* Close button */}
      <motion.button
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <X size={24} color="#fff" />
      </motion.button>

      <div className="w-full max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="loading"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Loader2 size={48} color="#00d4ff" />
              </motion.div>
              <p className="text-gray-300 text-lg">Preparando sua interação...</p>
            </motion.div>
          )}

          {/* Question Display */}
          {!isLoading && question && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {question.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id, option.label)}
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-lg border-2 border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-500 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting && selectedOption === option.id && (
                      <motion.span
                        className="inline-block mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Loader2 size={16} />
                      </motion.span>
                    )}
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
