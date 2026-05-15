"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface UniverseTransitionProps {
  fromAgent: string
  toAgent: string
  reason: string
  onComplete: () => void
}

const AGENT_INFO: Record<string, { name: string; color: string; avatar: string }> = {
  nexus: { name: "NEXUS", color: "#00D9FF", avatar: "/images/agentes/nexus.png" },
  volt: { name: "VOLT", color: "#FFD700", avatar: "/images/agentes/volt.png" },
  aurora: { name: "AURORA", color: "#FF6B9D", avatar: "/images/agentes/aurora.png" },
  ethos: { name: "ETHOS", color: "#9B59B6", avatar: "/images/agentes/ethos.png" },
  kaos: { name: "KAOS", color: "#E74C3C", avatar: "/images/agentes/kaos.png" },
  cipher: { name: "CIPHER", color: "#2ECC71", avatar: "/images/agentes/cipher.png" },
  lyra: { name: "LYRA", color: "#F39C12", avatar: "/images/agentes/lyra.png" },
  axiom: { name: "AXIOM", color: "#3498DB", avatar: "/images/agentes/axiom.png" },
  stratos: { name: "STRATOS", color: "#1ABC9C", avatar: "/images/agentes/stratos.png" },
  terra: { name: "TERRA", color: "#27AE60", avatar: "/images/agentes/terra.png" },
  prism: { name: "PRISM", color: "#E91E63", avatar: "/images/agentes/prism.png" },
  janus: { name: "JANUS", color: "#FF9800", avatar: "/images/agentes/janus.png" },
}

export function UniverseTransition({ fromAgent, toAgent, reason, onComplete }: UniverseTransitionProps) {
  const router = useRouter()
  const from = AGENT_INFO[fromAgent] || AGENT_INFO.nexus
  const to = AGENT_INFO[toAgent] || AGENT_INFO.nexus
  const [step, setStep] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600)
    const t2 = setTimeout(() => setStep(2), 1600)
    const t3 = setTimeout(() => setStep(3), 2600)
    const t4 = setTimeout(() => { setFadeOut(true); onComplete(); }, 3600)
    const t5 = setTimeout(() => router.push(`/universo/${toAgent}`), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); }
  }, [fromAgent, toAgent, router, onComplete])

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: '#000' }}>
      
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand-line {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        animation: 'scanline 4s linear infinite' }} />

      <div className="relative z-10 text-center px-8 max-w-lg">
        {step === 0 && (
          <div style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}>
            <img src={from.avatar} alt={from.name} className="w-24 h-24 rounded-full mx-auto mb-4 opacity-60"
              style={{ boxShadow: `0 0 40px ${from.color}44` }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            <p className="text-white/40 text-sm font-mono tracking-widest">{from.name}</p>
          </div>
        )}

        {step >= 1 && step < 3 && (
          <div style={{ animation: 'slide-up 0.6s ease-out' }}>
            <div className="text-white/30 text-xs font-mono tracking-widest mb-4">TRANSIÇÃO</div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <img src={from.avatar} alt={from.name} className="w-16 h-16 rounded-full opacity-60"
                style={{ boxShadow: `0 0 30px ${from.color}33` }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <div className="text-white/20 text-2xl">→</div>
              <img src={to.avatar} alt={to.name} className="w-16 h-16 rounded-full"
                style={{ boxShadow: `0 0 30px ${to.color}`, animation: 'pulse-glow 2s ease-in-out infinite' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div className="h-px mx-auto mb-4" style={{ background: `linear-gradient(90deg, transparent, ${to.color}, transparent)`, animation: 'expand-line 1.2s ease-out' }} />
            <p className="text-white/50 text-xs font-mono italic max-w-xs mx-auto">{reason}</p>
          </div>
        )}

        {step >= 3 && (
          <div style={{ animation: 'slide-up 0.6s ease-out' }}>
            <p className="text-white/80 text-sm font-mono tracking-widest mb-2">ENTRANDO EM</p>
            <p className="text-2xl font-bold" style={{ color: to.color, textShadow: `0 0 30px ${to.color}88` }}>{to.name}</p>
            <p className="text-white/30 text-xs font-mono mt-3">REDIRECIONANDO...</p>
          </div>
        )}
      </div>
    </div>
  )
}
