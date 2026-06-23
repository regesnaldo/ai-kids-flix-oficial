import Link from "next/link";

/* ─── Data ─── */

const STEPS = [
  {
    step: "01",
    title: "Escolha seu agente",
    description: "12 agentes com universos únicos esperando por você.",
  },
  {
    step: "02",
    title: "Entre no universo",
    description: "Cada agente tem um mundo 3D imersivo para explorar.",
  },
  {
    step: "03",
    title: "Aprenda interagindo",
    description: "O sistema adapta a narrativa ao seu perfil cognitivo.",
  },
];

const AGENTS = [
  { name: "NEXUS", tagline: "O centro de tudo. Presente em todos os mundos.", accent: "text-[var(--neon-cyan)]" },
  { name: "VOLT", tagline: "Energia e velocidade. Domina circuitos quânticos.", accent: "text-[var(--neon-purple)]" },
  { name: "KAOS", tagline: "O caos que gera ordem. Mestre dos algoritmos.", accent: "text-[var(--neon-orange)]" },
  { name: "LYRA", tagline: "Harmonia entre dados e emoção.", accent: "text-[var(--neon-pink)]" },
  { name: "AURORA", tagline: "Desperta potenciais adormecidos.", accent: "text-[var(--neon-green)]" },
  { name: "CIPHER", tagline: "Decifra padrões invisíveis.", accent: "text-[var(--neon-blue)]" },
];

/* ─── Page ─── */

export default function LandingPage() {
  return (
    <div className="bg-[var(--cyber-black)] text-white min-h-screen">

      {/* ═══════════════════════════════════════════
          SEÇÃO 1 — HERO
          ═══════════════════════════════════════════ */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 gap-6">
        <h1 className="font-[var(--font-orbitron)] text-4xl sm:text-5xl lg:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight">
          Não apenas use Inteligência Artificial. Entenda-a.
        </h1>

        <p className="font-[var(--font-display)] text-white/70 text-lg sm:text-xl max-w-2xl leading-relaxed">
          O metaverso educacional onde você aprende IA de forma imersiva,
          interativa e narrativa.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link
            href="/cadastro"
            className="glow-cyan inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-200 hover:brightness-110 bg-[var(--neon-cyan)] text-[var(--cyber-black)]"
          >
            Comece sua jornada
          </Link>
          <Link
            href="/login"
            className="glass inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-200 text-[var(--neon-cyan)]"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 2 — COMO FUNCIONA
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-center mb-14">
          Como funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.step} className="glass rounded-2xl p-8 transition-all duration-300">
              <span className="font-[var(--font-orbitron)] text-[var(--neon-cyan)] text-sm font-bold tracking-widest">
                {s.step}
              </span>
              <h3 className="font-[var(--font-display)] text-xl font-semibold mt-4 mb-3">
                {s.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 3 — AGENTES
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-[var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-center mb-4">
          Conheça os agentes
        </h2>
        <p className="text-white/50 text-center text-sm mb-14 max-w-xl mx-auto">
          Cada agente é uma porta de entrada para um universo único de conhecimento.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent) => (
            <div key={agent.name} className="glass rounded-2xl p-6 transition-all duration-300">
              <span className={`font-[var(--font-orbitron)] text-lg font-bold tracking-wider ${agent.accent}`}>
                {agent.name}
              </span>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                {agent.tagline}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/agentes"
            className="inline-flex items-center gap-2 font-semibold text-sm transition-all duration-200 text-[var(--neon-cyan)]"
          >
            Ver todos os agentes
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEÇÃO 4 — CTA FINAL
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-24 text-center max-w-2xl mx-auto">
        <h2 className="font-[var(--font-orbitron)] text-3xl sm:text-4xl font-bold mb-6 leading-tight">
          Pronto para entrar no metaverso?
        </h2>
        <p className="text-white/60 text-base mb-10">
          Crie sua conta gratuita e comece a aprender IA como nunca antes.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/cadastro"
            className="glow-purple inline-flex items-center px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:brightness-110 bg-[var(--neon-purple)] text-white"
          >
            Criar conta grátis
          </Link>
          <Link
            href="/planos"
            className="glass inline-flex items-center px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 text-[var(--neon-purple)]"
          >
            Ver planos
          </Link>
        </div>
      </section>

    </div>
  );
}
