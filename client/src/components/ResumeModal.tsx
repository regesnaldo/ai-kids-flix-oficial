import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  episodeTitle: string;
  progressPercentage: number;
  onResume: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export default function ResumeModal({
  isOpen,
  episodeTitle,
  progressPercentage,
  onResume,
  onRestart,
  onClose,
}: ResumeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-6 border-b border-cyan-500/30">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Continuar Assistindo?
                </h2>
                <p className="text-gray-300 text-sm line-clamp-2">{episodeTitle}</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Progress Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Progresso salvo</span>
                    <span className="text-cyan-400 font-semibold">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                {/* Buttons */}
                <div className="space-y-3">
                  {/* Resume Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onResume}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow"
                  >
                    <Play size={18} fill="currentColor" />
                    Continuar de {Math.round(progressPercentage)}%
                  </motion.button>

                  {/* Restart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRestart}
                    className="w-full py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <RotateCcw size={18} />
                    Assistir do Início
                  </motion.button>
                </div>

                {/* Close hint */}
                <p className="text-center text-xs text-gray-500">
                  Clique fora para fechar
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
