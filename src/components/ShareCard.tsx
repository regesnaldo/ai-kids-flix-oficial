'use client'

interface ShareCardProps {
  agentName: string
  decisionText: string
  xpEarned: number
  archetype: string
}

export default function ShareCard({ agentName, decisionText, xpEarned, archetype }: ShareCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)', maxWidth: 400, minHeight: 280 }}>
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)' }} />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
            {agentName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold">{agentName}</p>
            <p className="text-xs text-white/60">{archetype}</p>
          </div>
        </div>
        <p className="text-lg font-medium leading-relaxed">&ldquo;{decisionText}&rdquo;</p>
        <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
          <span className="text-sm text-white/80">XP Ganho</span>
          <span className="text-lg font-bold text-yellow-400">+{xpEarned}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-white/40">
            <span style={{ color: '#fff' }}>MENTE</span>
            <span style={{ color: '#E50914' }}>.AI</span>
          </span>
          <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20">
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  )
}
