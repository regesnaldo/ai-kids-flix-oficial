import type { Metadata } from 'next'
import CognitiveHero from '@/components/hero/CognitiveHero'

export const metadata: Metadata = {
  title: 'MENTE.AI — Universe of Agents',
  description:
    'Entre em um sistema operacional cognitivo. Cada agente possui presença, personalidade e função.',
}

export default function HeroPage() {
  return (
    <main className="fixed inset-0 overflow-hidden">
      <CognitiveHero />
    </main>
  )
}
