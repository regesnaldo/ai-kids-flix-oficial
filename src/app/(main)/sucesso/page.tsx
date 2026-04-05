"use client";

export default function Sucesso() {
  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🎉</div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", marginBottom: "1rem" }}>
          Assinatura <span style={{ color: "#10B981" }}>confirmada!</span>
        </h1>
        <p style={{ color: "#00d4ff", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Bem-vindo ao MENTE.AI! Sua jornada de aprendizado começa agora.
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", marginBottom: "2.5rem" }}>
          Onde mentes são formadas, não formatadas...!
        </p>
        <button
          onClick={() => window.location.href = "/player"}
          style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", fontWeight: 700, borderRadius: "8px", border: "none", backgroundColor: "#E50914", color: "#ffffff", cursor: "pointer" }}>
          Começar a Pensar →
        </button>
      </div>
    </main>
  );
}