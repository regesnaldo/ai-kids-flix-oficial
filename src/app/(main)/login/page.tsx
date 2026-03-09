 "use client";
import { useState } from "react";

export default function Login() {
  const [tab, setTab] = useState<"entrar" | "cadastrar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit() {
    setErro("");
    setSucesso("");

    if (tab === "cadastrar" && senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const url = tab === "entrar" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "entrar" ? { email, senha } : { nome, email, senha };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao processar.");
      } else {
        setSucesso(tab === "entrar" ? "Login realizado!" : "Cadastro realizado!");
        setTimeout(() => { window.location.href = "/home"; }, 1000);
      }
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const input = {
    width: "100%", padding: "0.85rem 1rem", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.05)",
    color: "#ffffff", fontSize: "1rem", outline: "none", marginBottom: "1rem",
    boxSizing: "border-box" as const,
  };

  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 900, color: "#ffffff", marginBottom: "0.5rem" }}>
          MENTE<span style={{ color: "#E50914" }}>.AI</span>
        </h1>
        <p style={{ textAlign: "center", color: "#00d4ff", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Onde mentes são formadas, não formatadas...!
        </p>

        <div style={{ display: "flex", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px", marginBottom: "2rem" }}>
          {(["entrar", "cadastrar"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setErro(""); setSucesso(""); }}
              style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700,
                backgroundColor: tab === t ? "#ffffff" : "transparent",
                color: tab === t ? "#0a0e27" : "rgba(255,255,255,0.5)",
                textTransform: "capitalize", transition: "all 0.2s" }}>
              {t === "entrar" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "2rem" }}>

          {tab === "cadastrar" && (
            <input style={input} placeholder="Seu nome completo" value={nome}
              onChange={(e) => setNome(e.target.value)} />
          )}

          <input style={input} placeholder="Seu email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <input style={input} placeholder="Sua senha" type="password" value={senha}
            onChange={(e) => setSenha(e.target.value)} />

          {tab === "cadastrar" && (
            <input style={input} placeholder="Confirmar senha" type="password" value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)} />
          )}

          {erro && <p style={{ color: "#E50914", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>{erro}</p>}
          {sucesso && <p style={{ color: "#10B981", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>{sucesso}</p>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "1rem", fontSize: "1rem", fontWeight: 700, borderRadius: "8px",
              border: "none", backgroundColor: "#E50914", color: "#ffffff", cursor: "pointer",
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s" }}>
            {loading ? "Aguarde..." : tab === "entrar" ? "Entrar" : "Criar conta grátis"}
          </button>

          {tab === "entrar" && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "1rem" }}>
              <span style={{ cursor: "pointer", color: "#00d4ff" }} onClick={() => setTab("cadastrar")}>
                Não tem conta? Cadastre-se grátis
              </span>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}