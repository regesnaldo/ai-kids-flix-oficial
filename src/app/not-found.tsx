import Link from "next/link";

/**
 * not-found.tsx — Página 404 do MENTE.AI
 *
 * Captura navegação para rotas inexistentes no App Router.
 * NÃO inclui <html>/<body> — o root layout fornece isso.
 * Somente global-error.tsx precisa de <html>/<body> próprios.
 */

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a1a",
        color: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520, padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "2rem", fontWeight: 900 }}>
            <span style={{ color: "#ffffff" }}>MENTE</span>
            <span style={{ color: "#E50914" }}>.AI</span>
          </span>
        </div>

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
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌌</div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#00f0ff",
              margin: "0 0 0.75rem 0",
              textShadow: "0 0 12px rgba(0, 240, 255, 0.3)",
            }}
          >
            Universo Não Encontrado
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.6,
              margin: "0 0 1.5rem 0",
            }}
          >
            Esta coordenada não existe no metaverso. O Nexus Prime não
            conseguiu localizar a rota solicitada.
          </p>

          <Link
            href="/home"
            style={{
              display: "inline-block",
              background:
                "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(168,85,247,0.2))",
              border: "1px solid rgba(0, 240, 255, 0.4)",
              color: "#ffffff",
              padding: "0.75rem 2rem",
              borderRadius: 10,
              fontSize: "0.95rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Voltar ao Nexus
          </Link>
        </div>
      </div>
    </div>
  );
}
