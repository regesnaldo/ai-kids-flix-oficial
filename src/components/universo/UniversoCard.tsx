"use client";

import Link from "next/link";
import type { Universo } from "@/data/universos";

interface Props {
  universo: Universo;
}

export default function UniversoCard({ universo }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{universo.titulo}</p>
      <h3 className="mt-1 text-2xl font-black text-white">{universo.nome}</h3>
      <p className="mt-2 text-sm text-white/80">{universo.funcao}</p>
      <p className="mt-3 text-xs text-white/60">{universo.gatilhoDeAtivacao}</p>
      <Link
        href={`/universo/${universo.id}`}
        className="mt-4 inline-block rounded-md border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
      >
        Entrar no universo
      </Link>
    </article>
  );
}

