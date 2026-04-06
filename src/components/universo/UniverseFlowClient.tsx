"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { Universo } from "@/data/universos";
import UniversoCard from "@/components/universo/UniversoCard";
import NexusDialogLive from "@/components/universo/NexusDialogLive";

const TransitionGateway = dynamic(() => import("@/components/universo/TransitionGateway"), {
  ssr: false,
  loading: () => null,
});

interface UniverseFlowClientProps {
  universo: Universo;
}

interface NarrativaResponse {
  agentePrimarioCanonico?: string;
  ultimaFalaSemente?: string;
}

export default function UniverseFlowClient({ universo }: UniverseFlowClientProps) {
  const router = useRouter();
  const [transition, setTransition] = useState<{
    active: boolean;
    toAgent: string;
    seed: string;
  }>({ active: false, toAgent: universo.id, seed: "" });
  const [loading, setLoading] = useState(false);

  async function avancarJornada() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/narrativa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensagem: "Quero seguir para a próxima etapa da jornada.",
          agenteAtual: universo.id === "axim" ? "axiom" : universo.id,
          historico: ["continuidade narrativa", "transição entre universos"],
          choiceLabel: "seguir_jornada",
        }),
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = (await response.json()) as NarrativaResponse;
      const toAgent = (data.agentePrimarioCanonico ?? universo.id).toLowerCase();
      const seed = data.ultimaFalaSemente ?? "A narrativa se reorganiza para abrir um novo ângulo.";

      setTransition({ active: true, toAgent, seed });
      setTimeout(() => {
        router.push(`/universo/${toAgent}`);
      }, 1300);
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <TransitionGateway
        active={transition.active}
        fromAgent={universo.id}
        toAgent={transition.toAgent}
        seedLine={transition.seed}
      />

      <UniversoCard universo={universo} />
      {universo.id === "nexus" ? (
        <NexusDialogLive />
      ) : (
        <section className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
          Este universo está ativo. O modo de chat dedicado existe no piloto do NEXUS.
        </section>
      )}

      <section className="rounded-xl border border-blue-300/20 bg-blue-950/20 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300/80">Fluxo narrativo</p>
        <p className="mt-2 text-sm text-blue-100/85">
          A última fala do agente atual planta a semente da próxima etapa. O roteador decide o próximo universo e a
          transição acontece em modo cinematográfico.
        </p>
        <button
          onClick={() => void avancarJornada()}
          disabled={loading || transition.active}
          className="mt-3 rounded-lg border border-blue-300/40 bg-blue-500/20 px-3 py-2 text-sm font-semibold text-blue-100 disabled:opacity-50"
        >
          {loading ? "Sincronizando jornada..." : "Avançar para próximo universo"}
        </button>
      </section>
    </main>
  );
}

