'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ChevronDown, Globe, Plus, X } from 'lucide-react';

const AGENT_IMAGES = [
  '/images/agentes/nexus.png',
  '/images/agentes/volt.png',
  '/images/agentes/kaos.png',
  '/images/agentes/ethos.png',
  '/images/agentes/aurora.png',
  '/images/agentes/axiom.png',
  '/images/agentes/cipher.png',
  '/images/agentes/lyra.png',
  '/images/agentes/stratos.png',
  '/images/agentes/terra.png',
  '/images/agentes/prism.png',
  '/images/agentes/janus.png',
];

export default function RootLandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const cards = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      src: AGENT_IMAGES[i % AGENT_IMAGES.length],
      driftGroup: i % 2,
      delay: (i % 10) * 0.25,
    }));
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  const trending = [
    { name: 'NEXUS', role: 'O Arquiteto da Consciência', image: '/images/agentes/nexus.png' },
    { name: 'VOLT', role: 'O Espírito da Energia Neural', image: '/images/agentes/volt.png' },
    { name: 'KAOS', role: 'O Caos que Gera Ordem', image: '/images/agentes/kaos.png' },
    { name: 'ETHOS', role: 'A Voz da Consciência', image: '/images/agentes/ethos.png' },
    { name: 'AURORA', role: 'A Criadora de Mundos', image: '/images/agentes/aurora.png' },
    { name: 'CIPHER', role: 'O Hacker do Futuro', image: '/images/agentes/cipher.png' },
    { name: 'LYRA', role: 'A Harmonia dos Dados', image: '/images/agentes/lyra.png' },
    { name: 'STRATOS', role: 'O Estrategista', image: '/images/agentes/stratos.png' },
    { name: 'TERRA', role: 'A Guardiã da Natureza', image: '/images/agentes/terra.png' },
    { name: 'PRISM', role: 'O Espectro das Ideias', image: '/images/agentes/prism.png' },
  ] as const;

  const reasons = [
    {
      icon: '📱',
      title: 'Aprenda em qualquer dispositivo',
      desc: 'Acesse no celular, tablet, laptop ou TV. Sua jornada de IA vai onde você for.',
    },
    {
      icon: '⬇️',
      title: 'Salve para estudar offline',
      desc: 'Baixe módulos e continue aprendendo mesmo sem internet.',
    },
    {
      icon: '🤖',
      title: '22+ Agentes especializados',
      desc: 'Cada agente tem personalidade, narrativa e área de expertise únicas.',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Perfis para toda a família',
      desc: 'Crie perfis separados para adultos e crianças. Cada um no seu ritmo.',
    },
  ] as const;

  const faqs = [
    {
      q: 'O que é o MENTE.AI?',
      a: 'É uma plataforma de educação em IA com agentes inteligentes que ensinam, debatem e evoluem junto com você através de narrativas imersivas.',
    },
    {
      q: 'Quanto custa o MENTE.AI?',
      a: 'Você começa grátis. Após o período de teste, planos a partir de R$ 12,90/semana.',
    },
    {
      q: 'Em quais dispositivos posso usar?',
      a: 'Em qualquer dispositivo com navegador: celular, tablet, laptop ou smart TV.',
    },
    {
      q: 'Como faço para cancelar?',
      a: 'Cancele quando quiser direto nas configurações da sua conta, sem burocracia.',
    },
    {
      q: 'O que posso aprender no MENTE.AI?',
      a: 'IA, machine learning, redes neurais, ética em IA, criatividade computacional e muito mais — tudo com agentes que tornam o aprendizado imersivo.',
    },
    {
      q: 'É adequado para crianças?',
      a: 'Sim! Temos perfis e conteúdos específicos para crianças a partir de 7 anos, com linguagem adaptada e agentes amigáveis.',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <style jsx global>{`
        @keyframes landingDrift {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>

      <div
        className="absolute inset-0 z-0"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '14px',
          padding: '18px',
          alignContent: 'start',
        }}
        aria-hidden="true"
      >
        {cards.map((c) => (
          <div
            key={c.id}
            className="w-[120px] h-[180px] justify-self-center"
            style={{
              animationName: 'landingDrift',
              animationDuration: '8s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: c.driftGroup === 0 ? 'alternate' : 'alternate-reverse',
              animationDelay: `${c.delay}s`,
            }}
          >
            <img
              src={c.src}
              alt=""
              className="w-[120px] h-[180px] object-cover rounded-sm opacity-60"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      <div className="relative z-10 flex flex-col flex-1">
        <header className="px-6 md:px-12 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-white font-black text-2xl tracking-tight">
                MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded border border-white/30 bg-black/30 text-white hover:bg-white/10 transition"
                aria-label="Selecionar idioma"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">Português</span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="bg-red-600 hover:bg-red-500 transition text-white font-bold px-5 py-2 rounded"
              >
                Entrar
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <section className="min-h-[70vh] flex items-center justify-center px-6 md:px-12">
            <div className="text-center max-w-2xl">
              <h1 className="text-5xl font-black text-white tracking-tight">
                MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
              </h1>

              <p className="text-xl text-zinc-300 mt-4 text-center max-w-lg mx-auto">
                Aprenda IA com agentes que pensam, sentem e evoluem.
              </p>
              <p className="text-sm text-zinc-400 mt-2">
                A partir de R$ 12,90/semana. Cancele quando quiser.
              </p>

              <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-0">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="bg-white/10 border border-white/30 text-white placeholder-zinc-400 px-5 py-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none w-full sm:w-80 outline-none"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-lg sm:rounded-r-lg sm:rounded-l-none whitespace-nowrap transition"
                >
                  Vamos lá →
                </button>
              </form>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="mt-4 text-zinc-400 underline text-sm"
              >
                Já tenho conta
              </button>
            </div>
          </section>

          <section className="border-t border-zinc-800 py-16 px-6 md:px-12">
            <div className="bg-black/70 backdrop-blur-sm">
              <h2 className="text-white text-2xl font-bold px-6 md:px-12 mb-4">Em Alta</h2>
              <div className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-2">
                {trending.map((a, idx) => (
                  <div key={a.name} className="w-[200px] flex-shrink-0 relative cursor-pointer">
                    <div className="flex items-end">
                      <div className="text-[80px] font-black text-zinc-700 leading-none -mr-4 z-10 relative">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col gap-2">
                        <img
                          src={a.image}
                          alt={a.name}
                          className="w-[160px] h-[90px] object-cover rounded-md"
                          draggable={false}
                        />
                        <div className="w-[160px]">
                          <p className="text-white text-sm font-bold truncate">{a.name}</p>
                          <p className="text-zinc-400 text-xs truncate">{a.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-800 py-16 px-6 md:px-12">
            <div className="bg-black/70 backdrop-blur-sm max-w-5xl mx-auto">
              <h2 className="text-white text-2xl font-bold mb-8">Mais motivos para aprender</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reasons.map((r) => (
                  <div
                    key={r.title}
                    className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-xl p-6"
                  >
                    <div className="text-2xl">{r.icon}</div>
                    <h3 className="mt-3 text-white text-lg font-bold">{r.title}</h3>
                    <p className="mt-2 text-zinc-400 text-sm leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-800 py-16 px-6 md:px-12">
            <div className="bg-black/70 backdrop-blur-sm max-w-5xl mx-auto">
              <h2 className="text-white text-2xl font-bold mb-6">Perguntas frequentes</h2>
              <div className="overflow-hidden rounded-xl border border-zinc-700">
                {faqs.map((item, idx) => {
                  const open = faqOpen === idx;
                  return (
                    <div key={item.q} className="bg-zinc-800/80 border-b border-zinc-700 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setFaqOpen((prev) => (prev === idx ? null : idx))}
                        className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                      >
                        <span className="text-white text-base font-semibold">{item.q}</span>
                        <span className="text-white">
                          {open ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </span>
                      </button>
                      {open ? (
                        <div className="px-6 pb-6 text-zinc-300 text-sm leading-relaxed">
                          {item.a}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                <p className="text-white text-base font-semibold mb-4">
                  Quer começar? Informe seu email para criar sua conta.
                </p>
                <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="bg-white/10 border border-white/30 text-white placeholder-zinc-400 px-5 py-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none w-full sm:w-96 outline-none"
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-lg sm:rounded-r-lg sm:rounded-l-none whitespace-nowrap transition"
                  >
                    Vamos lá →
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="relative z-10 border-t border-zinc-800 px-6 md:px-12 pb-10 pt-6 text-sm text-zinc-500">
        <div className="max-w-5xl mx-auto">
          <p className="mb-6">Dúvidas? Ligue 0800 000 0000</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-8">
            {[
              'Perguntas frequentes',
              'Central de Ajuda',
              'Termos de Uso',
              'Privacidade',
              'Preferências de cookies',
            ].map((label) => (
              <a key={label} href="#" className="hover:text-zinc-300 transition-colors w-fit">
                {label}
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-white/20 bg-black/30 text-zinc-300 hover:bg-white/10 transition"
              aria-label="Selecionar idioma"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-semibold">Português</span>
              <ChevronDown className="w-4 h-4 opacity-80" />
            </button>
          </div>

          <p className="mt-6">© 2026 MENTE.AI</p>
        </div>
      </footer>
    </div>
  );
}
