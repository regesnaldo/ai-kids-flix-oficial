"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, MousePointer, BarChart3, Trophy, X } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface ThumbnailVariant {
  id: number;
  variantName: string;
  imageUrl: string;
  impressions: number;
  clicks: number;
  ctr: string;
  segment?: string;
  isWinner?: boolean;
}

interface ThumbnailABSelectorProps {
  variants: ThumbnailVariant[];
  seriesTitle: string;
  onClose: () => void;
  onSelectWinner?: (variantId: number) => void;
}

// ─── Component ──────────────────────────────────────────

export default function ThumbnailABSelector({
  variants,
  seriesTitle,
  onClose,
  onSelectWinner,
}: ThumbnailABSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || variants.length === 0) return null;

  const bestCtr = Math.max(
    ...variants.map((v) => parseFloat(v.ctr ?? "0"))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-cyber-panel border border-cyber-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyber-border">
          <div>
            <h2 className="text-xl font-bold text-white">A/B Test — Thumbnails</h2>
            <p className="text-sm text-zinc-400 mt-0.5">{seriesTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variants grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant) => {
            const ctr = parseFloat(variant.ctr ?? "0");
            const isBest = ctr === bestCtr && ctr > 0;
            const isSelected = selectedVariant === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                  isSelected
                    ? "border-neon-cyan shadow-glow-cyan"
                    : isBest
                      ? "border-neon-green"
                      : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Variant label */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-black/70 text-white text-xs font-bold rounded">
                    Variante {variant.variantName}
                  </span>
                  {variant.isWinner && (
                    <span className="px-2 py-0.5 bg-neon-green/90 text-black text-xs font-bold rounded flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Vencedor
                    </span>
                  )}
                  {isBest && !variant.isWinner && (
                    <span className="px-2 py-0.5 bg-neon-cyan/90 text-black text-xs font-bold rounded flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      Melhor CTR
                    </span>
                  )}
                </div>

                {/* Segment badge */}
                {variant.segment && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 bg-black/70 text-zinc-300 text-[10px] font-semibold rounded-full capitalize">
                      {variant.segment}
                    </span>
                  </div>
                )}

                {/* Thumbnail image */}
                <div
                  className="w-full aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${variant.imageUrl})` }}
                />

                {/* Stats */}
                <div className="p-3 bg-cyber-dark grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-zinc-500" />
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase font-semibold">Impressões</p>
                      <p className="text-xs font-bold text-white">{variant.impressions.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MousePointer className="w-3.5 h-3.5 text-zinc-500" />
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase font-semibold">Cliques</p>
                      <p className="text-xs font-bold text-white">{variant.clicks.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase font-semibold">CTR</p>
                    <p className="text-xs font-bold" style={{ color: ctr > 5 ? "#10b981" : ctr > 2 ? "#f59e0b" : "#ef4444" }}>
                      {ctr.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-cyber-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          {onSelectWinner && selectedVariant !== null && (
            <button
              type="button"
              onClick={() => onSelectWinner(selectedVariant)}
              className="px-5 py-2 bg-neon-cyan text-black text-sm font-bold rounded-md hover:bg-cyan-300 transition-colors"
            >
              Definir como Vencedor
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
