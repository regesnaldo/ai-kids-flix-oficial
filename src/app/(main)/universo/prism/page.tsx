'use client'

import Link from 'next/link'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'

const PrismScene = dynamic(
  () => import('@/components/scenes/PrismScene').then((m) => m.PrismScene),
  { ssr: false, loading: () => <div className="w-full h-full bg-black" /> }
)

const AGENT = {
  name: 'PRISM "O REVELADOR"',
  role: 'O Revelador',
  description: 'Revelar como a IA pode mostrar perspectivas que nunca consideramos.',
  approach: 'Divide a realidade em múltiplas perspectivas simultâneas. "A verdade tem muitas faces."',
  color: '#8B5CF6',
  values: ['revelação', 'perspectiva', 'transformação', 'verdade'],
}

export default function PrismUniversePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 z-0"><Canvas><PrismScene /></Canvas></div>
      <div className="absolute inset-0 z-5 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
      />
      <Link href="/agentes" className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono tracking-wide transition-all duration-300 hover:bg-white/5"
        style={{ color: AGENT.color, borderColor: `${AGENT.color}40`, border: '1px solid' }}>
        ← Voltar
      </Link>
      <div className="absolute bottom-12 left-6 md:left-12 right-6 z-10 max-w-3xl">
        <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: AGENT.color }}>{AGENT.role}</p>
        <h1 className="text-white text-4xl md:text-7xl font-black mb-3 tracking-tight">{AGENT.name}</h1>
        <p className="text-white/70 text-base md:text-xl leading-relaxed max-w-2xl">{AGENT.description}</p>
        <p className="text-white/40 text-sm md:text-base leading-relaxed mt-2 max-w-xl">{AGENT.approach}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {AGENT.values.map((v) => (
            <span key={v} className="px-3 py-1 text-xs border rounded-full uppercase tracking-wider"
              style={{ borderColor: `${AGENT.color}40`, color: AGENT.color, background: `${AGENT.color}10` }}>{v}</span>
          ))}
        </div>
      </div>
    </main>
  )
}
