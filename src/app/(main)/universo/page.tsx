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

const planets = [
  { id: 'nexus', name: 'NEXUS', color: '#00f5ff', lightColor: '#6ee7ff', unlocked: true, orbitRadius: 0, orbitSpeed: 0, size: 80, angle: 0 },
  { id: 'volt', name: 'VOLT', color: '#ffff00', lightColor: '#fff95c', unlocked: true, orbitRadius: 180, orbitSpeed: 12, size: 56, angle: 60 },
  { id: 'aurora', name: 'AURORA', color: '#ff00ff', lightColor: '#ff8bff', unlocked: true, orbitRadius: 260, orbitSpeed: 18, size: 52, angle: 210 },
  { id: 'ethos', name: 'ETHOS', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 340, orbitSpeed: 0, size: 44, angle: 0 },
  { id: 'kaos', name: 'KAOS', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 410, orbitSpeed: 0, size: 44, angle: 45 },
  { id: 'cipher', name: 'CIPHER', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 480, orbitSpeed: 0, size: 44, angle: 90 },
  { id: 'lyra', name: 'LYRA', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 550, orbitSpeed: 0, size: 44, angle: 135 },
  { id: 'axiom', name: 'AXIOM', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 610, orbitSpeed: 0, size: 44, angle: 25 },
  { id: 'stratos', name: 'STRATOS', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 670, orbitSpeed: 0, size: 42, angle: 72 },
  { id: 'terra', name: 'TERRA', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 730, orbitSpeed: 0, size: 42, angle: 160 },
  { id: 'prism', name: 'PRISM', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 790, orbitSpeed: 0, size: 42, angle: 200 },
  { id: 'janus', name: 'JANUS', color: '#666666', lightColor: '#888888', unlocked: false, orbitRadius: 850, orbitSpeed: 0, size: 42, angle: 300 },
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

  const stars = useMemo(() => (mounted ? createStars() : []), [mounted]);

  const handlePlanetClick = (planetId: string, unlocked: boolean) => {
    if (!unlocked) return;
    setEnteringId(planetId);
    setFlashActive(true);
    window.setTimeout(() => {
      router.push(`/lab?agent=${planetId}`);
    }, 600);
    window.setTimeout(() => {
      setFlashActive(false);
    }, 620);
  };

  return (
    <div className="galacticMap">
      {/* Stars background */}
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

      {/* Header */}
      <div className="headerLabel">
        NEXUS PRIME // MAPA GALÁCTICO // 12 MUNDOS DETECTADOS
      </div>

      {/* Back button */}
      <button
        className="backButton"
        type="button"
        onClick={() => router.push('/home')}
      >
        ← TORRE CENTRAL
      </button>

      {/* Solar System */}
      <div className="solarSystem">
        {/* NEXUS Sun */}
        <div className="nexusContainer" onClick={() => handlePlanetClick('nexus', true)}>
          <div className="sunCore" />
          <div className="sunGlow" />
          <span className="sunLabel">NEXUS</span>
          {hoveredPlanet === 'nexus' && (
            <div className="planetTooltip">ENTRAR NO NEXUS</div>
          )}
        </div>

        {/* Orbiting Planets (unlocked) */}
        {planets.filter(p => p.id !== 'nexus' && p.unlocked).map((planet) => (
          <div
            key={planet.id}
            className="orbitContainer"
            style={{ width: planet.orbitRadius * 2, height: planet.orbitRadius * 2 }}
          >
            {/* Dashed orbit ring */}
            <div className="orbitRing" />

            {/* Spinning planet */}
            <div
              className={planet.id === 'volt' ? 'planetSpinVolt' : 'planetSpinAurora'}
              onMouseEnter={() => setHoveredPlanet(planet.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() => handlePlanetClick(planet.id, true)}
              role="button"
              aria-label={`Entrar no mundo de ${planet.name}`}
            >
              <div
                className="planetNode"
                style={{ width: planet.size, height: planet.size }}
              >
                <div
                  className="planetSphere unlockedSphere"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${planet.lightColor}, ${planet.color}, #000)`,
                    boxShadow: `0 0 12px ${planet.color}, 0 0 24px ${planet.color}40, 0 0 48px ${planet.color}20`,
                    borderColor: planet.color,
                  }}
                />
                <span className="planetLabel" style={{ color: planet.color, opacity: 0.9 }}>{planet.name}</span>
                {hoveredPlanet === planet.id && (
                  <div className="planetTooltip">ENTRAR NO MUNDO DE {planet.name}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Locked Planets — each hardcoded to avoid template literals */}

        {/* ETHOS — orbit 680px */}
        <div className="orbitContainer" style={{ width: 680, height: 680 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(0deg)" }} onMouseEnter={() => setHoveredPlanet('ethos')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 44, height: 44 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">ETHOS</span></div>
          </div>
        </div>

        {/* KAOS — orbit 820px */}
        <div className="orbitContainer" style={{ width: 820, height: 820 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(45deg)" }} onMouseEnter={() => setHoveredPlanet('kaos')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 44, height: 44 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">KAOS</span></div>
          </div>
        </div>

        {/* CIPHER — orbit 960px */}
        <div className="orbitContainer" style={{ width: 960, height: 960 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(90deg)" }} onMouseEnter={() => setHoveredPlanet('cipher')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 44, height: 44 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">CIPHER</span></div>
          </div>
        </div>

        {/* LYRA — orbit 1100px */}
        <div className="orbitContainer" style={{ width: 1100, height: 1100 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(135deg)" }} onMouseEnter={() => setHoveredPlanet('lyra')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 44, height: 44 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">LYRA</span></div>
          </div>
        </div>

        {/* AXIOM — orbit 1220px */}
        <div className="orbitContainer" style={{ width: 1220, height: 1220 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(180deg)" }} onMouseEnter={() => setHoveredPlanet('axiom')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 44, height: 44 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">AXIOM</span></div>
          </div>
        </div>

        {/* STRATOS — orbit 1340px */}
        <div className="orbitContainer" style={{ width: 1340, height: 1340 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(225deg)" }} onMouseEnter={() => setHoveredPlanet('stratos')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 42, height: 42 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">STRATOS</span></div>
          </div>
        </div>

        {/* TERRA — orbit 1460px */}
        <div className="orbitContainer" style={{ width: 1460, height: 1460 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(270deg)" }} onMouseEnter={() => setHoveredPlanet('terra')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 42, height: 42 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">TERRA</span></div>
          </div>
        </div>

        {/* PRISM — orbit 1580px */}
        <div className="orbitContainer" style={{ width: 1580, height: 1580 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(315deg)" }} onMouseEnter={() => setHoveredPlanet('prism')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 42, height: 42 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">PRISM</span></div>
          </div>
        </div>

        {/* JANUS — orbit 1700px */}
        <div className="orbitContainer" style={{ width: 1700, height: 1700 }}>
          <div className="orbitRing lockedOrbit" />
          <div className="lockedNode" style={{ transform: "rotate(40deg)" }} onMouseEnter={() => setHoveredPlanet('janus')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="planetNodeLockedInner"><div className="planetSphere lockedSphere" style={{ width: 42, height: 42 }}><span className="lockIcon">🔒</span></div><span className="planetLabel locked">JANUS</span></div>
          </div>
        </div>
      </div>

      {/* Flash overlay on enter */}
      {flashActive && (
        <div className="flashOverlay" />
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
          z-index: 10;
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
          z-index: 10;
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

        /* Solar System Container */
        .solarSystem {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(15deg);
          width: 0;
          height: 0;
        }

        /* NEXUS Sun */
        .nexusContainer {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(-15deg);
          z-index: 5;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sunCore {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%, #6ee7ff, #00f5ff, #0088cc);
          box-shadow: 0 0 30px #00f5ff, 0 0 60px rgba(0,245,255,0.5), 0 0 100px rgba(0,245,255,0.2);
          animation: sunPulse 3s ease-in-out infinite;
        }

        .sunGlow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,245,255,0.2), transparent 70%);
          animation: sunPulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        .sunLabel {
          font-family: monospace;
          font-size: 12px;
          color: #00f5ff;
          margin-top: 8px;
          opacity: 0.9;
          white-space: nowrap;
        }

        /* Orbit Container */
        .orbitContainer {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }

        /* Dashed orbit ring */
        .orbitRing {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px dashed rgba(0, 245, 255, 0.15);
          pointer-events: none;
        }

        .lockedOrbit {
          border-color: rgba(255, 255, 255, 0.06);
        }

        /* Spinning planets (unlocked) */
        .planetSpinVolt {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          animation: spin 12s linear infinite;
          cursor: pointer;
        }

        .planetSpinAurora {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          animation: spin 18s linear infinite;
          cursor: pointer;
        }

        /* Planet node for spinning planets */
        .planetNode {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .planetSpinVolt > .planetNode {
          top: -90px;
          left: 50%;
        }

        .planetSpinAurora > .planetNode {
          top: -130px;
          left: 50%;
        }

        /* Locked planet node */
        .lockedNode {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
        }

        .lockedNode > .planetNodeLockedInner {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translate(-50%, 0);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: 0.4;
          pointer-events: auto;
        }

        .planetSphere {
          border-radius: 50%;
          border: 1px solid;
          display: grid;
          place-items: center;
          transition: transform 300ms ease, box-shadow 300ms ease;
        }

        .unlockedSphere {
          width: 56px;
          height: 56px;
        }

        .lockedSphere {
          background: radial-gradient(circle, #1a1a2e, #000);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .unlockedSphere:hover {
          transform: scale(1.15);
        }

        .lockIcon {
          font-size: 13px;
          opacity: 0.5;
        }

        .planetLabel {
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.02em;
          color: #fff;
          white-space: nowrap;
        }

        .planetLabel.locked {
          color: #444;
          opacity: 0.6;
        }

        .planetTooltip {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid #00f5ff;
          padding: 3px 8px;
          border-radius: 9999px;
          font-family: monospace;
          font-size: 9px;
          color: #ffffff;
          white-space: nowrap;
          z-index: 20;
        }

        .flashOverlay {
          position: absolute;
          inset: 0;
          background: #00f5ff;
          opacity: 0.15;
          z-index: 100;
          pointer-events: none;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes sunPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes twinkleStar {
          from { opacity: 0.35; transform: scale(1); }
          to { opacity: 0.95; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
