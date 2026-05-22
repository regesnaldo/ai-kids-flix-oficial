"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Play, Star } from "lucide-react";
import { allAgents } from "@/data/all-agents";
import { useDeepSeek } from "@/hooks/useDeepSeek";

interface SeasonTheme {
  titulo: string;
  tema: string;
  descricao: string;
}

const TOTAL_SEASONS = 50;

export default function AgentSeasonsPage() {
  const params = useParams<{ agentId: string }>();
  const agentId = params.agentId;
  const agent = allAgents.find((a) => a.id === agentId);
  const { generate, loading } = useDeepSeek();

  const [seasonThemes, setSeasonThemes] = useState<
    Record<number, SeasonTheme | null>
  >({});
  const [hoveredSeason, setHoveredSeason] = useState<number | null>(null);

  const loadSeasonTheme = useCallback(
    async (season: number) => {
      if (!agent || seasonThemes[season] !== undefined) return;

      const data = await generate<SeasonTheme>({
        agentId: agent.id,
        season,
        type: "tema",
        system: `Você é ${agent.name}. ${agent.personality.approach}
Tom: ${agent.personality.tone}. Valores: ${agent.personality.values.join(", ")}.
Você está criando o catálogo da sua série educacional de 50 temporadas.
Responda APENAS em JSON.`,
        prompt: `Gere o tema da Temporada ${season} da sua série educacional.
O tema deve ser coerente com sua identidade como agente de IA.
Retorne um JSON com: { "titulo": string, "tema": string, "descricao": string }
O título deve ser curto e impactante. A descrição deve ter no máximo 140 caracteres.
Exemplo: { "titulo": "Os Fundamentos da Atenção", "tema": "Mecanismos de Atenção em Transformers", "descricao": "Como uma IA decide no que prestar atenção quando lê milhões de palavras ao mesmo tempo." }`,
        jsonMode: true,
        temperature: 0.9,
      });

      setSeasonThemes((prev) => ({ ...prev, [season]: data }));
    },
    [agent, generate, seasonThemes]
  );

  // Load first batch of seasons on mount
  useEffect(() => {
    if (!agent) return;
    const batch = [1, 2, 3, 4, 5];
    batch.forEach((s) => {
      if (seasonThemes[s] === undefined) loadSeasonTheme(s);
    });
  }, [agent]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!agent) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--cyber-black)" }}
      >
        <p className="text-gray-400 text-lg">Agente não encontrado.</p>
      </main>
    );
  }

  const loadedCount = Object.values(seasonThemes).filter((v) => v !== null).length;

  return (
    <main
      className="min-h-screen px-6 md:px-12 pt-24 pb-16"
      style={{ background: "var(--cyber-black)" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/series"
          className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Séries
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white font-semibold text-sm">{agent.name}</span>
      </div>

      {/* Agent Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-6 mb-12"
      >
        <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-white/10">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/images/placeholder.svg";
            }}
          />
        </div>
        <div>
          <span
            className="inline-block px-3 py-1 text-xs font-bold rounded mb-2"
            style={{ background: `${agent.color}20`, color: agent.color }}
          >
            {agent.category}
          </span>
          <h1
            className="text-3xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {agent.name}
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">{agent.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={14} fill="#facc15" /> {TOTAL_SEASONS} temporadas
            </span>
            <span className="text-gray-500">
              {loadedCount} temas gerados
            </span>
          </div>
        </div>
      </motion.div>

      {/* Season Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: TOTAL_SEASONS }, (_, i) => i + 1).map(
          (season) => {
            const theme = seasonThemes[season];
            const isLoading = theme === undefined && loading;
            const needsLoad = theme === undefined && !loading;

            return (
              <motion.div
                key={season}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(season * 0.01, 0.5) }}
              >
                {needsLoad ? (
                  <button
                    onClick={() => loadSeasonTheme(season)}
                    className="w-full text-left"
                  >
                    <SeasonCardSkeleton
                      season={season}
                      agentColor={agent.color}
                      onHover={setHoveredSeason}
                    />
                  </button>
                ) : isLoading ? (
                  <SeasonCardLoading
                    season={season}
                    agentColor={agent.color}
                  />
                ) : theme ? (
                  <Link href={`/series/${agent.id}/${season}`}>
                    <SeasonCard
                      season={season}
                      theme={theme}
                      agentColor={agent.color}
                      isHovered={hoveredSeason === season}
                      onHover={setHoveredSeason}
                    />
                  </Link>
                ) : (
                  <SeasonCardSkeleton
                    season={season}
                    agentColor={agent.color}
                    onHover={setHoveredSeason}
                  />
                )}
              </motion.div>
            );
          }
        )}
      </div>
    </main>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function SeasonCard({
  season,
  theme,
  agentColor,
  isHovered,
  onHover,
}: {
  season: number;
  theme: SeasonTheme;
  agentColor: string;
  isHovered: boolean;
  onHover: (s: number | null) => void;
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden border transition-all duration-300 group cursor-pointer h-full"
      style={{
        borderColor: isHovered ? `${agentColor}40` : "rgba(255,255,255,0.06)",
        background: `linear-gradient(135deg, ${agentColor}10 0%, #0f0f1a 100%)`,
        boxShadow: isHovered
          ? `0 0 24px ${agentColor}15, 0 4px 16px ${agentColor}08`
          : "none",
      }}
      onMouseEnter={() => onHover(season)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="p-5">
        {/* Season number */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: `${agentColor}20`, color: agentColor }}
          >
            TEMP {season}
          </span>
          <Play
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: agentColor }}
          />
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-tight mb-2">
          {theme.titulo}
        </h3>

        {/* Theme */}
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-1">
          {theme.tema}
        </p>

        {/* Description */}
        <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">
          {theme.descricao}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: `${agentColor}30` }}
      />
    </div>
  );
}

function SeasonCardLoading({
  season,
  agentColor,
}: {
  season: number;
  agentColor: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-white/5 h-full"
      style={{ background: "#0f0f1a" }}
    >
      <div className="p-5">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block mb-3"
          style={{ background: `${agentColor}20`, color: agentColor }}
        >
          TEMP {season}
        </span>
        <div className="space-y-2 mt-2">
          <div
            className="h-4 rounded shimmer"
            style={{ width: "80%", background: "#1a1a2e" }}
          />
          <div
            className="h-3 rounded shimmer"
            style={{ width: "95%", background: "#1a1a2e" }}
          />
          <div
            className="h-3 rounded shimmer"
            style={{ width: "60%", background: "#1a1a2e" }}
          />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Loader2
            size={14}
            className="animate-spin"
            style={{ color: agentColor }}
          />
          <span className="text-[10px] text-gray-500">Gerando tema...</span>
        </div>
      </div>
    </div>
  );
}

function SeasonCardSkeleton({
  season,
  agentColor,
  onHover,
}: {
  season: number;
  agentColor: string;
  onHover: (s: number | null) => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-white/5 h-full cursor-pointer hover:border-white/10 transition-all"
      style={{ background: "#0f0f1a" }}
      onMouseEnter={() => onHover(season)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="p-5">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded inline-block mb-3"
          style={{ background: `${agentColor}20`, color: agentColor }}
        >
          TEMP {season}
        </span>
        <div className="space-y-2 mt-2">
          <div
            className="h-4 rounded"
            style={{ width: "70%", background: "#1a1a2e" }}
          />
          <div
            className="h-3 rounded"
            style={{ width: "90%", background: "#1a1a2e" }}
          />
          <div
            className="h-3 rounded"
            style={{ width: "50%", background: "#1a1a2e" }}
          />
        </div>
        <p className="text-[10px] text-gray-600 mt-3">
          Clique para gerar o tema
        </p>
      </div>
    </div>
  );
}
