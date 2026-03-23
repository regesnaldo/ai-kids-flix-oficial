import Link from "next/link";
import {
  Atom,
  Beaker,
  BookMarked,
  ChevronRight,
  Clock3,
  Orbit,
  Sparkles,
} from "lucide-react";

import NexusCore from "@/components/laboratorio/NexusCore";
import ParticleField from "@/components/laboratorio/ParticleField";

const fireflies = [
  { label: "Contexto", season: "linguagens", agent: "9" },
  { label: "Embeddings", season: "linguagens", agent: "7" },
  { label: "Inferência", season: "criacao", agent: "12" },
  { label: "Raciocínio", season: "criacao", agent: "13" },
  { label: "Atenção", season: "linguagens", agent: "10" },
  { label: "Vetores", season: "inovacao", agent: "19" },
] as const;

export default function LaboratorioPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(147,51,234,0.26),transparent_40%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.26),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(6,182,212,0.2),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]" />
      <ParticleField interactive count={50} />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-10 md:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/85">
            Câmara de Dissecação da Realidade Digital
          </p>
          <h1 className="mt-3 bg-gradient-to-r from-purple-300 via-cyan-300 to-blue-300 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            Laboratório MENTE.AI
          </h1>
          <p className="mt-4 text-sm text-gray-300 md:text-base">
            O NEXUS pulsa no centro e sincroniza jornadas entre Biblioteca Viva,
            Laboratório Prático e Simulações em tempo real.
          </p>
        </header>

        <div className="relative mt-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="space-y-4">
            <Link
              href="/laboratorio/biblioteca"
              className="group block rounded-2xl border border-cyan-400/20 bg-[#0c1227]/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/60 hover:shadow-[0_12px_30px_rgba(6,182,212,0.25)]"
            >
              <div className="flex items-center gap-3 text-cyan-300">
                <BookMarked className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.2em]">
                  Biblioteca Viva
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-white">
                Estantes respiram com livros-guia
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Explore temporadas, PDFs vivos e conexões sugeridas pelo NEXUS.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-200">
                Entrar
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/laboratorio/pratico"
              className="group block rounded-2xl border border-purple-400/20 bg-[#100d22]/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-purple-300/60 hover:shadow-[0_12px_30px_rgba(147,51,234,0.25)]"
            >
              <div className="flex items-center gap-3 text-purple-300">
                <Beaker className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.2em]">
                  Lab Prático de Dissecação
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-white">
                Estações holográficas para experimentar
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Execute testes guiados por agentes avançados e mestres.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-purple-200">
                Iniciar
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="relative mx-auto flex h-[420px] w-full max-w-[420px] items-center justify-center overflow-visible rounded-[999px] border border-cyan-300/30 bg-[radial-gradient(circle_at_center,rgba(8,47,73,0.75)_0%,rgba(17,24,39,0.65)_45%,rgba(2,6,23,0.35)_100%)] shadow-[0_0_80px_rgba(59,130,246,0.25)]">
            <div className="pointer-events-none absolute inset-0 rounded-[999px] bg-[conic-gradient(from_220deg,rgba(147,51,234,0.24),rgba(59,130,246,0.22),rgba(6,182,212,0.24),rgba(147,51,234,0.24))] opacity-60 blur-2xl" />
            <div className="pointer-events-none absolute inset-7 rounded-[999px] border border-white/15" />
            <div className="pointer-events-none absolute inset-14 rounded-[999px] border border-cyan-200/20" />
            <div className="absolute -left-4 top-8 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[11px] text-cyan-200">
              Constelacoes: Temporadas
            </div>
            <div className="absolute -right-6 bottom-12 rounded-full border border-purple-300/30 bg-purple-300/10 px-3 py-1 text-[11px] text-purple-200">
              Linha do Tempo Neural
            </div>
            <NexusCore />
          </div>

          <div className="space-y-4">
            <article className="rounded-2xl border border-blue-400/20 bg-[#0a1322]/70 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-blue-300">
                <Orbit className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.2em]">
                  Descoberta em camadas
                </p>
              </div>
              <p className="mt-3 text-sm text-gray-300">
                Fundamentos, Intermediário, Avançado e Mestre organizados por
                fluxo de aprendizado.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/laboratorio/biblioteca#fundamentos"
                  className="rounded-md border border-blue-300/30 bg-blue-500/10 px-3 py-2 text-blue-200 transition-colors hover:bg-blue-500/20"
                >
                  Fundamentos
                </Link>
                <Link
                  href="/laboratorio/biblioteca#linguagens"
                  className="rounded-md border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-emerald-200 transition-colors hover:bg-emerald-500/20"
                >
                  Intermediário
                </Link>
                <Link
                  href="/laboratorio/biblioteca#criacao"
                  className="rounded-md border border-orange-300/30 bg-orange-500/10 px-3 py-2 text-orange-200 transition-colors hover:bg-orange-500/20"
                >
                  Avançado
                </Link>
                <Link
                  href="/laboratorio/biblioteca#inovacao"
                  className="rounded-md border border-purple-300/30 bg-purple-500/10 px-3 py-2 text-purple-200 transition-colors hover:bg-purple-500/20"
                >
                  Mestre
                </Link>
              </div>
            </article>

            <Link
              href="/laboratorio/simulador"
              className="group flex items-center justify-between rounded-2xl border border-white/15 bg-black/35 p-4 transition-all duration-300 hover:border-blue-300/60 hover:shadow-[0_12px_24px_rgba(59,130,246,0.22)]"
            >
              <div>
                <div className="flex items-center gap-2 text-blue-300">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Simulador
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  Ative o fluxo de consciência e observe respostas emocionais.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-200 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#090b13]/60 p-5 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Partículas vaga-lumes (sussurros conceituais)
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {fireflies.map((concept) => (
              <Link
                key={concept.label}
                href={`/laboratorio/biblioteca?season=${concept.season}&agent=${concept.agent}`}
                title={`NEXUS sussurra: ${concept.label}`}
                className="group rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-xs text-gray-300 transition-all duration-300 hover:border-cyan-300/55 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(6,182,212,0.22)]"
              >
                <span className="inline-flex items-center gap-2">
                  <Atom className="h-3.5 w-3.5 text-cyan-300/85 transition-transform group-hover:scale-110" />
                  {concept.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

