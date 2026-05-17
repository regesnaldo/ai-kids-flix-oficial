"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

const PARTICLE_COUNT = 150;
const CONNECTION_DISTANCE = 120;

function randomVelocity() {
  return (Math.random() - 0.5) * 0.6;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: randomVelocity(),
    vy: randomVelocity(),
    size: Math.random() * 1.6 + 0.6,
    alpha: Math.random() * 0.4 + 0.4,
    color: Math.random() > 0.5 ? "0,245,255" : "123,47,255",
  };
}

export default function NexusEntry() {
  const router = useRouter();
  const { play, pause, isPlaying } = useAmbientAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cyanSpotlightRef = useRef<HTMLDivElement>(null);
  const purpleSpotlightRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState(false);
  const [portalPhase, setPortalPhase] = useState<'idle' | 'zoom' | 'blackout'>('idle');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(width, height));
      }
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!prefersReducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = 0.22 * (1 - distance / CONNECTION_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,245,255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const spawnParticles = useCallback(() => {
    try {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        const angle = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist = 80 + Math.random() * 120;
        p.style.cssText = `
          position: fixed; left: ${cx}px; top: ${cy}px;
          width: 4px; height: 4px; background: #00f5ff;
          border-radius: 50%; pointer-events: none; z-index: 99999;
          transition: all 400ms cubic-bezier(0.16,1,0.3,1);
          transform: translate(-2px, -2px);
        `;
        document.body.appendChild(p);
        requestAnimationFrame(() => {
          p.style.left = `${cx + Math.cos(angle) * dist}px`;
          p.style.top = `${cy + Math.sin(angle) * dist}px`;
          p.style.opacity = '0';
          p.style.transform = 'translate(-2px, -2px) scale(0)';
        });
        setTimeout(() => p.remove(), 500);
      }
    } catch { /* particles not available */ }
  }, []);

  const playPortalSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.3, now + 0.3);
      masterGain.gain.setValueAtTime(0.3, now + 1.0);
      masterGain.gain.linearRampToValueAtTime(0.001, now + 1.4);
      masterGain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 80;
      osc1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 1.4);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 160;
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.4);
      gain2.gain.setValueAtTime(0.2, now + 1.0);
      gain2.gain.linearRampToValueAtTime(0.001, now + 1.4);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.4);
      osc2.stop(now + 1.4);
    } catch { /* audio not available */ }
  }, []);

  const handleEnter = useCallback(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      router.push('/lab');
      return;
    }
    setEntering(true);
    setPortalPhase('zoom');
    spawnParticles();

    const el = portalRef.current;
    if (!el) {
      const fallback = setTimeout(() => router.push('/lab'), 800);
      return () => clearTimeout(fallback);
    }

    const fallback = setTimeout(() => router.push('/lab'), 1400);
    let navigated = false;

    const onEnd = (e: TransitionEvent) => {
      if (navigated) return;
      if (e.propertyName === 'transform') {
        setPortalPhase('blackout');
        playPortalSound();
      }
      if (e.propertyName === 'background-color' && !navigated) {
        navigated = true;
        clearTimeout(fallback);
        router.push('/lab');
      }
    };

    el.addEventListener('transitionend', onEnd);
  }, [router, playPortalSound]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let frameId = 0;

    const animateSpotlights = (time: number) => {
      const cyan = cyanSpotlightRef.current;
      const purple = purpleSpotlightRef.current;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      if (cyan) {
        const angle = (time / 1000 / 45) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * 260;
        const y = centerY + Math.sin(angle) * 180;
        cyan.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
      }

      if (purple) {
        const angle = (time / 1000 / 60) * Math.PI * -2;
        const x = centerX + Math.cos(angle) * 320;
        const y = centerY + Math.sin(angle) * 220;
        purple.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      }

      frameId = requestAnimationFrame(animateSpotlights);
    };

    frameId = requestAnimationFrame(animateSpotlights);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      pause();
      return;
    }

    play();
  };

  return (
    <section className={`nexusEntry${entering ? ' portalActive' : ''}`} aria-label="Entrada cinematográfica do universo NEXUS">
      <canvas ref={canvasRef} className="nexusCanvas" aria-hidden="true" />
      <div className="nexusFog" />
      <div ref={cyanSpotlightRef} className="spotlight spotlightCyan" />
      <div ref={purpleSpotlightRef} className="spotlight spotlightPurple" />

      <div className="nexusPresence" aria-hidden="true">
        <div className="nexusOrb">
          <div className="nexusRing" />
          <div className="nexusCore" />
        </div>
        <div className="nexusName">NEXUS</div>
        <div className="nexusStatus">consciência ativa</div>
      </div>

      <div className="nexusCopy">
        <p>Bem-vindo à mente que aprende.</p>
        <button type="button" onClick={handleEnter} disabled={entering}>
          {entering ? 'Abrindo portal...' : 'Entrar no universo'}
        </button>
      </div>

      <button
        type="button"
        className="audioToggle"
        onClick={toggleAudio}
        aria-label={isPlaying ? "Desativar áudio ambiente" : "Ativar áudio ambiente"}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {entering && (
        <div className="portalText">
          <p className="portalTextTitle">
            NEXUS PRIME // TELETRANSPORTE INICIADO
          </p>
          <p className="portalTextSub">
            SINCRONIZANDO MUNDO DO AGENTE...
          </p>
        </div>
      )}

      <div
        ref={portalRef}
        className={`portalOverlay${portalPhase === 'zoom' ? ' zoom' : ''}${portalPhase === 'blackout' ? ' blackout' : ''}`}
        aria-hidden="true"
      />

      <style jsx>{`
        .nexusEntry {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000000;
          color: #e8e8ff;
          margin-left: calc(50% - 50vw);
        }

        .nexusEntry.portalActive {
          pointer-events: none;
        }

        .nexusEntry.portalActive .nexusCanvas {
          opacity: 0;
          transition: opacity 800ms ease;
        }

        .nexusEntry.portalActive .nexusFog,
        .nexusEntry.portalActive .spotlight,
        .nexusEntry.portalActive .nexusPresence,
        .nexusEntry.portalActive .nexusCopy {
          opacity: 0;
          transition: opacity 400ms ease;
        }

        .portalText {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 99999;
          text-align: center;
          pointer-events: none;
          animation: portalTextIn 200ms ease forwards, portalTextOut 300ms ease 1000ms forwards;
        }

        .portalTextTitle {
          font-family: monospace;
          font-size: 11px;
          color: #00f5ff;
          opacity: 0.7;
          margin: 0 0 8px;
        }

        .portalTextSub {
          font-family: monospace;
          font-size: 9px;
          color: #ffffff;
          opacity: 0.4;
          margin: 0;
        }

        @keyframes portalTextIn {
          from { opacity: 0; transform: translate(-50%, -50%) translateY(10px); }
          to { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
        }
        @keyframes portalTextOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .portalOverlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          pointer-events: none;
          transform: scale(0);
          border-radius: 50%;
          will-change: transform, background;
        }

        .portalOverlay.zoom {
          transform: scale(50);
          transition: transform 800ms cubic-bezier(0.16,1,0.3,1);
          background: #00f5ff;
        }

        .portalOverlay.blackout {
          transform: scale(50);
          background: #000000;
          transition: background 400ms ease;
        }

        .nexusCanvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          animation: particlesAwaken 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: opacity 800ms ease;
        }

        .nexusFog {
          position: absolute;
          inset: -15%;
          z-index: 2;
          background:
            radial-gradient(circle at center, rgba(0, 245, 255, 0.03) 0%, transparent 34%),
            radial-gradient(circle at center, rgba(123, 47, 255, 0.04) 0%, transparent 48%);
          pointer-events: none;
        }

        .spotlight {
          position: absolute;
          z-index: 3;
          border-radius: 999px;
          pointer-events: none;
          mix-blend-mode: screen;
          filter: blur(12px);
          will-change: transform;
        }

        .spotlightCyan {
          width: 300px;
          height: 300px;
          opacity: 0.06;
          background: radial-gradient(circle, rgba(0, 245, 255, 1) 0%, transparent 68%);
        }

        .spotlightPurple {
          width: 400px;
          height: 400px;
          opacity: 0.04;
          background: radial-gradient(circle, rgba(123, 47, 255, 1) 0%, transparent 70%);
        }

        .nexusPresence {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
          animation: nexusAppear 1.5s cubic-bezier(0.16, 1, 0.3, 1) 2s forwards;
        }

        .nexusOrb {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          filter:
            drop-shadow(0 0 20px rgba(0, 245, 255, 0.9))
            drop-shadow(0 0 40px rgba(123, 47, 255, 0.72));
          animation: corePulse 4s ease-in-out infinite;
        }

        .nexusCore {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 38% 32%, rgba(232, 232, 255, 0.95), transparent 18%),
            radial-gradient(circle, rgba(0, 245, 255, 0.8) 0%, rgba(0, 245, 255, 0.12) 44%, rgba(123, 47, 255, 0.04) 72%);
          box-shadow:
            0 0 20px rgba(0, 245, 255, 0.9),
            0 0 40px rgba(123, 47, 255, 0.75),
            inset 0 0 24px rgba(255, 255, 255, 0.12);
        }

        .nexusRing {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: conic-gradient(from 0deg, transparent 0deg 42deg, rgba(0, 245, 255, 0.95) 48deg 172deg, transparent 182deg 228deg, rgba(123, 47, 255, 0.9) 236deg 344deg, transparent 352deg 360deg);
          mask: radial-gradient(circle, transparent 56px, #000 57px, #000 60px, transparent 61px);
          animation: ringRotate 20s linear infinite, ringGap 6s ease-in-out infinite;
        }

        .nexusName {
          margin-top: 22px;
          color: #00f5ff;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 0.4em;
          padding-left: 0.4em;
        }

        .nexusStatus {
          margin-top: 10px;
          font-size: 9px;
          line-height: 1;
          color: rgba(232, 232, 255, 0.5);
          opacity: 0;
          animation: statusFade 1.2s ease 2s forwards;
        }

        .nexusCopy {
          position: absolute;
          left: 50%;
          bottom: 12vh;
          z-index: 6;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateX(-50%);
          text-align: center;
        }

        .nexusCopy p {
          margin: 0 0 24px;
          color: #e8e8ff;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.5;
          opacity: 0;
          animation: copyFade 1.4s ease 4s forwards;
        }

        .nexusCopy button {
          padding: 12px 32px;
          border: 1px solid #00f5ff;
          border-radius: 2px;
          background: transparent;
          color: #00f5ff;
          font-size: 12px;
          font-weight: 500;
          font-family: monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0;
          transition: background 150ms ease, color 150ms ease;
          animation: buttonFade 1.2s ease 5.5s forwards;
        }

        .nexusCopy button:hover {
          background: #00f5ff;
          color: #000000;
        }

        .audioToggle {
          position: absolute;
          right: 28px;
          bottom: 28px;
          z-index: 8;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(0, 245, 255, 0.2);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.28);
          color: rgba(232, 232, 255, 0.72);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }

        .audioToggle:hover {
          border-color: rgba(0, 245, 255, 0.55);
          background: rgba(0, 245, 255, 0.08);
          color: #00f5ff;
        }

        @keyframes particlesAwaken {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes nexusAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes corePulse {
          0%, 100% { transform: scale(0.98); }
          50% { transform: scale(1.04); }
        }

        @keyframes ringRotate {
          to { transform: rotate(360deg); }
        }

        @keyframes ringGap {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(18deg) brightness(1.18); }
        }

        @keyframes statusFade {
          to { opacity: 1; }
        }

        @keyframes copyFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .nexusOrb {
            width: 104px;
            height: 104px;
          }

          .nexusRing {
            mask: radial-gradient(circle, transparent 48px, #000 49px, #000 52px, transparent 53px);
          }

          .nexusCore {
            width: 62px;
            height: 62px;
          }

          .nexusCopy {
            width: calc(100vw - 48px);
            bottom: 10vh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nexusCanvas,
          .nexusPresence,
          .nexusOrb,
          .nexusRing,
          .nexusStatus,
          .nexusCopy p,
          .nexusCopy button {
            animation: none;
          }

          .nexusCanvas,
          .nexusPresence,
          .nexusStatus,
          .nexusCopy p,
          .nexusCopy button {
            opacity: 1;
          }

          .nexusPresence {
            transform: translate(-50%, -50%) scale(1);
          }

          .spotlightCyan {
            transform: translate(calc(50vw + 110px), calc(50vh - 150px));
          }

          .spotlightPurple {
            transform: translate(calc(50vw - 520px), calc(50vh - 200px));
          }

          .nexusCopy p,
          .nexusCopy button {
            transform: none;
          }

          .portalOverlay,
          .portalText {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
