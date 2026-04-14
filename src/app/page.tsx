'use client';

import { useRouter } from 'next/navigation';
import { type RefObject, type TouchEvent, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Play, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

type Agente = {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  imagem: string;
  video?: string;
  categoria: 'mentor' | 'novo' | 'idade';
  idadeMin?: number;
};

const AGENTES_DESTAQUE: Agente[] = [
  {
    id: 'ethos',
    nome: 'ETHOS',
    descricao: 'O Filósofo. Aprenda a pensar criticamente sobre ética, vieses e decisões na IA.',
    cor: 'from-purple-600 to-blue-600',
    imagem: '/images/agentes/ethos.png',
    categoria: 'mentor',
  },
  {
    id: 'nexus',
    nome: 'NEXUS',
    descricao: 'O Conector. Entenda como Transformers e atenção multi-head conectam ideias.',
    cor: 'from-blue-600 to-cyan-600',
    imagem: '/images/agentes/nexus.png',
    categoria: 'mentor',
  },
  {
    id: 'aurora',
    nome: 'AURORA',
    descricao: 'A Criadora. Explore espaços vetoriais e gere arte com palavras.',
    cor: 'from-pink-600 to-rose-600',
    imagem: '/images/agentes/aurora.png',
    categoria: 'mentor',
  },
  {
    id: 'volt',
    nome: 'VOLT',
    descricao: 'O Energético. Sinta a descarga do backpropagation e redes neurais.',
    cor: 'from-amber-600 to-orange-600',
    imagem: '/images/agentes/volt.png',
    categoria: 'mentor',
  },
];

const AGENTES_MENTORES: Agente[] = [
  { id: 'ethos', nome: 'ETHOS', descricao: 'Ética & Filosofia', cor: 'from-purple-500 to-blue-500', imagem: '/images/agentes/ethos.png', categoria: 'mentor' },
  { id: 'nexus', nome: 'NEXUS', descricao: 'Conexão & Transformers', cor: 'from-blue-500 to-cyan-500', imagem: '/images/agentes/nexus.png', categoria: 'mentor' },
  { id: 'aurora', nome: 'AURORA', descricao: 'Criatividade & Vetores', cor: 'from-pink-500 to-rose-500', imagem: '/images/agentes/aurora.png', categoria: 'mentor' },
  { id: 'volt', nome: 'VOLT', descricao: 'Energia & Redes Neurais', cor: 'from-amber-500 to-orange-500', imagem: '/images/agentes/volt.png', categoria: 'mentor' },
  { id: 'logos', nome: 'LOGOS', descricao: 'Lógica & Razão', cor: 'from-emerald-500 to-teal-500', imagem: '/images/agentes/nexus.png', categoria: 'mentor' },
];

const AGENTES_NOVOS: Agente[] = [
  { id: 'aurora', nome: 'AURORA', descricao: 'Crie arte com espaços vetoriais', cor: 'from-pink-500 to-rose-500', imagem: '/images/agentes/aurora.png', categoria: 'novo' },
  { id: 'volt', nome: 'VOLT', descricao: 'Descarga de conhecimento neural', cor: 'from-amber-500 to-orange-500', imagem: '/images/agentes/volt.png', categoria: 'novo' },
  { id: 'ethos', nome: 'ETHOS', descricao: 'Questões éticas sobre IA', cor: 'from-purple-500 to-blue-500', imagem: '/images/agentes/ethos.png', categoria: 'novo' },
  { id: 'nexus', nome: 'NEXUS', descricao: 'Conecte conceitos de IA', cor: 'from-blue-500 to-cyan-500', imagem: '/images/agentes/nexus.png', categoria: 'novo' },
  { id: 'logos', nome: 'LOGOS', descricao: 'O véio da lógica', cor: 'from-emerald-500 to-teal-500', imagem: '/images/agentes/nexus.png', categoria: 'novo' },
];

const FAIXAS_ETARIAS = [
  { id: 'kids', nome: 'Pequenos Exploradores', faixa: '7-10 anos', cor: 'from-yellow-400 to-orange-400', icon: '🚀' },
  { id: 'tweens', nome: 'Jovens Pensadores', faixa: '11-14 anos', cor: 'from-blue-400 to-cyan-400', icon: '🧠' },
  { id: 'teens', nome: 'Adolescentes', faixa: '15-17 anos', cor: 'from-purple-400 to-pink-400', icon: '💡' },
  { id: 'adultos', nome: 'Adultos Curiosos', faixa: '18+ anos', cor: 'from-emerald-400 to-teal-400', icon: '🎯' },
] as const;

export default function Home() {
  const router = useRouter();
  const [agenteAtivo, setAgenteAtivo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const carrosselRef = useRef<HTMLDivElement>(null);
  const carrosselNovoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = globalThis.setInterval(() => {
      setAgenteAtivo((prev) => (prev + 1) % AGENTES_DESTAQUE.length);
    }, 8000);
    return () => globalThis.clearInterval(interval);
  }, [isPaused]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent<HTMLElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setAgenteAtivo((prev) => (prev + 1) % AGENTES_DESTAQUE.length);
    }
    if (isRightSwipe) {
      setAgenteAtivo((prev) => (prev - 1 + AGENTES_DESTAQUE.length) % AGENTES_DESTAQUE.length);
    }
  };

  const scrollCarrossel = (ref: RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const agenteAtual = AGENTES_DESTAQUE[agenteAtivo];

  return (
    <main className="min-h-screen bg-[#141414] text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <section
        className="relative h-[85vh] w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${agenteAtual.cor} opacity-20`} />
          {agenteAtual.video ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              playsInline
              muted={isMuted}
            >
              <source src={agenteAtual.video} type="video/mp4" />
            </video>
          ) : (
            <Image src={agenteAtual.imagem} alt={agenteAtual.nome} fill className="object-cover" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-7xl">
          <span className="text-red-600 font-heading font-bold text-lg mb-4 tracking-wider">MENTE.AI ORIGINAL</span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight">{agenteAtual.nome}</h1>
          <p className="font-body text-lg md:text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed">{agenteAtual.descricao}</p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button
              type="button"
              onClick={() => router.push(`/agentes/${agenteAtual.id}`)}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black" />
              Conversar
            </button>
            <button
              type="button"
              onClick={() => router.push(`/agentes/${agenteAtual.id}`)}
              className="flex items-center gap-2 bg-gray-500/30 backdrop-blur-sm text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-500/50 transition-all duration-200"
            >
              <Info className="w-5 h-5" />
              Saiba mais
            </button>
          </div>

          <div className="flex items-center gap-3">
            {AGENTES_DESTAQUE.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAgenteAtivo(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === agenteAtivo ? 'w-12 bg-white' : 'w-6 bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => setIsMuted((v) => !v)}
              className="ml-4 p-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />
      </section>

      <section className="px-6 md:px-12 lg:px-20 -mt-20 relative z-20 mb-12">
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-4 text-gray-200">Seus Mentores</h2>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollCarrossel(carrosselRef, 'left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 flex items-center justify-center"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div
            ref={carrosselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {AGENTES_MENTORES.map((agente) => (
              <div
                key={agente.id}
                onClick={() => router.push(`/agentes/${agente.id}`)}
                onMouseEnter={() => setHoveredCard(agente.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative flex-none w-[200px] md:w-[240px] aspect-[2/3] rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                  hoveredCard === agente.id ? 'scale-110 z-20' : 'scale-100'
                }`}
              >
                <Image src={agente.imagem} alt={agente.nome} fill className="object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${agente.cor} opacity-0 hover:opacity-30 transition-opacity`} />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="font-heading font-bold text-lg">{agente.nome}</h3>
                  <p className="font-body text-sm text-gray-300">{agente.descricao}</p>
                </div>
                {hoveredCard === agente.id && <div className="absolute inset-0 border-2 border-white/50 rounded-md" />}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollCarrossel(carrosselRef, 'right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 flex items-center justify-center"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 mb-12">
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-4 text-gray-200">Novo no NEXUS</h2>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollCarrossel(carrosselNovoRef, 'left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 flex items-center justify-center"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div
            ref={carrosselNovoRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {AGENTES_NOVOS.map((agente) => (
              <div
                key={agente.id}
                onClick={() => router.push(`/agentes/${agente.id}`)}
                className="relative flex-none w-[200px] md:w-[240px] aspect-video rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 group/card"
              >
                <Image src={agente.imagem} alt={agente.nome} fill className="object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-br ${agente.cor} opacity-40 group-hover/card:opacity-60 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <h3 className="font-heading font-bold text-xl mb-1">{agente.nome}</h3>
                  <p className="font-body text-xs text-gray-200">{agente.descricao}</p>
                  <span className="mt-2 px-3 py-1 bg-red-600 text-xs font-bold rounded-full">NOVO</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollCarrossel(carrosselNovoRef, 'right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 flex items-center justify-center"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 mb-20">
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-4 text-gray-200">Escolha sua Jornada</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FAIXAS_ETARIAS.map((faixa) => (
            <div
              key={faixa.id}
              onClick={() => router.push('/home')}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group bg-gradient-to-br ${faixa.cor} p-6 flex flex-col justify-between`}
            >
              <span className="text-4xl">{faixa.icon}</span>
              <div>
                <h3 className="font-heading font-bold text-lg leading-tight mb-1">{faixa.nome}</h3>
                <p className="font-body text-sm text-white/80">{faixa.faixa}</p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-12 lg:px-20 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500 font-body text-sm">
          <p className="mb-2">© 2026 MENTE.AI — Metaverso Educacional</p>
          <p>NEXUS, VOLT, AURORA e ETHOS aguardam você.</p>
        </div>
      </footer>
    </main>
  );
}
