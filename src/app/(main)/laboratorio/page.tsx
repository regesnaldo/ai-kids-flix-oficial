import ParticleField from "@/components/laboratorio/ParticleField";
import ZoneSelector from "@/components/lab/ZoneSelector";
import ZoneContent from "@/components/lab/ZoneContent";
import SeasonMapPanel from "@/components/narrativa/SeasonMapPanel";

export default function LaboratorioPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(147,51,234,0.2),transparent_40%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(6,182,212,0.15),transparent_45%)]" />
      <ParticleField interactive={false} count={30} />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-12 md:px-8">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Laboratório Virtual Interativo
          </div>
          <h1 className="mt-2 bg-gradient-to-r from-purple-300 via-cyan-300 to-blue-300 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Laboratório MENTE.AI
          </h1>
          <p className="mt-4 text-sm text-gray-400 md:text-base">
            Experimente inteligência artificial em 3D — visualize, interaja e converse com agentes especializados em tempo real.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />4 Zonas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500" />3D ao vivo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />4 Agentes IA
              </span>
            </div>
          </div>
        </header>

        <ZoneSelector />
        <ZoneContent />
        <SeasonMapPanel />
      </section>
    </main>
  );
}
