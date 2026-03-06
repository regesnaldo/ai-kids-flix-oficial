import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Sparkles, Zap, Search, Brain, Loader2, ChevronRight, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Choice {
  id: string;
  label: string;
  description: string;
  type: "cooperate" | "confront" | "investigate" | "ethical_dilemma";
  emoji: string;
}

interface InteractiveChoicesProps {
  seriesId: number;
  episodeId: number;
  seriesTitle: string;
  episodeTitle: string;
  onClose: () => void;
  onContinue: () => void;
}

const TYPE_COLORS: Record<string, { bg: string; border: string; glow: string; icon: React.ReactNode }> = {
  cooperate: {
    bg: "rgba(34, 197, 94, 0.15)",
    border: "rgba(34, 197, 94, 0.6)",
    glow: "0 0 30px rgba(34, 197, 94, 0.3)",
    icon: <Sparkles size={24} />,
  },
  confront: {
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.6)",
    glow: "0 0 30px rgba(239, 68, 68, 0.3)",
    icon: <Zap size={24} />,
  },
  investigate: {
    bg: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.6)",
    glow: "0 0 30px rgba(59, 130, 246, 0.3)",
    icon: <Search size={24} />,
  },
  ethical_dilemma: {
    bg: "rgba(168, 85, 247, 0.15)",
    border: "rgba(168, 85, 247, 0.6)",
    glow: "0 0 30px rgba(168, 85, 247, 0.3)",
    icon: <Brain size={24} />,
  },
};

export default function InteractiveChoices({
  seriesId,
  episodeId,
  seriesTitle,
  episodeTitle,
  onClose,
  onContinue,
}: InteractiveChoicesProps) {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoadingChoices, setIsLoadingChoices] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [narrativeResponse, setNarrativeResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const generateChoicesMutation = trpc.interactive.generateChoices.useMutation();
  const makeChoiceMutation = trpc.interactive.makeChoice.useMutation();
  const decisionHistoryQuery = trpc.interactive.getDecisionHistory.useQuery(
    { seriesId },
    { enabled: seriesId > 0 }
  );

  // Generate choices on mount
  useEffect(() => {
    const previousDecisions = (decisionHistoryQuery.data || []).map((d) => ({
      choiceLabel: d.choiceLabel,
      narrativeResponse: d.narrativeResponse,
    }));

    generateChoicesMutation.mutate(
      {
        seriesId,
        episodeId,
        episodeTitle,
        seriesTitle,
        previousDecisions,
      },
      {
        onSuccess: (data) => {
          setChoices(data.choices || []);
          setIsLoadingChoices(false);
        },
        onError: () => {
          // Use fallback choices
          setChoices([
            { id: "cooperate", label: "Cooperar com a IA", description: "Trabalhar junto com a inteligência artificial", type: "cooperate", emoji: "🤝" },
            { id: "confront", label: "Questionar a IA", description: "Desafiar as decisões da máquina", type: "confront", emoji: "⚡" },
            { id: "investigate", label: "Investigar mais", description: "Buscar mais informações antes de decidir", type: "investigate", emoji: "🔍" },
            { id: "ethical_dilemma", label: "Dilema ético", description: "Refletir sobre as consequências morais", type: "ethical_dilemma", emoji: "🧠" },
          ]);
          setIsLoadingChoices(false);
        },
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    setIsProcessing(true);

    const previousDecisions = (decisionHistoryQuery.data || []).map((d) => ({
      choiceLabel: d.choiceLabel,
      narrativeResponse: d.narrativeResponse,
    }));

    makeChoiceMutation.mutate(
      {
        seriesId,
        episodeId,
        choiceId: choice.id,
        choiceLabel: choice.label,
        choiceType: choice.type,
        episodeTitle,
        seriesTitle,
        previousDecisions,
      },
      {
        onSuccess: (data) => {
          setNarrativeResponse(data.narrativeResponse);
          setIsProcessing(false);
        },
        onError: () => {
          setNarrativeResponse(
            `Você escolheu "${choice.label}". A aventura continua e suas decisões moldam o futuro da história!`
          );
          setIsProcessing(false);
        },
      }
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
    >
      {/* Close button */}
      <motion.button
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <X size={24} color="#fff" />
      </motion.button>

      <div className="w-full max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoadingChoices && (
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
                <Sparkles size={48} color="#E50914" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                A IA está preparando suas escolhas...
              </h2>
              <p className="text-gray-400">
                Analisando o episódio e criando ramificações narrativas
              </p>
            </motion.div>
          )}

          {/* Choices Display */}
          {!isLoadingChoices && !selectedChoice && (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-block mb-4"
                >
                  <span className="text-5xl">🎭</span>
                </motion.div>
                <h2
                  className="text-3xl md:text-4xl font-black text-white mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  MOMENTO DE DECISÃO
                </h2>
                <p className="text-gray-400 text-lg">
                  Após <span className="text-red-500 font-semibold">"{episodeTitle}"</span> — O que você faria?
                </p>
              </div>

              {/* Choices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {choices.map((choice, index) => {
                  const colors = TYPE_COLORS[choice.type] || TYPE_COLORS.cooperate;
                  const isHovered = hoveredChoice === choice.id;

                  return (
                    <motion.button
                      key={choice.id}
                      className="relative text-left p-5 rounded-xl border transition-all"
                      style={{
                        backgroundColor: isHovered ? colors.bg : "rgba(255,255,255,0.03)",
                        borderColor: isHovered ? colors.border : "rgba(255,255,255,0.1)",
                        boxShadow: isHovered ? colors.glow : "none",
                      }}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => setHoveredChoice(choice.id)}
                      onMouseLeave={() => setHoveredChoice(null)}
                      onClick={() => handleChoice(choice)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                        >
                          {choice.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">{choice.label}</h3>
                          <p className="text-gray-400 text-sm">{choice.description}</p>
                        </div>
                        <motion.div
                          className="flex-shrink-0 self-center"
                          animate={{ x: isHovered ? 4 : 0 }}
                        >
                          <ChevronRight size={20} color={isHovered ? "#fff" : "#666"} />
                        </motion.div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Processing State */}
          {selectedChoice && isProcessing && (
            <motion.div
              key="processing"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="inline-block mb-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-5xl">{selectedChoice.emoji}</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Você escolheu: "{selectedChoice.label}"
              </h2>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Loader2 size={20} className="animate-spin" />
                <span>A IA está reagindo à sua decisão...</span>
              </div>
            </motion.div>
          )}

          {/* Narrative Response */}
          {selectedChoice && narrativeResponse && !isProcessing && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Choice Badge */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor: TYPE_COLORS[selectedChoice.type]?.bg || "rgba(255,255,255,0.1)",
                    border: `1px solid ${TYPE_COLORS[selectedChoice.type]?.border || "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  <span className="text-xl">{selectedChoice.emoji}</span>
                  <span className="text-white font-semibold">{selectedChoice.label}</span>
                </motion.div>
              </div>

              {/* Narrative Text */}
              <motion.div
                className="p-6 rounded-2xl mb-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 40px rgba(229,9,20,0.1)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-200 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{narrativeResponse}</ReactMarkdown>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  className="px-8 py-3 rounded-lg font-bold text-white text-lg"
                  style={{
                    backgroundColor: "#E50914",
                    boxShadow: "0 0 30px rgba(229,9,20,0.4)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onContinue}
                >
                  Próximo Episódio →
                </motion.button>
                <motion.button
                  className="px-6 py-3 rounded-lg font-medium text-gray-300 border border-gray-600 hover:border-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                >
                  Voltar
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
