"use client";

import { DIMENSOES } from "@/types/narrativa";
import type { DimensaoId } from "@/types/narrativa";

interface Props {
  value: DimensaoId;
  onChange: (value: DimensaoId) => void;
}

export default function DimensionSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {(Object.keys(DIMENSOES) as DimensaoId[]).map((id) => {
        const d = DIMENSOES[id];
        const active = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`rounded-lg border px-3 py-2 text-left transition ${
              active ? "border-white/60 bg-white/10" : "border-white/15 bg-white/[0.03]"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-white/60">{id.replace("D", "Dimensão ")}</p>
            <p className="font-semibold text-white">{d.nome}</p>
            <p className="text-xs text-white/70">{d.descricao}</p>
          </button>
        );
      })}
    </div>
  );
}

