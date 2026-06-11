"use client";

import Link from "next/link";

interface CosmicHeroProps {
  isNewUser: boolean;
  episodeLeft?: { episodeNumber: number; title: string; accentColor: string };
  episodeRight?: { episodeNumber: number; title: string; accentColor: string };
}

export function CosmicHero({
  isNewUser,
  episodeLeft = { episodeNumber: 1, title: "A ORIGEM DA IA", accentColor: "cyan" },
  episodeRight = { episodeNumber: 5, title: "REDES NEURAIS", accentColor: "magenta" },
}: CosmicHeroProps) {
  return (
    <section
      style={{
        minHeight: "700px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background image */}
      <img
        src="/images/storyboard/landing-hero.jpg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(1.2) brightness(0.6)",
        }}
        className="animate-galaxy-spin"
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent, rgba(10,10,15,0.9))",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 2rem" }}>
        <h1
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 900,
            color: "#3DC0C0",
            letterSpacing: "-0.03em",
            margin: 0,
            textShadow: "0 0 40px rgba(61,192,192,0.4)",
          }}
        >
          MENTE.AI
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "1rem", fontSize: "1.1rem", fontFamily: "system-ui, sans-serif" }}>
          O metaverso educacional de inteligencia artificial
        </p>

        {/* CTA button */}
        <Link
          href="/universo/nexus"
          style={{
            display: "inline-flex",
            marginTop: "2rem",
            padding: "1rem 3rem",
            background: "#3DC0C0",
            color: "#0a0a1a",
            fontFamily: "monospace",
            fontSize: "1.125rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "3px solid #0a0a1a",
            boxShadow: "6px 6px 0 0 #000",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "8px 8px 0 0 #000";
            e.currentTarget.style.transform = "translate(-2px, -2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "6px 6px 0 0 #000";
            e.currentTarget.style.transform = "translate(0, 0)";
          }}
        >
          Comecar minha jornada
        </Link>
      </div>

      {/* Floating episode cards (desktop only) */}
      <div className="hidden md:block">
        {/* Left card */}
        <div
          style={{
            position: "absolute",
            left: "3rem",
            top: "50%",
            transform: "translateY(-50%) rotate(-3deg)",
            width: "200px",
            aspectRatio: "4/5",
            border: "2px solid rgba(0,255,255,0.3)",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 0 20px rgba(0,255,255,0.15)",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "3rem", fontWeight: 900, color: "rgba(0,255,255,0.3)" }}>
            {String(episodeLeft.episodeNumber).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "rgba(0,255,255,0.8)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {episodeLeft.title}
          </span>
        </div>

        {/* Right card */}
        <div
          style={{
            position: "absolute",
            right: "3rem",
            top: "50%",
            transform: "translateY(-50%) rotate(3deg)",
            width: "200px",
            aspectRatio: "4/5",
            border: "2px solid rgba(168,85,247,0.3)",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 0 20px rgba(168,85,247,0.15)",
          }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "3rem", fontWeight: 900, color: "rgba(168,85,247,0.3)" }}>
            {String(episodeRight.episodeNumber).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "rgba(168,85,247,0.8)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {episodeRight.title}
          </span>
        </div>
      </div>
    </section>
  );
}
