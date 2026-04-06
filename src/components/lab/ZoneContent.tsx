"use client";

import { useUniverso } from "@/hooks/useUniverso";

export default function ZoneContent() {
  const { universo } = useUniverso();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Zona ativa</p>
      <h2 className="mt-1 text-2xl font-bold text-white">{universo.nome}</h2>
      <p className="mt-2 text-sm text-white/80">{universo.funcao}</p>
      <p className="mt-3 text-xs text-white/60">{universo.gatilhoDeAtivacao}</p>
    </section>
  );
}
