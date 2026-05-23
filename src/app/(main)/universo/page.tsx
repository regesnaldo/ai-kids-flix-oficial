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
    window.setTimeout(() => { router.push(`/lab?agent=${planetId}`); }, 600);
    window.setTimeout(() => { setFlashActive(false); }, 620);
  };

  return (
    <div className="galacticMap">
      {/* Stars */}
      {stars.map((star, index) => (
        <span key={index} className={`star ${star.twinkle ? 'twinkle' : ''}`}
          style={{ left: star.left, top: star.top, width: star.size, height: star.size, backgroundColor: star.color, opacity: star.opacity }} />
      ))}

      <div className="headerLabel">NEXUS PRIME // MAPA GALÁCTICO // 12 MUNDOS DETECTADOS</div>
      <button className="backButton" type="button" onClick={() => router.push('/home')}>← TORRE CENTRAL</button>

      {/* === SOLAR SYSTEM — flat, no tilt === */}
      <div className="solarSystem">

        {/* ── NEXUS Sun ── */}
        <div className="nexusSun" onClick={() => handlePlanetClick('nexus', true)}
          onMouseEnter={() => setHoveredPlanet('nexus')} onMouseLeave={() => setHoveredPlanet(null)}>
          <div className="sunCore" />
          <div className="sunGlow" />
          <span className="sunLabel">NEXUS</span>
          {hoveredPlanet === 'nexus' && <div className="planetTooltip">ENTRAR NO NEXUS</div>}
        </div>

        {/* ── VOLT orbit (360px) ── */}
        <div className="orbitContainer" style={{ width: 360, height: 360 }}>
          <div className="orbitRing" />
          <div className="planetSpin" style={{ animationDuration: '12s' }}
            onMouseEnter={() => setHoveredPlanet('volt')} onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handlePlanetClick('volt', true)}>
            <div className="planetAnchor" style={{ marginTop: -180 }}>
              <div className="planetCircle" style={{ background: 'radial-gradient(circle at 35% 35%, #fff95c, #ffff00, #000)', boxShadow: '0 0 12px #ffff00, 0 0 24px #ffff0040', borderColor: '#ffff00' }} />
              <span className="planetName" style={{ color: '#ffff00' }}>VOLT</span>
              {hoveredPlanet === 'volt' && <div className="planetTooltip">ENTRAR NO MUNDO DE VOLT</div>}
            </div>
          </div>
        </div>

        {/* ── AURORA orbit (520px) ── */}
        <div className="orbitContainer" style={{ width: 520, height: 520 }}>
          <div className="orbitRing" />
          <div className="planetSpin" style={{ animationDuration: '18s' }}
            onMouseEnter={() => setHoveredPlanet('aurora')} onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => handlePlanetClick('aurora', true)}>
            <div className="planetAnchor" style={{ marginTop: -260 }}>
              <div className="planetCircle" style={{ background: 'radial-gradient(circle at 35% 35%, #ff8bff, #ff00ff, #000)', boxShadow: '0 0 12px #ff00ff, 0 0 24px #ff00ff40', borderColor: '#ff00ff' }} />
              <span className="planetName" style={{ color: '#ff00ff' }}>AURORA</span>
              {hoveredPlanet === 'aurora' && <div className="planetTooltip">ENTRAR NO MUNDO DE AURORA</div>}
            </div>
          </div>
        </div>

        {/* ── ETHOS (locked) — 680px ── */}
        <div className="orbitContainer" style={{ width: 680, height: 680 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(0deg)' }}
            onMouseEnter={() => setHoveredPlanet('ethos')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">ETHOS</span>
            </div>
          </div>
        </div>

        {/* ── KAOS (locked) — 820px ── */}
        <div className="orbitContainer" style={{ width: 820, height: 820 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(45deg)' }}
            onMouseEnter={() => setHoveredPlanet('kaos')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">KAOS</span>
            </div>
          </div>
        </div>

        {/* ── CIPHER (locked) — 960px ── */}
        <div className="orbitContainer" style={{ width: 960, height: 960 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(90deg)' }}
            onMouseEnter={() => setHoveredPlanet('cipher')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">CIPHER</span>
            </div>
          </div>
        </div>

        {/* ── LYRA (locked) — 1100px ── */}
        <div className="orbitContainer" style={{ width: 1100, height: 1100 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(135deg)' }}
            onMouseEnter={() => setHoveredPlanet('lyra')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">LYRA</span>
            </div>
          </div>
        </div>

        {/* ── AXIOM (locked) — 1220px ── */}
        <div className="orbitContainer" style={{ width: 1220, height: 1220 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(180deg)' }}
            onMouseEnter={() => setHoveredPlanet('axiom')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">AXIOM</span>
            </div>
          </div>
        </div>

        {/* ── STRATOS (locked) — 1340px ── */}
        <div className="orbitContainer" style={{ width: 1340, height: 1340 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(225deg)' }}
            onMouseEnter={() => setHoveredPlanet('stratos')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">STRATOS</span>
            </div>
          </div>
        </div>

        {/* ── TERRA (locked) — 1460px ── */}
        <div className="orbitContainer" style={{ width: 1460, height: 1460 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(270deg)' }}
            onMouseEnter={() => setHoveredPlanet('terra')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">TERRA</span>
            </div>
          </div>
        </div>

        {/* ── PRISM (locked) — 1580px ── */}
        <div className="orbitContainer" style={{ width: 1580, height: 1580 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(315deg)' }}
            onMouseEnter={() => setHoveredPlanet('prism')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">PRISM</span>
            </div>
          </div>
        </div>

        {/* ── JANUS (locked) — 1700px ── */}
        <div className="orbitContainer" style={{ width: 1700, height: 1700 }}>
          <div className="orbitRing lockedRing" />
          <div className="lockedNode" style={{ transform: 'rotate(40deg)' }}
            onMouseEnter={() => setHoveredPlanet('janus')} onMouseLeave={() => setHoveredPlanet(null)}>
            <div className="lockedInner">
              <div className="planetCircle lockedCircle"><span className="lockIcon">🔒</span></div>
              <span className="planetName lockedName">JANUS</span>
            </div>
          </div>
        </div>

      </div>

      {flashActive && <div className="flashOverlay" />}

      <style jsx>{`
        .galacticMap {
          width: 100vw; height: 100vh; position: relative; overflow: hidden;
          background: radial-gradient(ellipse at center, #000510 0%, #000000 70%);
        }
        .headerLabel { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); font-family: monospace; font-size: 11px; color: #00f5ff; opacity: 0.6; z-index: 10; white-space: nowrap; }
        .backButton { position: absolute; top: 22px; left: 24px; font-family: monospace; font-size: 11px; color: #00f5ff; opacity: 0.6; background: transparent; border: none; cursor: pointer; z-index: 10; }
        .backButton:hover { opacity: 1; }
        .star { position: absolute; border-radius: 9999px; }
        .twinkle { animation: twinkleStar 3s ease-in-out infinite alternate; }
        .flashOverlay { position: absolute; inset: 0; background: #00f5ff; opacity: 0.15; z-index: 100; pointer-events: none; }

        /* === Solar System === */
        .solarSystem { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; }

        /* NEXUS Sun — centered, no tilt */
        .nexusSun { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 5; cursor: pointer; display: flex; flex-direction: column; align-items: center; }
        .sunCore { width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle at 40% 40%, #6ee7ff, #00f5ff, #0088cc); box-shadow: 0 0 30px #00f5ff, 0 0 60px rgba(0,245,255,0.5), 0 0 100px rgba(0,245,255,0.2); animation: sunPulse 3s ease-in-out infinite; }
        .sunGlow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(0,245,255,0.2), transparent 70%); animation: sunPulse 3s ease-in-out infinite; pointer-events: none; }
        .sunLabel { font-family: monospace; font-size: 14px; font-weight: 700; color: #fff; margin-top: 8px; text-shadow: 0 0 8px rgba(0,245,255,0.6); }

        /* Orbit */
        .orbitContainer { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; }
        .orbitRing { position: absolute; inset: 0; border-radius: 50%; border: 1px dashed rgba(0,245,255,0.15); pointer-events: none; }
        .lockedRing { border-color: rgba(255,255,255,0.06); }

        /* Spinning planet */
        .planetSpin { position: absolute; inset: 0; border-radius: 50%; animation: spin linear infinite; cursor: pointer; }
        .planetAnchor { position: absolute; top: 50%; left: 50%; transform: translate(-50%, 0); display: flex; flex-direction: column; align-items: center; gap: 4px; }

        /* Planet circle */
        .planetCircle { width: 52px; height: 52px; border-radius: 50%; border: 1px solid; display: grid; place-items: center; transition: transform 300ms ease; }
        .planetCircle:hover { transform: scale(1.15); }
        .lockedCircle { width: 44px; height: 44px; background: radial-gradient(circle, #1a1a2e, #000); border-color: rgba(255,255,255,0.08); }
        .lockIcon { font-size: 14px; opacity: 0.5; }

        /* Planet name */
        .planetName { font-family: monospace; font-size: 14px; font-weight: 600; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.8); white-space: nowrap; letter-spacing: 0.04em; }
        .lockedName { color: #666; text-shadow: none; }

        /* Locked planet node */
        .lockedNode { position: absolute; top: 50%; left: 50%; width: 0; height: 0; }
        .lockedInner { position: absolute; top: -50%; left: 50%; transform: translate(-50%, 0); display: flex; flex-direction: column; align-items: center; gap: 3px; opacity: 0.4; pointer-events: auto; }

        /* Tooltip */
        .planetTooltip { position: absolute; top: -32px; left: 50%; transform: translateX(-50%); pointer-events: none; background: rgba(0,0,0,0.85); border: 1px solid #00f5ff; padding: 3px 8px; border-radius: 9999px; font-family: monospace; font-size: 10px; color: #fff; white-space: nowrap; z-index: 20; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sunPulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.05); } }
        @keyframes twinkleStar { from { opacity: 0.35; transform: scale(1); } to { opacity: 0.95; transform: scale(1.2); } }
      `}</style>
    </div>
  );
}
