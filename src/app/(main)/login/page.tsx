"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [tab, setTab] = useState("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(""); setSucesso("");
    if (tab === "cadastrar" && senha !== confirmar) { setErro("As senhas nao coincidem."); return; }
    setLoading(true);
    try {
      const url = tab === "entrar" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "entrar" ? { email, senha } : { nome, email, senha };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || "Erro ao processar."); }
      else { setSucesso(tab === "entrar" ? "Login realizado!" : "Cadastro realizado!"); setTimeout(() => { window.location.href = "/perfis"; }, 1000); }
    } catch { setErro("Erro de conexao."); } finally { setLoading(false); }
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "0.85rem 3rem 0.85rem 1rem", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "#1a1f3a",
    color: "#ffffff", fontSize: "1rem", outline: "none", boxSizing: "border-box",
    WebkitBoxShadow: "0 0 0px 1000px #1a1f3a inset",
    WebkitTextFillColor: "#ffffff",
  };

  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 900, color: "#ffffff", marginBottom: "0.5rem" }}>
          MENTE<span style={{ color: "#E50914" }}>.AI</span>
        </h1>
        <p style={{ textAlign: "center", color: "#00d4ff", marginBottom: "2rem" }}>
          Onde mentes sao formadas, nao formatadas...!
        </p>
        <div style={{ display: "flex", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px", marginBottom: "2rem" }}>
          {["entrar", "cadastrar"].map((t) => (
            <button key={t} type="button" onClick={() => { setTab(t); setErro(""); setSucesso(""); }}
              style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700,
                backgroundColor: tab === t ? "#ffffff" : "transparent",
                color: tab === t ? "#0a0e27" : "rgba(255,255,255,0.5)" }}>
              {t === "entrar" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "2rem" }}>
          {tab === "cadastrar" && (
            <input style={{ ...inp, marginBottom: "1rem" }} placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
          )}
          <input style={{ ...inp, marginBottom: "1rem" }} type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input style={inp} placeholder="Sua senha" type={verSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete={tab === "entrar" ? "current-password" : "new-password"} />
            <button type="button" onClick={() => setVerSenha((v) => !v)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#ffffff", display: "flex", padding: "4px" }}>
              {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {tab === "cadastrar" && (
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <input style={inp} placeholder="Confirmar senha" type={verConfirmar ? "text" : "password"} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} autoComplete="new-password" />
              <button type="button" onClick={() => setVerConfirmar((v) => !v)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#ffffff", display: "flex", padding: "4px" }}>
                {verConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}
          {erro && <p style={{ color: "#E50914", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>{erro}</p>}
          {sucesso && <p style={{ color: "#10B981", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>{sucesso}</p>}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "1rem", fontSize: "1rem", fontWeight: 700, borderRadius: "8px", border: "none", backgroundColor: "#E50914", color: "#ffffff", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Aguarde..." : tab === "entrar" ? "Entrar" : "Criar conta gratis"}
          </button>
          {tab === "entrar" && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "1rem" }}>
              <span style={{ cursor: "pointer", color: "#00d4ff" }} onClick={() => setTab("cadastrar")}>
                Nao tem conta? Cadastre-se gratis
              </span>
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

