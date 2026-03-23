"use client";

import { useMemo, useState } from "react";
import {
  Beaker,
  Microscope,
  Scissors,
  Search,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import { agents, type Agent } from "@/data/agents";
import EstacaoAgente from "@/components/laboratorio/EstacaoAgente";
import ParticleField from "@/components/laboratorio/ParticleField";

const PRACTICAL_AGENT_IDS = new Set(["11", "12", "13", "14", "15", "16", "17", "18"]);

const EXPERIMENT_LABELS: Record<string, string> = {
  "11": "Arquitetura de Sistemas",
  "12": "Predição e Probabilidades",
  "13": "Debug e Investigação",
  "14": "Memória de Curto Prazo",
  "15": "Armazenamento e Recuperação",
  "16": "Análise de Cenários",
  "17": "Configurações Avançadas",
  "18": "Validação de Regras",
};

export default function PraticoClient() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const practicalAgents = useMemo(
    () => agents.filter((agent) => PRACTICAL_AGENT_IDS.has(agent.id)),
    [],
  );

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#05070f] px-4 py-10 text-white md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(147,51,234,0.25),transparent_35%),radial-gradient(circle_at_92%_16%,rgba(6,182,212,0.2),transparent_35%),radial-gradient(circle_at_52%_92%,rgba(59,130,246,0.2),transparent_42%)]" />
        <ParticleField />

        <div className="relative mx-auto w-full max-w-7xl">
          <header className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/85">
              Sala de Dissecação Tecnológica
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Laboratório Prático</h1>
            <p className="mt-3 text-sm text-gray-300 md:text-base">
              Estações holográficas guiadas pelos agentes avançados e mestres.
              O NEXUS sincroniza todos os experimentos em tempo real.
            </p>
          </header>

          <section className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <Search className="h-4 w-4 text-cyan-300" />
                <span className="rounded-full border border-cyan-300/35 bg-cyan-500/10 px-2 py-1">
                  Lupa de debug
                </span>
              <Scissors className="h-4 w-4 text-purple-300" />
              <span className="rounded-full border border-purple-300/35 bg-purple-500/10 px-2 py-1">
                Bisturi de dados
              </span>
              <Wrench className="h-4 w-4 text-blue-300" />
                <span className="rounded-full border border-blue-300/35 bg-blue-500/10 px-2 py-1">
                  Pinça de ajuste fino
                </span>
              <Microscope className="ml-1 h-4 w-4 text-cyan-200" />
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {practicalAgents.map((agent) => (
              <EstacaoAgente key={agent.id} agent={agent} onOpen={setSelectedAgent} />
            ))}
          </section>
        </div>
      </main>

      {selectedAgent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-400/30 bg-[#091126] p-5 shadow-[0_20px_40px_rgba(6,182,212,0.25)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                  Experimento Ativo
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {selectedAgent.technicalName} &quot;{selectedAgent.nickname}&quot;
                </h2>
                <p className="mt-1 text-sm text-purple-200">
                  {EXPERIMENT_LABELS[selectedAgent.id]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="rounded-full border border-white/15 p-1.5 text-gray-300 transition-colors hover:border-cyan-300/55 hover:text-cyan-200"
                aria-label="Fechar experimento"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-cyan-400/25 bg-[#030915] p-4">
              <p className="font-mono text-xs text-cyan-200/95">
                {`> nexus.bind("${selectedAgent.id}", "${selectedAgent.technicalName}")`}
              </p>
              <p className="mt-1 font-mono text-xs text-blue-200/90">
                {`> run.experiment("${EXPERIMENT_LABELS[selectedAgent.id]}")`}
              </p>
              <p className="mt-1 font-mono text-xs text-purple-200/90">
                {`> status: synchronized`}
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-300">
              Simulação preparada pelo mentor <strong>{selectedAgent.nickname}</strong>.
              Execute para observar sinais, validações e respostas coordenadas pelo NEXUS.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                <Beaker className="h-4 w-4" />
                Executar
              </button>
              <button
                type="button"
                className="rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 transition-colors hover:bg-cyan-500/20"
              >
                Ver métrica
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-gray-200 transition-colors hover:border-purple-300/60 hover:text-purple-200"
              >
                <Sparkles className="h-4 w-4" />
                Sincronizar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
