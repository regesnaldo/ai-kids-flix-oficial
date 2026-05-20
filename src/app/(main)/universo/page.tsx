'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type StarData = {
  left: string;
  top: string;
  size: string;
  color: string;
  opacity: number;
  twinkle: boolean;
};

type PlanetData = {
  id: string;
  name: string;
  color: string;
  lightColor: string;
  top: string;
  left: string;
  unlocked: boolean;
  delay: number;
};

const planets: PlanetData[] = [
  { id: 'nexus', name: 'NEXUS', color: '#00f5ff', lightColor: '#6ee7ff', top: '45%', left: '48%', unlocked: true, delay: 0 },
  { id: 'volt', name: 'VOLT', color: '#ffff00', lightColor: '#fff95c', top: '25%', left: '70%', unlocked: true, delay: 2 },
  { id: 'aurora', name: 'AURORA', color: '#ff00ff', lightColor: '#ff8bff', top: '65%', left: '25%', unlocked: true, delay: 4 },
  { id: 'ethos', name: 'ETHOS', color: '#888888', lightColor: '#aaaaaa', top: '20%', left: '30%', unlocked: false, delay: 0 },
  { id: 'kaos', name: 'KAOS', color: '#888888', lightColor: '#aaaaaa', top: '75%', left: '65%', unlocked: false, delay: 0 },
  { id: 'cipher', name: 'CIPHER', color: '#888888', lightColor: '#aaaaaa', top: '35%', left: '15%', unlocked: false, delay: 0 },
  { id: 'lyra', name: 'LYRA', color: '#888888', lightColor: '#aaaaaa', top: '55%', left: '80%', unlocked: false, delay: 0 },
  { id: 'axiom', name: 'AXIOM', color: '#888888', lightColor: '#aaaaaa', top: '15%', left: '55%', unlocked: false, delay: 0 },
  { id: 'stratos', name: 'STRATOS', color: '#888888', lightColor: '#aaaaaa', top: '80%', left: '40%', unlocked: false, delay: 0 },
  { id: 'terra', name: 'TERRA', color: '#888888', lightColor: '#aaaaaa', top: '30%', left: '85%', unlocked: false, delay: 0 },
  { id: 'prism', name: 'PRISM', color: '#888888', lightColor: '#aaaaaa', top: '70%', left: '10%', unlocked: false, delay: 0 },
  { id: 'janus', name: 'JANUS', color: '#888888', lightColor: '#aaaaaa', top: '88%', left: '75%', unlocked: false, delay: 0 },
];

const connections = [
  ['nexus', 'volt'],
  ['nexus', 'aurora'],
  ['volt', 'aurora'],
] as const;

function createStars(): StarData[] {
  return Array.from({ length: 120 }, () => {
    const size = Math.random() > 0.7 ? 3 : Math.random() > 0.5 ? 2 : 1;
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${size}px`,
      color: Math.random() > 0.5 ? '#ffffff' : '#00f5ff',
      opacity: Number((Math.random() * 0.6 + 0.3).toFixed(2)),
      twinkle: Math.random() < 0.3,
    };
  });
}

export default function UniversoPage() {
  const router = useRouter();
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Estrelas geradas apenas no cliente — evita hydration mismatch
  const stars = useMemo(() => (mounted ? createStars() : []), [mounted]);

  const handlePlanetClick = (planet: PlanetData) => {
    if (!planet.unlocked) return;
    setEnteringId(planet.id);
    setFlashActive(true);
    window.setTimeout(() => {
      router.push(`/lab?agent=${planet.id}`);
    }, 600);
    window.setTimeout(() => {
      setFlashActive(false);
    }, 620);
  };

  const getPlanetCenter = (planetId: string) => {
    const planet = planets.find((item) => item.id === planetId);
    if (!planet) return { x: 0, y: 0 };
    return {
      x: Number(planet.left.replace('%', '')),
      y: Number(planet.top.replace('%', '')),
    };
  };

  return (
    <div className="galacticMap">
      {stars.map((star, index) => (
        <span
          key={index}
          className={`star ${star.twinkle ? 'twinkle' : ''}`}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            opacity: star.opacity,
          }}
        />
      ))}

      <div className="headerLabel">NEXUS PRIME // MAPA GALÁCTICO // 12 MUNDOS DETECTADOS</div>
      <button className="backButton" type="button" onClick={() => router.push('/home')}>
        ← TORRE CENTRAL
      </button>

      <div className="planetCanvas">
        {planets.map((planet) => (
          <div
            key={planet.id}
            className={`planetWrapper ${planet.unlocked ? 'unlocked' : 'locked'}`}
            style={{ top: planet.top, left: planet.left }}
            onMouseEnter={() => setHoveredPlanet(planet.id)}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handlePlanetClick(planet)}
            role={planet.unlocked ? 'button' : 'presentation'}
            aria-label={planet.unlocked ? `Entrar no mundo de ${planet.name}` : `${planet.name} bloqueado`}
          >
            <div
              className="planetBubble"
              style={planet.unlocked ? {
                background: `radial-gradient(circle at 35% 35%, ${planet.lightColor}, ${planet.color}, #000)`,
                boxShadow: `0 0 20px ${planet.color}, 0 0 40px ${planet.color}40, 0 0 80px ${planet.color}20`,
                borderColor: planet.color,
                animationDelay: `${planet.delay}s`,
                width: '80px',
                height: '80px',
              } : {
                background: 'radial-gradient(circle, #1a1a2e, #000)',
                borderColor: 'rgba(255,255,255,0.1)',
                width: '60px',
                height: '60px',
              }}
            >
              {!planet.unlocked && <span className="lockIcon">🔒</span>}
            </div>
            <span className="planetLabel" style={planet.unlocked ? { color: planet.color, opacity: 0.9 } : undefined}>{planet.name}</span>
            {hoveredPlanet === planet.id && planet.unlocked && (
              <div className="planetTooltip" style={{ borderColor: planet.color }}>ENTRAR NO MUNDO DE {planet.name}</div>
            )}
          </div>
        ))}
      </div>

      <svg className="connectionLines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {connections.map(([from, to]) => {
          const start = getPlanetCenter(from);
          const end = getPlanetCenter(to);
          return (
            <line
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="rgba(0,245,255,0.15)"
              strokeWidth="1"
              strokeDasharray="4 8"
              className="pathLine"
            />
          );
        })}
      </svg>

      {flashActive && (
        <div className="flashOverlay" style={{ backgroundColor: enteringId ? planets.find((planet) => planet.id === enteringId)?.color ?? '#00f5ff' : '#00f5ff' }} />
      )}

      <style jsx>{`
        .galacticMap {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at center, #000510 0%, #000000 70%);
        }

        .headerLabel {
          position: absolute;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          font-family: monospace;
          font-size: 11px;
          color: #00f5ff;
          opacity: 0.6;
          z-index: 2;
          white-space: nowrap;
        }

        .backButton {
          position: absolute;
          top: 22px;
          left: 24px;
          font-family: monospace;
          font-size: 11px;
          color: #00f5ff;
          opacity: 0.6;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 2;
          transition: opacity 200ms ease;
        }

        .backButton:hover {
          opacity: 1;
        }

        .star {
          position: absolute;
          border-radius: 9999px;
        }

        .twinkle {
          animation: twinkleStar 3s ease-in-out infinite alternate;
        }

        .planetCanvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .planetWrapper {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          pointer-events: auto;
        }

        .planetWrapper.unlocked {
          cursor: pointer;
        }

        .planetWrapper.locked {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .planetBubble {
          position: relative;
          border-radius: 50%;
          border: 1px solid;
          display: grid;
          place-items: center;
          transition: transform 300ms ease, box-shadow 300ms ease;
        }

        .planetWrapper.unlocked .planetBubble {
          animation: float 6s ease-in-out infinite;
        }

        .planetWrapper.unlocked:hover .planetBubble {
          transform: scale(1.1);
          box-shadow: 0 0 28px rgba(255,255,255,0.16), 0 0 60px rgba(0,245,255,0.18);
        }

        .lockIcon {
          font-size: 16px;
          opacity: 0.4;
        }

        .planetLabel {
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.02em;
          color: #fff;
          opacity: 0.9;
          white-space: nowrap;
        }

        .planetWrapper.locked .planetLabel {
          color: #444;
          opacity: 0.6;
        }

        .planetTooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #00f5ff;
          padding: 4px 8px;
          border-radius: 9999px;
          font-family: monospace;
          font-size: 10px;
          color: #ffffff;
          white-space: nowrap;
          z-index: 3;
          opacity: 0.95;
        }

        .connectionLines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .pathLine {
          stroke-dashoffset: 0;
          animation: dashMove 3s linear infinite;
        }

        .flashOverlay {
          position: absolute;
          inset: 0;
          opacity: 0.2;
          transition: opacity 600ms ease;
          z-index: 4;
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -58%) translateY(-8px); }
          50% { transform: translate(-50%, -42%) translateY(8px); }
        }

        @keyframes twinkleStar {
          from { opacity: 0.35; transform: scale(1); }
          to { opacity: 0.95; transform: scale(1.2); }
        }

        @keyframes dashMove {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -24; }
        }
      `}</style>
    </div>
  );
}
