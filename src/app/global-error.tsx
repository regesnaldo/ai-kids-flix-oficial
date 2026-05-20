"use client";

/**
 * global-error.tsx — Última barreira de contenção de erros.
 *
 * Captura falhas no layout RAIZ (src/app/layout.tsx).
 * Como o layout raiz é quem define <html>/<body>, este componente
 * PRECISA fornecer suas próprias tags <html> e <body>.
 *
 * Next.js App Router: este é o fallback máximo. Se este componente
 * também quebrar, o usuário vê tela branca do navegador.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#0a0a1a",
          color: "#ffffff",
          fontFamily:
            "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 520,
            padding: "2rem",
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: "2rem", fontWeight: 900 }}>
              <span style={{ color: "#ffffff" }}>MENTE</span>
              <span style={{ color: "#E50914" }}>.AI</span>
            </span>
          </div>

          {/* Glass card */}
          <div
            style={{
              background: "rgba(20, 20, 50, 0.6)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "2.5rem 2rem",
            }}
          >
            {/* Glitch icon */}
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.5))",
              }}
            >
              ⚡
            </div>

            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#00f0ff",
                margin: "0 0 0.75rem 0",
                textShadow: "0 0 12px rgba(0, 240, 255, 0.3)",
              }}
            >
              Falha Crítica no Sistema
            </h1>

            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: 1.6,
                margin: "0 0 0.5rem 0",
              }}
            >
              O núcleo do MENTE.AI encontrou uma instabilidade inesperada.
              Nossos agentes já estão trabalhando para restaurar a conexão.
            </p>

            {/* Error digest for debugging */}
            {error.digest && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.25)",
                  fontFamily: "'JetBrains Mono', monospace",
                  margin: "0 0 1.5rem 0",
                  wordBreak: "break-all",
                }}
              >
                Ref: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={reset}
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,240,255,0.15))",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                color: "#ffffff",
                padding: "0.75rem 2rem",
                borderRadius: 10,
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(168,85,247,0.5), rgba(0,240,255,0.25))";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(168, 85, 247, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,240,255,0.15))";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Reconectar ao NEXUS
            </button>

            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(255, 255, 255, 0.3)",
                marginTop: "1.25rem",
              }}
            >
              Se o problema persistir, recarregue a página ou tente novamente em
              instantes.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
