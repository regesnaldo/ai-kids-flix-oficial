import Link from "next/link";

/**
 * Landing page pública — porta de entrada do MENTE.AI.
 *
 * Conteúdo minimalista focado em conversão: headline, subtítulo e CTA
 * para o fluxo de cadastro. O SEO é coberto pela metadata do root layout.
 */
export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "var(--cyber-black, #0a0a1a)",
        color: "white",
        gap: "1.5rem",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          maxWidth: "20ch",
          margin: 0,
        }}
      >
        Não apenas use Inteligência Artificial. Entenda-a.
      </h1>

      <p
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "rgba(255, 255, 255, 0.7)",
          maxWidth: "55ch",
          margin: 0,
        }}
      >
        Bem-vindo ao MENTE.AI, o metaverso educacional onde você aprende IA de
        forma imersiva e interativa.
      </p>

      <Link
        href="/cadastro"
        style={{
          marginTop: "1rem",
          padding: "0.9rem 2rem",
          borderRadius: "0.75rem",
          backgroundColor: "#3B82F6",
          color: "white",
          fontWeight: 600,
          fontSize: "1.05rem",
          textDecoration: "none",
          transition: "background-color 0.2s ease",
        }}
      >
        Comece sua jornada
      </Link>
    </main>
  );
}
