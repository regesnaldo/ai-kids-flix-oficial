"use client";

import { useEffect, useMemo, useState } from "react";

type AgentRef = string;

interface PhaseDTO {
  id: number;
  nome: string;
  temporadas: [number, number];
  temaCentral: string;
  agentesDominantes: AgentRef[];
  objetivoPedagogico: string;
}

interface SeasonDTO {
  temporada: number;
  fase: number;
  tema: string;
  agenteDominante: AgentRef;
  agentesSuporte: AgentRef[];
}

interface ConflictDTO {
  fase: number;
  conflitosCentrais: string;
  funcaoNarrativa: string;
}

interface MasterPayload {
  phases: PhaseDTO[];
  seasons: SeasonDTO[];
  conflicts: ConflictDTO[];
}

function formatAgent(agent: string) {
  return agent === "todos" ? "TODOS" : agent.toUpperCase();
}

export default function SeasonMapPanel() {
  const [payload, setPayload] = useState<MasterPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fase, setFase] = useState<number>(1);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/narrativa/season-map", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as MasterPayload;
        if (!active) return;

        setPayload(json);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Falha ao carregar mapa";
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const phaseSeasons = useMemo(() => {
    if (!payload) return [];
    return payload.seasons.filter((s) => s.fase === fase);
  }, [payload, fase]);

  const currentPhase = useMemo(() => {
    if (!payload) return null;
    return payload.phases.find((p) => p.id === fase) ?? null;
  }, [payload, fase]);

  const currentConflict = useMemo(() => {
    if (!payload) return null;
    return payload.conflicts.find((c) => c.fase === fase) ?? null;
  }, [payload, fase]);

  return (
    <section className="mt-12 rounded-2xl border border-white/10 bg-black/30 p-5 md:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white md:text-2xl">Roteiro Mestre (50 Temporadas)</h2>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-300">
          Planejamento Editorial
        </span>
      </div>

      {loading && <p className="text-sm text-white/70">Carregando mapa temático...</p>}
      {error && <p className="text-sm text-red-300">Erro ao carregar mapa: {error}</p>}

      {!loading && !error && payload && (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {payload.phases.map((phase) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => setFase(phase.id)}
                className={`rounded-lg border px-3 py-2 text-xs transition ${
                  fase === phase.id
                    ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                    : "border-white/20 bg-white/5 text-white/75 hover:border-white/40"
                }`}
              >
                Fase {phase.id} - T{String(phase.temporadas[0]).padStart(2, "0")} a T{String(phase.temporadas[1]).padStart(2, "0")}
              </button>
            ))}
          </div>

          {currentPhase && (
            <div className="mb-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">Tema central</p>
                <p className="mt-1 text-sm text-white">{currentPhase.temaCentral}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">Objetivo pedagógico</p>
                <p className="mt-1 text-sm text-white">{currentPhase.objetivoPedagogico}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">Agentes dominantes</p>
                <p className="mt-1 text-sm text-white">{currentPhase.agentesDominantes.map(formatAgent).join(", ")}</p>
              </div>
            </div>
          )}

          {currentConflict && (
            <div className="mb-6 rounded-xl border border-amber-300/20 bg-amber-200/10 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-amber-100/80">Conflito narrativo da fase</p>
              <p className="mt-1 text-sm text-white">{currentConflict.conflitosCentrais}</p>
              <p className="mt-1 text-xs text-amber-100/80">Função: {currentConflict.funcaoNarrativa}</p>
            </div>
          )}

          <div className="space-y-2">
            {phaseSeasons.map((season) => (
              <article key={season.temporada} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-medium text-white">
                  T{String(season.temporada).padStart(2, "0")} - {season.tema}
                </p>
                <p className="mt-1 text-xs text-white/80">
                  Dominante: {formatAgent(season.agenteDominante)} | Suporte: {season.agentesSuporte.map(formatAgent).join(", ")}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
