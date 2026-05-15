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
      else { setSucesso(tab === "entrar" ? "Login realizado!" : "Cadastro realizado!"); setTimeout(() => { window.location.href = "/home"; }, 1000); }
    } catch { setErro("Erro de conexao."); } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ background: "#0a0a1a" }}>
      <div className="w-full max-w-[420px]">
        <h1 className="text-center text-3xl font-black text-white mb-2">
          MENTE<span className="text-red-500">.AI</span>
        </h1>
        <p className="text-center text-cyan-400 mb-8 text-sm">
          Onde mentes sao formadas, nao formatadas...
        </p>

        <div className="flex bg-white/5 rounded-lg p-1 mb-8">
          {["entrar", "cadastrar"].map((t) => (
            <button key={t} type="button" onClick={() => { setTab(t); setErro(""); setSucesso(""); }}
              className={`flex-1 py-2.5 rounded-md border-none font-bold cursor-pointer transition text-sm ${
                tab === t ? "bg-white text-[#0a0a1a]" : "bg-transparent text-white/50 hover:text-white/70"
              }`}>
              {t === "entrar" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
          {tab === "cadastrar" && (
            <input className="w-full px-4 py-3 rounded-lg border border-white/15 bg-[#1a1a2e] text-white text-sm outline-none mb-4 box-border placeholder:text-white/30 autofill:shadow-[inset_0_0_0px_1000px_#1a1a2e] "
              placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
          )}
          <input className="w-full px-4 py-3 rounded-lg border border-white/15 bg-[#1a1a2e] text-white text-sm outline-none mb-4 box-border placeholder:text-white/30 autofill:shadow-[inset_0_0_0px_1000px_#1a1a2e]"
            type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          
          <div className="relative mb-4">
            <input className="w-full px-4 py-3 rounded-lg border border-white/15 bg-[#1a1a2e] text-white text-sm outline-none pr-12 box-border placeholder:text-white/30 autofill:shadow-[inset_0_0_0px_1000px_#1a1a2e]"
              placeholder="Sua senha" type={verSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete={tab === "entrar" ? "current-password" : "new-password"} />
            <button type="button" onClick={() => setVerSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-white p-1 flex">
              {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {tab === "cadastrar" && (
            <div className="relative mb-4">
              <input className="w-full px-4 py-3 rounded-lg border border-white/15 bg-[#1a1a2e] text-white text-sm outline-none pr-12 box-border placeholder:text-white/30 autofill:shadow-[inset_0_0_0px_1000px_#1a1a2e]"
                placeholder="Confirmar senha" type={verConfirmar ? "text" : "password"} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} autoComplete="new-password" />
              <button type="button" onClick={() => setVerConfirmar((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-white p-1 flex">
                {verConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}

          {erro && <p className="text-red-500 text-sm mb-4 text-center">{erro}</p>}
          {sucesso && <p className="text-emerald-400 text-sm mb-4 text-center">{sucesso}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 text-base font-bold rounded-lg border-none bg-red-600 text-white cursor-pointer disabled:opacity-70 hover:bg-red-700 transition">
            {loading ? "Aguarde..." : tab === "entrar" ? "Entrar" : "Criar conta gratis"}
          </button>

          {tab === "entrar" && (
            <p className="text-center text-white/40 text-sm mt-4">
              <span className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition" onClick={() => setTab("cadastrar")}>
                Nao tem conta? Cadastre-se gratis
              </span>
            </p>
          )}
        </form>
      </div>
    </main>
  );
}