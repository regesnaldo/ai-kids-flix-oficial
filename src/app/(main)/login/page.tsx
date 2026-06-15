"use client";
import { useState, useMemo, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Stars — Background de estrelas animadas.
 * Posições geradas apenas no CLIENTE (useEffect) para evitar
 * hydration mismatch entre SSR e browser.
 */
function Stars() {
  const [mounted, setMounted] = useState(false);

  const stars = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 3}s`,
    }));
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: '#ffffff',
            opacity: 0.2,
            animation: `starPulse ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes starPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

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
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#000000',
      position: 'relative',
    }}>
      <Stars />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        animation: 'terminalAppear 800ms cubic-bezier(0.16,1,0.3,1) forwards',
        transform: 'scale(0.8)',
        opacity: 0,
      }}>
        <style jsx>{`
          @keyframes terminalAppear {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        <p style={{
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#00f5ff',
          opacity: 0.6,
          letterSpacing: '0.1em',
          marginBottom: '0.5rem',
        }}>
          NEXUS PRIME // CONSCIOUSNESS TERMINAL v2.1
        </p>

        <h1 style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.15em',
          marginBottom: '2rem',
        }}>
          MATERIALIZAR CONSCIÊNCIA
        </h1>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: '4px',
          boxShadow: '0 0 40px rgba(0,245,255,0.1)',
          padding: '2rem',
        }}>
          {tab === "cadastrar" && (
            <input style={{
              width: '100%',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              border: '1px solid rgba(0,245,255,0.2)',
              background: 'rgba(0,245,255,0.05)',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'monospace',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            } as React.CSSProperties}
              placeholder="Nome de identidade"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#00f5ff'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0,245,255,0.3)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          )}

          <input style={{
            width: '100%',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid rgba(0,245,255,0.2)',
            background: 'rgba(0,245,255,0.05)',
            color: '#ffffff',
            fontSize: '14px',
            fontFamily: 'monospace',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
          } as React.CSSProperties}
            type="email"
            placeholder="Identificação de consciência (email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            onFocus={(e) => { e.currentTarget.style.borderColor = '#00f5ff'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0,245,255,0.3)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
          />

          <div style={{ position: 'relative', marginBottom: tab === "cadastrar" ? '1rem' : '0' }}>
            <input style={{
              width: '100%',
              padding: '0.75rem 1rem',
              paddingRight: '3rem',
              borderRadius: '4px',
              border: '1px solid rgba(0,245,255,0.2)',
              background: 'rgba(0,245,255,0.05)',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'monospace',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            } as React.CSSProperties}
              placeholder="Chave de acesso (senha)"
              type={verSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete={tab === "entrar" ? "current-password" : "new-password"}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#00f5ff'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0,245,255,0.3)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button type="button" onClick={() => setVerSenha((v) => !v)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)',
                padding: '4px',
                display: 'flex',
              }}>
              {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {tab === "cadastrar" && (
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input style={{
                width: '100%',
                padding: '0.75rem 1rem',
                paddingRight: '3rem',
                borderRadius: '4px',
                border: '1px solid rgba(0,245,255,0.2)',
                background: 'rgba(0,245,255,0.05)',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              } as React.CSSProperties}
                placeholder="Confirmar chave de acesso"
                type={verConfirmar ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                autoComplete="new-password"
                onFocus={(e) => { e.currentTarget.style.borderColor = '#00f5ff'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0,245,255,0.3)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setVerConfirmar((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.5)',
                  padding: '4px',
                  display: 'flex',
                }}>
                {verConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {erro && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '1rem', textAlign: 'center', fontFamily: 'monospace' }}>{erro}</p>}
          {sucesso && <p style={{ color: '#4ade80', fontSize: '13px', marginBottom: '1rem', textAlign: 'center', fontFamily: 'monospace' }}>{sucesso}</p>}

          <button type="submit" disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #00f5ff',
              background: loading ? 'rgba(0,245,255,0.1)' : 'transparent',
              color: '#00f5ff',
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '0.12em',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 200ms ease',
              marginBottom: '0',
            } as React.CSSProperties}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = '#00f5ff'; e.currentTarget.style.color = '#000000'; } }}
            onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00f5ff'; } }}>
            {loading ? (
              <span>SINCRONIZANDO<span style={{ animation: 'blink 1s step-end infinite' }}>_</span></span>
            ) : (
              tab === "entrar" ? "INICIAR MATERIALIZAÇÃO" : "CRIAR IDENTIDADE"
            )}
          </button>

          {tab === "entrar" && (
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span onClick={() => { setTab("cadastrar"); setErro(""); setSucesso(""); }}
                style={{
                  color: 'rgba(0,245,255,0.5)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  transition: 'color 200ms ease',
                } as React.CSSProperties}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,245,255,1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,245,255,0.5)'; }}>
                Primeira vez no NEXUS? → CRIAR IDENTIDADE
              </span>
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
