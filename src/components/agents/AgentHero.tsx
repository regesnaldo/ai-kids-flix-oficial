"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { agentsShowcase } from "@/data/agents-showcase";
import AgentCard from "./AgentCard";

const AUTOPLAY_MS = 8000;

const leftVariants = {
  enter: { opacity: 0, x: -32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 32 },
};

const rightVariants = {
  enter: { opacity: 0, x: 32, scale: 0.95 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -32, scale: 0.95 },
};

const transition = { duration: 0.4, ease: "easeOut" as const };

export default function AgentHero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const agent = agentsShowcase[idx];
  const total = agentsShowcase.length;

  const goTo = useCallback(
    (i: number) => {
      setIdx(i);
      setShowInfo(false);
    },
    []
  );

  const goNext = useCallback(
    () => goTo((idx + 1) % total),
    [idx, total, goTo]
  );

  const goPrev = useCallback(
    () => goTo((idx - 1 + total) % total),
    [idx, total, goTo]
  );

  // Auto-play
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goNext, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx, paused, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <>
      <style>{`
        .ah-root {
          min-height: calc(100vh - 70px);
          background-color: #0a0a0f;
          position: relative;
          overflow: hidden;
        }
        .ah-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
        }
        .ah-grid {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 4rem;
          width: 100%;
          align-items: center;
        }
        .ah-left {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .ah-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ah-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #ffffff;
          color: #000000;
          font-weight: 700;
          font-size: 16px;
          padding: 14px 32px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .ah-btn-primary:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
        .ah-btn-primary:active {
          transform: scale(0.98);
        }
        .ah-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: transparent;
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          padding: 14px 32px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .ah-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.55);
          transform: scale(1.02);
        }
        .ah-btn-secondary:active {
          transform: scale(0.98);
        }
        .ah-dot {
          border: none;
          cursor: pointer;
          padding: 0;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background-color 0.3s, width 0.3s, height 0.3s, transform 0.15s;
        }
        .ah-dot:hover {
          transform: scale(1.5);
        }
        .ah-card-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .ah-counter {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          color: rgba(255, 255, 255, 0.35);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .ah-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .ah-inner {
            padding: 1.25rem 1rem 5rem;
            align-items: flex-start;
          }
          .ah-card-col {
            order: -1;
          }
          .ah-buttons {
            flex-direction: column;
          }
          .ah-btn-primary,
          .ah-btn-secondary {
            justify-content: center;
            width: 100%;
          }
          .ah-counter {
            bottom: 1rem;
            right: 1rem;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .ah-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .ah-inner {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div
        className="ah-root"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ambient background glow — changes per agent */}
        <AnimatePresence>
          <motion.div
            key={`glow-${agent.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 65% 65% at 78% 50%, ${agent.themeGlow}18 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
        </AnimatePresence>

        {/* Subtle noise texture vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }}
        />

        <div className="ah-inner">
          <div className="ah-grid">
            {/* ── LEFT COLUMN ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${agent.id}`}
                className="ah-left"
                variants={leftVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                {/* Category badge */}
                <div>
                  <span
                    style={{
                      backgroundColor: agent.categoryColor,
                      color: "#fff",
                      textTransform: "uppercase",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      letterSpacing: "0.1em",
                      display: "inline-block",
                    }}
                  >
                    {agent.category}
                  </span>
                </div>

                {/* Subtitle */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "20px",
                    fontWeight: 500,
                    margin: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  {agent.subtitle}
                </p>

                {/* Name — hero headline */}
                <h1
                  style={{
                    fontSize: "clamp(48px, 6vw, 72px)",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-1px",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {agent.name}
                </h1>

                {/* Description */}
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "18px",
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: "480px",
                  }}
                >
                  {agent.description}
                </p>

                {/* Expandable info panel */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          borderLeft: `3px solid ${agent.categoryColor}`,
                          paddingLeft: "16px",
                          color: "rgba(255,255,255,0.65)",
                          fontSize: "15px",
                          lineHeight: 1.65,
                        }}
                      >
                        <strong style={{ color: "#fff" }}>{agent.name}</strong>{" "}
                        é especializado em{" "}
                        {agent.category.toLowerCase()}. Cada interação é
                        projetada para maximizar seu potencial com insights
                        únicos e perspectivas que transformam a maneira como
                        você enfrenta desafios complexos.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="ah-buttons">
                  <Link
                    href={`/agentes/${agent.id}`}
                    className="ah-btn-primary"
                    aria-label={`Iniciar conversa com ${agent.name}`}
                  >
                    <svg
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M0 0l12 7-12 7V0z" />
                    </svg>
                    Iniciar
                  </Link>

                  <button
                    type="button"
                    className="ah-btn-secondary"
                    onClick={() => setShowInfo((v) => !v)}
                    aria-label={`${showInfo ? "Ocultar" : "Ver"} mais informações sobre ${agent.name}`}
                    aria-expanded={showInfo}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {showInfo ? "Ocultar Info" : "Mais Informações"}
                  </button>
                </div>

                {/* Dots navigation */}
                <div
                  role="tablist"
                  aria-label="Navegar entre agentes"
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {agentsShowcase.map((a, i) => (
                    <button
                      key={a.id}
                      type="button"
                      role="tab"
                      aria-selected={i === idx}
                      aria-label={`Agente ${a.name}`}
                      onClick={() => goTo(i)}
                      className="ah-dot"
                      style={{
                        width: i === idx ? "10px" : "8px",
                        height: i === idx ? "10px" : "8px",
                        backgroundColor:
                          i === idx
                            ? "#ffffff"
                            : "rgba(255,255,255,0.28)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── RIGHT COLUMN — Agent Card ── */}
            <div className="ah-card-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${agent.id}`}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  style={{ width: "100%", maxWidth: "360px" }}
                >
                  <AgentCard agent={agent} priority />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Agent counter — bottom right */}
        <div className="ah-counter" aria-hidden="true">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>
    </>
  );
}
