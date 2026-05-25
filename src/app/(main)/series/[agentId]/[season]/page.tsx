"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Clock, Star, Loader2 } from "lucide-react";
import { allAgents } from "@/data/all-agents";
import { useDeepSeek } from "@/hooks/useDeepSeek";

interface EpisodeMeta {
  numero: number;
  titulo: string;
  descricao: string;
}

interface EpisodeList {
  episodios: EpisodeMeta[];
}

interface SeasonTheme {
  titulo: string;
  tema: string;
  descricao: string;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function SeasonEpisodesPage() {
  const params = useParams<{ agentId: string; season: string }>();
  const agentId = params.agentId;
  const season = parseInt(params.season, 10);
  const agent = allAgents.find((a) => a.id === agentId);
  const { generate, loading } = useDeepSeek();

  const [theme, setTheme] = useState<SeasonTheme | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeMeta[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadData = useCallback(async () => {
    if (!agent || loaded) return;

    // 1. Load season theme
    const themeData = await generate<SeasonTheme>({
      agentId: agent.id,
      season,
      type: "tema",
      system: `Você é ${agent.name}. ${agent.personality.approach}
Tom: ${agent.personality.tone}. Valores: ${agent.personality.values.join(", ")}.
Responda APENAS em JSON.`,
      prompt: `Gere o tema da Temporada ${season} da sua série educacional.
Retorne um JSON com: { "titulo": string, "tema": string, "descricao": string }`,
      jsonMode: true,
      temperature: 0.9,
    });
    if (themeData) setTheme(themeData);

    // 2. Load episode list
    const epData = await generate<EpisodeList>({
      agentId: agent.id,
      season,
      type: "episodios",
      system: `Você é ${agent.name}. ${agent.personality.approach}
Tom: ${agent.personality.tone}. Valores: ${agent.personality.values.join(", ")}.
Responda APENAS em JSON com a lista de 10 episódios.`,
      prompt: `Gere a lista COMPLETA dos 10 episódios da Temporada ${season} da sua série educacional.
Tema da temporada: ${themeData?.titulo || "Educação em IA"}
Retorne um JSON EXATO no formato:
{ "episodios": [{ "numero": 1, "titulo": "...", "descricao": "..." }, ...] }
Cada título deve ser envolvente e cinematográfico.
Cada descrição deve ter no máximo 120 caracteres.
Os episódios devem formar um arco narrativo coerente.`,
      jsonMode: true,
      temperature: 0.9,
    });
    if (epData?.episodios) {
      setEpisodes(epData.episodios.slice(0, 10));
    }

    setLoaded(true);
  }, [agent, season, generate, loaded]);

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <Link
          href={`/series/${agent.id}`}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          {agent.name}
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white font-semibold text-sm">
          Temporada {season}
        </span>
      </div>

      {/* Season Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        {theme ? (
          <>
            <span
              className="inline-block px-3 py-1 text-xs font-bold rounded mb-3"
              style={{ background: `${agent.color}20`, color: agent.color }}
            >
              TEMPORADA {season}
            </span>
            <h1
              className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {theme.titulo}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">{theme.tema}</p>
            <p className="text-gray-500 text-sm mt-1">{theme.descricao}</p>
          </>
        ) : (
          <div className="space-y-3">
            <div
              className="h-5 w-32 rounded shimmer"
              style={{ background: "#1a1a2e" }}
            />
            <div
              className="h-10 w-96 rounded shimmer"
              style={{ background: "#1a1a2e" }}
            />
            <div
              className="h-4 w-80 rounded shimmer"
              style={{ background: "#1a1a2e" }}
            />
          </div>
        )}
      </motion.div>

      {/* Episode List */}
      {loading && episodes.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }, (_, i) => (
            <EpisodeSkeleton key={i} index={i + 1} />
          ))}
        </div>
      ) : episodes.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {episodes.map((ep) => (
            <motion.div key={ep.numero} variants={itemVariant}>
              <Link
                href={`/series/${agent.id}/${season}/${ep.numero}`}
                className="group block"
              >
                <div
                  className="flex items-center gap-5 p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "#0f0f1a",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${agent.color}30`;
                    e.currentTarget.style.background = `linear-gradient(135deg, ${agent.color}08 0%, #0f0f1a 100%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.background = "#0f0f1a";
                  }}
                >
                  {/* Episode number */}
                  <div className="flex-shrink-0 text-center w-10">
                    <span
                      className="text-2xl font-black"
                      style={{ color: agent.color }}
                    >
                      {ep.numero}
                    </span>
                  </div>

                  {/* Play button */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `${agent.color}20`,
                      border: `1px solid ${agent.color}30`,
                    }}
                  >
                    <Play size={16} style={{ color: agent.color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm group-hover:underline">
                      {ep.titulo}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                      {ep.descricao}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex-shrink-0 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> 8 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400" /> 50 XP
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : null}
    </main>
  );
}

function EpisodeSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-5 p-5 rounded-xl border border-white/5"
      style={{ background: "#0f0f1a" }}
    >
      <div
        className="w-10 h-8 rounded"
        style={{ background: "#1a1a2e" }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-4 rounded"
          style={{ width: "60%", background: "#1a1a2e" }}
        />
        <div
          className="h-3 rounded"
          style={{ width: "80%", background: "#1a1a2e" }}
        />
      </div>
      <Loader2 size={16} className="animate-spin text-gray-600" />
    </div>
  );
}
