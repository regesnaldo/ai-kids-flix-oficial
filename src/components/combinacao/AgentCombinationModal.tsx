"use client";

/**
 * MENTE.AI — Modal de Combinação de Agentes (Fase 2)
 * src/components/combinacao/AgentCombinationModal.tsx
 *
 * Feature principal da Fase 2: permite combinar dois agentes
 * desbloqueados para descobrir sinergias e ganhar XP bônus.
 *
 * Fluxo:
 *  1. Usuário seleciona Agente A e Agente B via AgentSelectorSlot
 *  2. SinergiaPreview mostra o arco entre eles (aguardando)
 *  3. Clica "Combinar" → POST /api/agent-combination
 *  4. Sucesso: ConfettiBlast + XPPopup + SinergiaPreview animada
 *  5. Falha: mensagem de erro inline
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Agent } from "@/data/agents";
import AgentSelectorSlot from "./AgentSelectorSlot";
import SinergiaPreview from "./SinergiaPreview";
import XPPopup from "./XPPopup";
import ConfettiBlast from "./ConfettiBlast";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ResultadoCombinacao {
  sucesso: boolean;
  novaDescoberta: boolean;
  tipoSinergia?: string;
  sinergiaBonus?: number;
  descricao?: string;
  xpGanho: number;
  xpTotalAtualizado?: number;
  badgesDesbloqueadas?: string[];
  erro?: string;
  motivoErro?: "COMBINACAO_NAO_EXISTE" | "AGENTE_BLOQUEADO" | "COMBINACAO_INATIVA" | "INTERNO";
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AgentCombinationModalProps {
  /** Visibilidade do modal */
  aberto: boolean;
  /** Todos os agentes disponíveis na plataforma */
  agentes: Agent[];
  /** Fecha o modal */
  onFechar: () => void;
  /** Callback chamado após combinação bem-sucedida */
  onCombinacaoBemSucedida?: (resultado: ResultadoCombinacao) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AgentCombinationModal({
  aberto,
  agentes,
  onFechar,
  onCombinacaoBemSucedida,
}: AgentCombinationModalProps) {
  const [agentA, setAgentA] = useState<Agent | null>(null);
  const [agentB, setAgentB] = useState<Agent | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCombinacao | null>(null);
  const [mostrarXP, setMostrarXP] = useState(false);
  const [mostrarConfetti, setMostrarConfetti] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const podeCominar = !!agentA && !!agentB && !carregando;

  // ── Fechar com Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!aberto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !carregando) onFechar();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [aberto, carregando, onFechar]);

  // ── Resetar estado ao fechar ───────────────────────────────────────────────
  useEffect(() => {
    if (!aberto) {
      setTimeout(() => {
        setAgentA(null);
        setAgentB(null);
        setResultado(null);
        setErro(null);
        setMostrarXP(false);
        setMostrarConfetti(false);
      }, 350); // aguarda animação de saída
    }
  }, [aberto]);

  // ── Combinar agentes ───────────────────────────────────────────────────────
  const handleCombinar = useCallback(async () => {
    if (!agentA || !agentB) return;
    setCarregando(true);
    setErro(null);
    setResultado(null);

    try {
      const res = await fetch("/api/agent-combination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentAId: agentA.id, agentBId: agentB.id }),
      });

      const dados = await res.json() as ResultadoCombinacao;

      if (!res.ok || !dados.sucesso) {
        setErro(dados.erro ?? "Erro ao combinar agentes. Tente novamente.");
        return;
      }

      setResultado(dados);
      setMostrarXP(true);
      if (dados.novaDescoberta) setMostrarConfetti(true);
      onCombinacaoBemSucedida?.(dados);

      // Auto-ocultar popup de XP após 3s
      setTimeout(() => setMostrarXP(false), 3000);

    } catch {
      setErro("Falha de conexão. Verifique sua rede.");
    } finally {
      setCarregando(false);
    }
  }, [agentA, agentB, onCombinacaoBemSucedida]);

  // ── Tentar novamente após erro ─────────────────────────────────────────────
  const handleTentarNovamente = () => {
    setErro(null);
    setResultado(null);
  };

  // ── IDs ocupados para evitar duplicatas ───────────────────────────────────
  const idsOcupados = [
    agentA ? agentA.id : "",
    agentB ? agentB.id : "",
  ].filter(Boolean);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {aberto && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => !carregando && onFechar()}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 200,
            }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Combinar Agentes"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 201,
              width: "min(560px, calc(100vw - 32px))",
              background: "linear-gradient(160deg, #0d1526 0%, #0a0f1e 100%)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 24,
              boxShadow: "0 0 60px rgba(139,92,246,0.15), 0 32px 80px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            {/* Brilho superior decorativo */}
            <div style={{
              position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
              pointerEvents: "none",
            }} />

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px 0",
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                  Combinação de Agentes
                </h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "2px 0 0" }}>
                  Descubra sinergias entre agentes para ganhar XP bônus
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => !carregando && onFechar()}
                disabled={carregando}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Fechar modal"
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: carregando ? "not-allowed" : "pointer",
                  flexShrink: 0,
                }}
              >
                ×
              </motion.button>
            </div>

            {/* ── Área principal ───────────────────────────────────────────────── */}
            <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Seletores + preview central */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                <AgentSelectorSlot
                  label="Agente A"
                  agenteSelecionado={agentA}
                  agentes={agentes}
                  idsOcupados={idsOcupados.filter((id) => id !== (agentA?.id ?? ""))}
                  onSelecionar={(a) => { setAgentA(a); setErro(null); setResultado(null); }}
                  onRemover={() => { setAgentA(null); setErro(null); setResultado(null); }}
                  desabilitado={carregando}
                />

                {/* Preview central — posição relativa para o XPPopup */}
                <div style={{ position: "relative", flexShrink: 0, paddingBottom: 28 }}>
                  <SinergiaPreview
                    agentA={agentA}
                    agentB={agentB}
                    tipoSinergia={resultado?.tipoSinergia}
                    sinergiaBonus={resultado?.sinergiaBonus}
                    carregando={carregando}
                    sucesso={!!resultado?.sucesso}
                  />
                  {/* XP Popup flutua aqui */}
                  <AnimatePresence>
                    {mostrarXP && resultado && (
                      <XPPopup
                        key="xp"
                        xp={resultado.xpGanho}
                        badges={resultado.badgesDesbloqueadas}
                        novaDescoberta={resultado.novaDescoberta}
                      />
                    )}
                  </AnimatePresence>
                  {/* Confetti */}
                  <AnimatePresence>
                    {mostrarConfetti && (
                      <ConfettiBlast
                        key="confetti"
                        onDone={() => setMostrarConfetti(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <AgentSelectorSlot
                  label="Agente B"
                  agenteSelecionado={agentB}
                  agentes={agentes}
                  idsOcupados={idsOcupados.filter((id) => id !== (agentB?.id ?? ""))}
                  onSelecionar={(b) => { setAgentB(b); setErro(null); setResultado(null); }}
                  onRemover={() => { setAgentB(null); setErro(null); setResultado(null); }}
                  desabilitado={carregando}
                />
              </div>

              {/* ── Descrição da sinergia (pós-combinação) ──────────────────── */}
              <AnimatePresence>
                {resultado?.descricao && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.55,
                    }}>
                      {resultado.descricao}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Mensagem de erro ─────────────────────────────────────────── */}
              <AnimatePresence>
                {erro && (
                  <motion.div
                    key="erro"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 12,
                      padding: "10px 14px",
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#fca5a5", margin: 0, flex: 1 }}>
                      ⚠️ {erro}
                    </p>
                    <button
                      type="button"
                      onClick={handleTentarNovamente}
                      style={{
                        fontSize: 11, fontWeight: 700, color: "#fca5a5",
                        background: "transparent", border: "none",
                        cursor: "pointer", whiteSpace: "nowrap", opacity: 0.8,
                      }}
                    >
                      Tentar novamente
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Botão de combinação ──────────────────────────────────────── */}
              <motion.button
                type="button"
                onClick={resultado?.sucesso ? handleTentarNovamente : handleCombinar}
                disabled={!podeCominar && !resultado?.sucesso}
                whileHover={podeCominar || resultado?.sucesso ? { scale: 1.02 } : {}}
                whileTap={podeCominar || resultado?.sucesso ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 14,
                  border: "none",
                  background: resultado?.sucesso
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : podeCominar
                    ? "linear-gradient(135deg, #9333ea, #7c3aed)"
                    : "rgba(255,255,255,0.05)",
                  color: podeCominar || resultado?.sucesso ? "#fff" : "rgba(255,255,255,0.25)",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  cursor: podeCominar || resultado?.sucesso ? "pointer" : "not-allowed",
                  boxShadow: podeCominar
                    ? "0 0 24px rgba(147,51,234,0.4)"
                    : resultado?.sucesso
                    ? "0 0 24px rgba(34,197,94,0.35)"
                    : "none",
                  transition: "background 0.3s ease, box-shadow 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <AnimatePresence mode="wait">
                  {carregando ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        style={{
                          display: "inline-block", width: 16, height: 16,
                          border: "2px solid rgba(255,255,255,0.25)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                        }}
                      />
                      Combinando...
                    </motion.span>
                  ) : resultado?.sucesso ? (
                    <motion.span
                      key="sucesso"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      ✓ Combinação descoberta! Tentar outra?
                    </motion.span>
                  ) : (
                    <motion.span
                      key="normal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {podeCominar ? "⚡ Combinar Agentes" : "Selecione dois agentes"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* ── Dica de rodapé ───────────────────────────────────────────── */}
              <p style={{
                fontSize: 11, color: "rgba(255,255,255,0.25)",
                textAlign: "center", margin: 0,
              }}>
                Somente agentes desbloqueados podem ser combinados · Esc para fechar
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
