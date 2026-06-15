'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/providers/SessionProvider';

export default function CertificadoPage() {
  const { user } = useSession();
  const [data, setData] = useState<{ eligible: boolean; completed: number; total: number; completedAt: string | null } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/certificate?userId=${user.id}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, [user?.id]);

  if (!data) return <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#00FFFF", fontFamily: "monospace" }}>Verificando progresso...</p></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ maxWidth: "700px", width: "100%", padding: "3rem 2rem", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "16px", textAlign: "center", position: "relative" }}>
        {/* Glow ciano decorativo */}
        <div style={{ position: "absolute", top: "-2px", left: "-2px", right: "-2px", bottom: "-2px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(0,255,255,0.1), rgba(139,92,246,0.1))", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Image 
            src="/images/storyboard/trophy.jpg" 
            alt="Certificado MENTE.AI"
            width={300}
            height={300}
            style={{ width: '100%', maxWidth: '300px', margin: '0 auto 24px', display: 'block', borderRadius: '12px', height: 'auto' }}
          />
          <p style={{ color: "#00FFFF", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", margin: 0 }}>
            MENTE.AI — FASE 1 NARRATIVA
          </p>

          {data.eligible ? (
            <>
              <h1 style={{ fontSize: "2.2rem", color: "#00FFFF", margin: "1rem 0 0.5rem", textShadow: "0 0 20px rgba(0,255,255,0.5)" }}>
                🎓 Certificado de Conclusão
              </h1>
              <p style={{ color: "#fff", fontSize: "1.1rem", margin: "0.5rem 0 2rem" }}>
                {user?.name || 'Explorador'}, você completou <span style={{ color: "#00FFFF" }}>100 episódios</span> da Fase 1 Narrativa do NEXUS.
              </p>
              <div style={{ border: "1px solid rgba(0,255,255,0.2)", borderRadius: "8px", padding: "1rem", margin: "1rem 0", background: "rgba(0,255,255,0.03)" }}>
                <p style={{ color: "#9ca3af", fontSize: "11px", margin: 0 }}>CONCLUÍDO EM</p>
                <p style={{ color: "#00FF88", fontSize: "14px", margin: "0.25rem 0 0" }}>
                  {new Date(data.completedAt!).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "10px", marginTop: "2rem" }}>
                &ldquo;O aprendizado é a única coisa que a mente nunca se cansa, nunca tem medo e nunca se arrepende.&rdquo; — Leonardo da Vinci
              </p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "1.8rem", color: "#00FFFF", margin: "1rem 0" }}>
                Certificado — Em Progresso
              </h1>
              <p style={{ color: "#9ca3af", margin: "1rem 0" }}>
                {data.completed}/{data.total} episódios completos
              </p>
              <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", margin: "1rem 0" }}>
                <div style={{ width: `${(data.completed / data.total) * 100}%`, height: "100%", background: "linear-gradient(90deg, #00FFFF, #8B5CF6)", borderRadius: "3px", transition: "width 0.5s ease" }} />
              </div>
              <p style={{ color: "#666", fontSize: "11px", marginTop: "2rem" }}>
                Continue explorando os universos para desbloquear seu certificado.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
