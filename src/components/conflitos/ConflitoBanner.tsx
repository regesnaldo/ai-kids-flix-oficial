"use client";

import { useMemo } from "react";
import { CONFLITOS } from "@/data/conflitos";
import { useConflito } from "@/hooks/useConflito";

export default function ConflitoBanner() {
  const { conflitoAtivoId, responderConflito } = useConflito();
  const conflito = useMemo(
    () => CONFLITOS.find((c) => c.id === conflitoAtivoId) ?? null,
    [conflitoAtivoId],
  );

  if (!conflito) return null;

  function handleEscolha(posicao: "AGENTE_1" | "AGENTE_2" | "NEXUS") {
    responderConflito({
      conflitoId: conflito.id,
      posicaoEscolhida: posicao,
      justificativa: `Escolha registrada: ${posicao}`,
    });
  }

  return (
    <section className="rounded-xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-blue-300/80">Conflito Ativo</p>
      <h3 className="mt-1 text-lg font-bold text-white">{conflito.titulo}</h3>
      <p className="mt-2 text-sm text-white/80">{conflito.descricao}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button
          onClick={() => handleEscolha("AGENTE_1")}
          className="rounded-lg border border-yellow-400/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200"
        >
          ⚡ {conflito.agente1.toUpperCase()}
        </button>
        <button
          onClick={() => handleEscolha("AGENTE_2")}
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          ⚖️ {conflito.agente2.toUpperCase()}
        </button>
        <button
          onClick={() => handleEscolha("NEXUS")}
          className="rounded-lg border border-blue-400/40 bg-blue-500/10 px-3 py-2 text-sm text-blue-200"
        >
          🌌 NEXUS decide
        </button>
      </div>
    </section>
  );
}

