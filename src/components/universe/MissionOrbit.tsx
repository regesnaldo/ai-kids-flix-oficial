'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Agent definitions ──────────────────────────────────────────────────────
interface AgentOrbit {
  id: string;
  name: string;
  color: string;
  slug: string;
  orbit: 0 | 1 | 2 | 3;
  speed: number; // seconds for one full orbit
  size: number; // diameter in px
  active: boolean;
}

const AGENTS: AgentOrbit[] = [
  { id: 'nexus', name: 'NEXUS', color: '#00f0ff', slug: 'nexus', orbit: 0, speed: 0, size: 64, active: true },
  { id: 'volt', name: 'VOLT', color: '#f97316', slug: 'volt', orbit: 1, speed: 8, size: 40, active: true },
  { id: 'aurora', name: 'AURORA', color: '#a855f7', slug: 'aurora', orbit: 1, speed: 12, size: 40, active: true },
  { id: 'kaos', name: 'KAOS', color: '#ef4444', slug: 'kaos', orbit: 1, speed: 16, size: 40, active: false },
  { id: 'cipher', name: 'CIPHER', color: '#10b981', slug: 'cipher', orbit: 2, speed: 22, size: 36, active: false },
  { id: 'ethos', name: 'ETHOS', color: '#3b82f6', slug: 'ethos', orbit: 2, speed: 28, size: 36, active: false },
  { id: 'janus', name: 'JANUS', color: '#8b5cf6', slug: 'janus', orbit: 2, speed: 34, size: 36, active: false },
  { id: 'lyra', name: 'LYRA', color: '#ec4899', slug: 'lyra', orbit: 3, speed: 40, size: 32, active: false },
  { id: 'prism', name: 'PRISM', color: '#fbbf24', slug: 'prism', orbit: 3, speed: 46, size: 32, active: false },
  { id: 'stratos', name: 'STRATOS', color: '#06b6d4', slug: 'stratos', orbit: 3, speed: 52, size: 32, active: false },
  { id: 'terra', name: 'TERRA', color: '#10b981', slug: 'terra', orbit: 3, speed: 58, size: 32, active: false },
  { id: 'axiom', name: 'AXIOM', color: '#e2e8f0', slug: 'axiom', orbit: 3, speed: 64, size: 32, active: false },
];

// ─── Star particle generator ────────────────────────────────────────────────
function generateStars(count: number) {
  const stars: Array<{ id: number; top: string; left: string; size: number; delay: string }> = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${(Math.random() * 5).toFixed(1)}s`,
    });
  }
  return stars;
}

// ─── Orbit radii ────────────────────────────────────────────────────────────
const ORBIT_RADII: Record<number, number> = { 1: 160, 2: 280, 3: 400 };

// ─── Component ──────────────────────────────────────────────────────────────
export default function MissionOrbit() {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const stars = useMemo(() => generateStars(150), []);
  const nexusAgent = AGENTS.find((a) => a.id === 'nexus')!;
  const orbitingAgents = AGENTS.filter((a) => a.orbit > 0);

  const handleClick = (agent: AgentOrbit) => {
    if (agent.active) {
      router.push(`/universo/${agent.slug}`);
    } else {
      setToast('Agente bloqueado. Continue sua jornada.');
    }
  };

  // ─── Inline keyframes ───────────────────────────────────────────────────
  const keyframeStyles = `
    @keyframes orbit1 {
      from { transform: rotate(0deg) translateX(${ORBIT_RADII[1]}px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(${ORBIT_RADII[1]}px) rotate(-360deg); }
    }
    @keyframes orbit2 {
      from { transform: rotate(0deg) translateX(${ORBIT_RADII[2]}px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(${ORBIT_RADII[2]}px) rotate(-360deg); }
    }
    @keyframes orbit3 {
      from { transform: rotate(0deg) translateX(${ORBIT_RADII[3]}px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(${ORBIT_RADII[3]}px) rotate(-360deg); }
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 20px ${nexusAgent.color}, 0 0 40px ${nexusAgent.color}; }
      50%      { box-shadow: 0 0 40px ${nexusAgent.color}, 0 0 80px ${nexusAgent.color}, 0 0 120px ${nexusAgent.color}; }
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50%      { opacity: 1; }
    }
  `;

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#0a0a1a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Inject keyframes */}
      <style>{keyframeStyles}</style>

      {/* ── Star field ──────────────────────────────────────────────────── */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: '#ffffff',
            borderRadius: '50%',
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* ── Orbit rings ─────────────────────────────────────────────────── */}
      {[1, 2, 3].map((orbit) => (
        <div
          key={`ring-${orbit}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${ORBIT_RADII[orbit] * 2}px`,
            height: `${ORBIT_RADII[orbit] * 2}px`,
            marginTop: `-${ORBIT_RADII[orbit]}px`,
            marginLeft: `-${ORBIT_RADII[orbit]}px`,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── NEXUS center ────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${nexusAgent.size}px`,
          height: `${nexusAgent.size}px`,
          marginTop: `-${nexusAgent.size / 2}px`,
          marginLeft: `-${nexusAgent.size / 2}px`,
          background: nexusAgent.color,
          borderRadius: '50%',
          animation: 'pulse 3s ease-in-out infinite',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() => handleClick(nexusAgent)}
        onMouseEnter={() => setTooltip('NEXUS — Centro do Metaverso')}
        onMouseLeave={() => setTooltip(null)}
        title="NEXUS — Centro do Metaverso"
      />

      {/* ── Orbiting agents ─────────────────────────────────────────────── */}
      {orbitingAgents.map((agent) => {
        const containerSize = ORBIT_RADII[agent.orbit] * 2 + agent.size + 20;
        return (
          <div
            key={agent.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${containerSize}px`,
              height: `${containerSize}px`,
              marginTop: `-${containerSize / 2}px`,
              marginLeft: `-${containerSize / 2}px`,
              animation: `orbit${agent.orbit} ${agent.speed}s linear infinite`,
              pointerEvents: 'none',
            }}
          >
            {/* Agent sphere */}
            <div
              style={{
                position: 'absolute',
                top: `calc(50% - ${agent.size / 2}px)`,
                left: `calc(50% - ${agent.size / 2}px - ${ORBIT_RADII[agent.orbit]}px)`,
                width: `${agent.size}px`,
                height: `${agent.size}px`,
                background: agent.color,
                borderRadius: '50%',
                opacity: agent.active ? 1 : 0.4,
                boxShadow: agent.active
                  ? `0 0 12px ${agent.color}, 0 0 24px ${agent.color}66`
                  : 'none',
                cursor: agent.active ? 'pointer' : 'not-allowed',
                pointerEvents: 'auto',
                transition: 'transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(agent);
              }}
              onMouseEnter={() =>
                setTooltip(`${agent.name} — ${agent.active ? 'ATIVO' : 'BLOQUEADO'}`)
              }
              onMouseLeave={() => setTooltip(null)}
              title={`${agent.name} — ${agent.active ? 'ATIVO' : 'BLOQUEADO'}`}
            >
              {!agent.active && (
                <span style={{ color: '#ffffffaa', fontSize: `${agent.size * 0.4}px` }}>
                  🔒
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Tooltip ─────────────────────────────────────────────────────── */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 100,
            border: '1px solid rgba(255,255,255,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip}
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            zIndex: 200,
          }}
          onAnimationEnd={() => setToast(null)}
        >
          <style>{`@keyframes fadeOut { 0%,80%{opacity:1} 100%{opacity:0} }`}</style>
          <div style={{ animation: 'fadeOut 2.5s ease-in forwards' }}>{toast}</div>
        </div>
      )}
    </div>
  );
}
