"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

interface PaywallBannerProps {
  agentId: string;
  season: number;
  episode: number;
  agentColor?: string;
}

export function PaywallBanner({ agentId, season, episode, agentColor = "#00f0ff" }: PaywallBannerProps) {
  const remainingEpisodes = 49;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[60vh] flex items-center justify-center px-6"
    >
      <div className="max-w-lg w-full text-center">
        {/* Lock icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-6 flex justify-center"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `${agentColor}10`,
              border: `2px solid ${agentColor}30`,
              boxShadow: `0 0 32px ${agentColor}15`,
            }}
          >
            <Lock size={32} style={{ color: agentColor }} />
          </div>
        </motion.div>

        {/* Title */}
        <h2
          className="text-2xl md:text-3xl font-black text-white mb-3"
          style={{ fontFamily: "var(--font-display)", textShadow: `0 0 24px ${agentColor}20` }}
        >
          Conteúdo Premium
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Você chegou ao limite do conteúdo gratuito.
        </p>
        <p className="text-gray-500 text-xs leading-relaxed mb-8">
          Assine o plano <span style={{ color: agentColor, fontWeight: 700 }}>PREMIUM</span> para
          desbloquear os {remainingEpisodes} episódios restantes da temporada e todos os universos do MENTE.AI.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "49 episódios", icon: "🎬" },
            { label: "12 universos", icon: "🌌" },
            { label: "IA ilimitada", icon: "🧠" },
          ].map((f) => (
            <div
              key={f.label}
              className="p-3 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs text-gray-400">{f.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{
              background: agentColor,
              color: "#000",
              boxShadow: `0 4px 24px ${agentColor}30`,
            }}
          >
            <Sparkles size={16} />
            Assinar Plano Premium
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`/series/${agentId}/${season}/1`}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "transparent",
              border: `1px solid ${agentColor}30`,
              color: agentColor,
            }}
          >
            Voltar ao Episódio 1
          </Link>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          Episódio {episode} da Temporada {season} · {agentId.toUpperCase()}
        </p>
      </div>
    </motion.div>
  );
}
