"use client";
import { useState } from "react";

export default function Login() {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro("");
  }

  async function handleSubmit() {
    setErro("");
    if (!form.email || !form.senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (modo === "cadastro" && form.senha !== form.confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (modo === "cadastro" && !form.nome) {
      setErro("Informe seu nome.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(modo === "login" ? "Login em breve!" : "Cadastro em breve!");
    }, 1000);
  }

  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, margin: 0 }}>
            <span style={{ color: "#ffffff" }}>MENTE</span>
            <span style={{ color: "#E50914" }}>.AI</span>
          </h1>
          <p style={{ color: "#00d4ff", marginTop: "0.5rem", fontSize: "1rem" }}>
            Onde mentes são formadas, não formatadas...!
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "2.5rem 2rem" }}>

          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: "2rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px", gap: "4px" }}>
            {(["login", "cadastro"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setModo(m); setErro(""); }}
                style={{
                  flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none",
                  cursor: "pointer", fontWeight: 700, fontSize: "0.95rem",
                  backgroundColor: modo === m ? "#ffffff" : "transparent",
                  color: modo === m ? "#0a0e27" : "rgba(255,255,255,0.5)",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}>
                {m === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          {/* Campos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {modo === "cadastro" && (
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Nome completo</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.07)", color: "#ffffff", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            )}

            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.07)", color: "#ffffff", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Senha</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.07)", color: "#ffffff", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {modo === "cadastro" && (
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Confirmar senha</label>
                <input
                  name="confirmar"
                  type="password"
                  value={form.confirmar}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.07)", color: "#ffffff", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            )}

            {erro && (
              <p style={{ color: "#E50914", fontSize: "0.9rem", margin: 0 }}>{erro}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: "1rem", fontSize: "1rem", fontWeight: 700, borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#E50914", color: "#ffffff", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s", marginTop: "0.5rem" }}>
              {loading ? "Aguarde..." : modo === "login" ? "Entrar" : "Criar conta"}
            </button>

            {modo === "login" && (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", margin: 0 }}>
                Esqueceu a senha?{" "}
                <span style={{ color: "#00d4ff", cursor: "pointer" }}>Recuperar</span>
              </p>
            )}

            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", margin: 0 }}>
              {modo === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
              <span
                onClick={() => { setModo(modo === "login" ? "cadastro" : "login"); setErro(""); }}
                style={{ color: "#00d4ff", cursor: "pointer", fontWeight: 600 }}>
                {modo === "login" ? "Cadastre-se grátis" : "Entrar"}
              </span>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", marginTop: "2rem" }}>
          Cancele quando quiser. Sem taxas ocultas.
        </p>
      </div>
    </main>
  );
}