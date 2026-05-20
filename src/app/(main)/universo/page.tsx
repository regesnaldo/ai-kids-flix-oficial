'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlanetData {
  id: string;
  name: string;
  color: string;
  lightColor: string;
  orbitRadius: number;   // px from center
  orbitSpeed: number;    // seconds per full orbit
  size: number;          // px diameter
  unlocked: boolean;
  tiltOffset: number;    // degrees offset for starting position
}

interface StarData {
  left: string;
  top: string;
  size: string;
  opacity: number;
  twinkle: boolean;
}

// ─── Planet definitions ─────────────────────────────────────────────────────

const planets: PlanetData[] = [
  // NEXUS = sun at center
  { id: 'nexus',  name: 'NEXUS',   color: '#00f5ff', lightColor: '#6ee7ff', orbitRadius: 0,   orbitSpeed: 0,    size: 120, unlocked: true,  tiltOffset: 0 },
  // Inner unlocked planets
  { id: 'volt',   name: 'VOLT',    color: '#ffff00', lightColor: '#fff95c', orbitRadius: 180, orbitSpeed: 12,   size: 64,  unlocked: true,  tiltOffset: 0 },
  { id: 'aurora', name: 'AURORA',  color: '#ec4899', lightColor: '#ff8bff', orbitRadius: 260, orbitSpeed: 18,   size: 64,  unlocked: true,  tiltOffset: 120 },
  // Outer locked planets — progressively further
  { id: 'ethos',   name: 'ETHOS',   color: '#888888', lightColor: '#aaaaaa', orbitRadius: 350, orbitSpeed: 24,  size: 44, unlocked: false, tiltOffset: 45 },
  { id: 'kaos',    name: 'KAOS',    color: '#888888', lightColor: '#aaaaaa', orbitRadius: 400, orbitSpeed: 28,  size: 44, unlocked: false, tiltOffset: 90 },
  { id: 'cipher',  name: 'CIPHER',  color: '#888888', lightColor: '#aaaaaa', orbitRadius: 450, orbitSpeed: 32,  size: 44, unlocked: false, tiltOffset: 135 },
  { id: 'lyra',    name: 'LYRA',    color: '#888888', lightColor: '#aaaaaa', orbitRadius: 500, orbitSpeed: 36,  size: 44, unlocked: false, tiltOffset: 180 },
  { id: 'axiom',   name: 'AXIOM',   color: '#888888', lightColor: '#aaaaaa', orbitRadius: 540, orbitSpeed: 40,  size: 44, unlocked: false, tiltOffset: 225 },
  { id: 'stratos', name: 'STRATOS', color: '#888888', lightColor: '#aaaaaa', orbitRadius: 580, orbitSpeed: 44,  size: 44, unlocked: false, tiltOffset: 270 },
  { id: 'terra',   name: 'TERRA',   color: '#888888', lightColor: '#aaaaaa', orbitRadius: 620, orbitSpeed: 48,  size: 44, unlocked: false, tiltOffset: 315 },
  { id: 'prism',   name: 'PRISM',   color: '#888888', lightColor: '#aaaaaa', orbitRadius: 660, orbitSpeed: 52,  size: 44, unlocked: false, tiltOffset: 30 },
  { id: 'janus',   name: 'JANUS',   color: '#888888', lightColor: '#aaaaaa', orbitRadius: 700, orbitSpeed: 56,  size: 44, unlocked: false, tiltOffset: 60 },
];

// ─── Stars ──────────────────────────────────────────────────────────────────

function createStars(): StarData[] {
  return Array.from({ length: 150 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() > 0.7 ? 3 : Math.random() > 0.5 ? 2 : 1}px`,
    opacity: Number((Math.random() * 0.6 + 0.2).toFixed(2)),
    twinkle: Math.random() < 0.25,
  }));
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UniversoPage() {
  const router = useRouter();
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stars = useMemo(() => (mounted ? createStars() : []), [mounted]);

  const handlePlanetClick = (planet: PlanetData) => {
    if (!planet.unlocked) return;
    setEnteringId(planet.id);
    setFlashActive(true);
    window.setTimeout(() => router.push(`/lab?agent=${planet.id}`), 600);
    window.setTimeout(() => setFlashActive(false), 620);
  };

  const nexus = planets[0]; // NEXUS is always first

  return (
    <div className="galacticMap">
      {/* Stars background */}
      {stars.map((star, i) => (
        <span
          key={i}
          className={'star' + (star.twinkle ? ' twinkle' : '')}
          style={{
            left: star.left, top: star.top,
            width: star.size, height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Header */}
      <div className="headerLabel">NEXUS PRIME // SISTEMA SOLAR // 12 MUNDOS EM ÓRBITA</div>
      <button className="backButton" type="button" onClick={() => router.push('/home')}>
        ← TORRE CENTRAL
      </button>

      {/* Solar system container — centered, tilted */}
      <div className="solarSystem">
        {/* NEXUS — the sun */}
        <div className="nexusSun" onClick={() => handlePlanetClick(nexus)} role="button" aria-label="Entrar em NEXUS">
          <div className="sunCore" />
          <div className="sunGlow" />
          <span className="sunLabel">NEXUS</span>
        </div>

        {/* Orbiting planets */}
        {planets.filter(p => p.id !== 'nexus').map((planet) => {
          const oDelay = -(planet.tiltOffset / 360) * planet.orbitSpeed
          return (
            <div key={planet.id} className="orbitContainer" style={{ width: planet.orbitRadius * 2, height: planet.orbitRadius * 2 }}>
              <div className="orbitRing" style={{ width: planet.orbitRadius * 2, height: planet.orbitRadius * 2 }} />
              <div className="planetOrbit" style={{ animationDuration: planet.orbitSpeed + 's', animationDelay: oDelay + 's' }}>
                <div
                  className={'planetNode ' + (planet.unlocked ? 'unlocked' : 'locked')}
                  style={{ width: planet.size, height: planet.size, top: -(planet.size / 2) }}
                  onMouseEnter={() => setHoveredPlanet(planet.id)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                  onClick={() => handlePlanetClick(planet)}
                  role={planet.unlocked ? 'button' : 'presentation'}
                  aria-label={planet.unlocked ? 'Entrar em ' + planet.name : planet.name + ' bloqueado'}
                >
                  <div className="planetSphere" style={planet.unlocked ? {
                    background: 'radial-gradient(circle at 35% 35%, ' + planet.lightColor + ', ' + planet.color + ', #000)',
                    boxShadow: '0 0 16px ' + planet.color + ', 0 0 32px ' + planet.color + '50, 0 0 64px ' + planet.color + '20',
                    borderColor: planet.color,
                  } : {
                    background: 'radial-gradient(circle, #1a1a2e, #000)',
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}>
                    {!planet.unlocked && <span className="lockIcon">🔒</span>}
                  </div>
                  <span className="planetLabel" style={planet.unlocked ? { color: planet.color } : undefined}>{planet.name}</span>
                  {hoveredPlanet === planet.id && (
                    <div className="planetTooltip" style={{ borderColor: planet.unlocked ? planet.color : '#666' }}>
                      {planet.unlocked ? 'ENTRAR NO MUNDO DE ' + planet.name : 'Complete mais episódios para desbloquear'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

      {/* Entry flash */}
      {flashActive && (
        <div
          className="flashOverlay"
          style={{
            backgroundColor: enteringId
              ? planets.find(p => p.id === enteringId)?.color ?? '#00f5ff'
              : '#00f5ff',
          }}
        />
      )}

      <style jsx>{`
        .galacticMap {
          width: 100vw; height: 100vh;
          position: relative; overflow: hidden;
          background: radial-gradient(ellipse at center, #000510 0%, #000000 70%);
        }
        .headerLabel {
          position: absolute; top: 22px; left: 50%; transform: translateX(-50%);
          font-family: monospace; font-size: 11px; color: #00f5ff; opacity: 0.6;
          z-index: 10; white-space: nowrap;
        }
        .backButton {
          position: absolute; top: 22px; left: 24px;
          font-family: monospace; font-size: 11px; color: #00f5ff; opacity: 0.6;
          background: transparent; border: none; cursor: pointer; z-index: 10;
          transition: opacity 200ms ease;
        }
        .backButton:hover { opacity: 1; }
        .star {
          position: absolute; border-radius: 50%;
          background-color: #ffffff;
        }
        .twinkle {
          animation: twinkleStar 3s ease-in-out infinite alternate;
        }

        /* Solar system */
        .solarSystem {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateX(15deg);
          width: 0; height: 0;
          pointer-events: none;
          z-index: 5;
        }

        /* NEXUS sun */
        .nexusSun {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center;
          pointer-events: auto; cursor: pointer;
          z-index: 6;
        }
        .sunCore {
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #6ee7ff, #00f5ff, #005f6b);
          box-shadow: 0 0 30px #00f5ff, 0 0 60px #00f5ff40, 0 0 120px #00f5ff20;
          animation: sunPulse 3s ease-in-out infinite;
          border: 2px solid rgba(0,245,255,0.4);
        }
        .sunGlow {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,245,255,0.15), transparent 70%);
          animation: sunPulse 3s ease-in-out infinite;
          animation-delay: 0.5s;
          pointer-events: none;
        }
        .sunLabel {
          margin-top: 170px;
          font-family: monospace; font-size: 13px; font-weight: bold;
          color: #00f5ff; letter-spacing: 0.1em;
          pointer-events: none;
        }

        /* Orbit containers */
        .orbitContainer {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .orbitRing {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border: 1px dashed rgba(0,245,255,0.1);
          border-radius: 50%;
          pointer-events: none;
        }
        .planetOrbit {
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          animation: spin linear infinite;
          pointer-events: none;
        }
        .planetNode {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center;
          pointer-events: auto;
        }
        .planetNode.unlocked { cursor: pointer; }
        .planetNode.locked { cursor: default; opacity: 0.5; }
        .planetNode.unlocked:hover .planetSphere {
          transform: scale(1.15);
          box-shadow: 0 0 24px rgba(255,255,255,0.2), 0 0 48px rgba(0,245,255,0.25);
        }
        .planetSphere {
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 1px solid;
          display: grid; place-items: center;
          transition: transform 300ms ease, box-shadow 300ms ease;
        }
        .lockIcon {
          font-size: 14px; opacity: 0.5;
        }
        .planetLabel {
          margin-top: 6px;
          font-family: monospace; font-size: 10px; letter-spacing: 0.02em;
          color: #444;
          white-space: nowrap;
        }
        .planetNode.unlocked .planetLabel { opacity: 0.9; }
        .planetNode.locked .planetLabel { opacity: 0.5; }
        .planetTooltip {
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          background: rgba(0,0,0,0.85);
          border: 1px solid;
          padding: 4px 8px; border-radius: 9999px;
          font-family: monospace; font-size: 9px;
          color: #ffffff; white-space: nowrap; z-index: 20;
        }
        .flashOverlay {
          position: absolute; inset: 0; opacity: 0.2;
          transition: opacity 600ms ease; z-index: 50;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes twinkleStar {
          from { opacity: 0.3; transform: scale(1); }
          to { opacity: 0.9; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
