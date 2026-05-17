"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type AdPlacementProps = {
  onClose: () => void;
  seconds?: number;
  nextEpisodeHref?: string | null;
};

export default function AdPlacement({ onClose, seconds = 15, nextEpisodeHref = null }: AdPlacementProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onClose();
      return;
    }
    const timer = globalThis.setTimeout(() => setRemaining((prev) => prev - 1), 1000);
    return () => globalThis.clearTimeout(timer);
  }, [remaining, onClose]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1a] text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/40 p-1.5 text-zinc-300 hover:text-white hover:bg-black/60 transition"
          aria-label="Fechar anúncio"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
          <div className="relative border-b border-white/10 md:border-b-0 md:border-r md:border-white/10 p-6">
            <img
              src="/images/agentes/nexus.png"
              alt="NEXUS"
              className="h-56 w-full rounded-xl object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }}
            />
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight">NEXUS</h3>
            <p className="mt-1 text-sm text-zinc-300">Seu guia no universo MENTE.AI</p>
          </div>

          <div className="relative p-6 md:p-8">
            <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold text-zinc-300">
              Anúncio
            </span>

            <div className="h-full min-h-[260px] rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-900/40 p-6 flex flex-col justify-between">
              <div>
                <p className="text-2xl font-extrabold text-white">Seu anúncio aqui</p>
                <p className="mt-3 text-sm text-zinc-300">
                  Alcance estudantes de IA em momentos de aprendizado
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/conta"
                    className="inline-flex items-center justify-center rounded-lg bg-white text-zinc-950 px-4 py-2 text-sm font-bold hover:bg-zinc-200 transition"
                  >
                    Anunciar no MENTE.AI
                  </Link>
                  <p className="text-xs text-zinc-400">
                    Fechar em <span className="font-bold text-zinc-200">{remaining}s</span>...
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {remaining <= seconds - 5 ? (
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10 transition"
                    >
                      Pular anúncio
                    </button>
                  ) : null}
                  {nextEpisodeHref ? (
                    <Link
                      href={nextEpisodeHref}
                      className="inline-flex items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/20 transition"
                    >
                      Próximo episódio
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
