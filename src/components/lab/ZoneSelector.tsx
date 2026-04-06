"use client";

import { ORDEM_UNIVERSOS } from "@/data/universos";
import { useUniverso } from "@/hooks/useUniverso";

export default function ZoneSelector() {
  const { universoAtivo, irParaUniverso } = useUniverso();

  return (
    <section className="mb-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {ORDEM_UNIVERSOS.slice(0, 6).map((id) => (
        <button
          key={id}
          onClick={() => irParaUniverso(id)}
          className={`rounded-lg border px-3 py-2 text-left text-xs uppercase tracking-wider ${
            universoAtivo === id
              ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
              : "border-white/10 bg-white/5 text-white/70"
          }`}
        >
          {id}
        </button>
      ))}
    </section>
  );
}
