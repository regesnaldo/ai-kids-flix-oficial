"use client";

/**
 * MENTE.AI — Slot de Seleção de Agente
 * Usado duas vezes no AgentCombinationModal (lado A e lado B).
 *
 * Estados visuais:
 *  - Vazio: anel pulsante com instrução "Selecione um agente"
 *  - Preenchido: avatar do agente + nome + nível + botão remover
 *  - Hover da lista: destaque com glow colorido por facção
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Agent } from "@/data/agents";

// ─── Paleta de facção ─────────────────────────────────────────────────────────

const COR_NIVEL: Record<string, string> = {
  Fundamentos:  "#3b82f6",
  Intermediário: "#22c55e",
  Avançado:     "#f97316",
  Mestre:       "#a855f7",
};

const NIVEL_LABEL: Record<string, string> = {
  Fundamentos:  "Fund.",
  Intermediário: "Inter.",
  Avançado:     "Avanç.",
  Mestre:       "Mestre",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AgentSelectorSlotProps {
  /** Label do slot: "Agente A" ou "Agente B" */
  label: string;
  /** Agente atualmente selecionado (null = slot vazio) */
  agenteSelecionado: Agent | null;
  /** Lista de agentes disponíveis para seleção */
  agentes: Agent[];
  /** IDs já usados no outro slot (para evitar duplicatas) */
  idsOcupados: string[];
  onSelecionar: (agent: Agent) => void;
  onRemover: () => void;
  /** Desabilita interação (ex: durante loading) */
  desabilitado?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AgentSelectorSlot({
  label,
  agenteSelecionado,
  agentes,
  idsOcupados,
  onSelecionar,
  onRemover,
  desabilitado = false,
}: AgentSelectorSlotProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
        setBusca("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Foca input ao abrir
  useEffect(() => {
    if (menuAberto) setTimeout(() => inputRef.current?.focus(), 50);
  }, [menuAberto]);

  const agentesFiltrados = agentes.filter(
    (a) =>
      !idsOcupados.includes(a.id) &&
      (busca === "" ||
        a.technicalName.toLowerCase().includes(busca.toLowerCase()) ||
        a.nickname.toLowerCase().includes(busca.toLowerCase()) ||
        a.category.toLowerCase().includes(busca.toLowerCase())),
  );

  return (
    <div ref={menuRef} style={{ position: "relative", flex: 1, minWidth: 0 }} data-testid={`agent-selector-${label.toLowerCase().replace(' ', '-')}`}>
      {/* Label do slot */}
      <p style={{ fontSize: 10, letterSpacing: "0.15em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </p>

      {/* ── Slot vazio ── */}
      {!agenteSelecionado ? (
        <motion.button
          type="button"
          onClick={() => !desabilitado && setMenuAberto(true)}
          disabled={desabilitado}
          whileHover={desabilitado ? {} : { scale: 1.02 }}
          whileTap={desabilitado ? {} : { scale: 0.98 }}
          data-testid={`agent-selector-${label.toLowerCase().replace(' ', '-')}-empty`}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 16,
            border: "2px dashed rgba(139,92,246,0.4)",
            background: "rgba(139,92,246,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: desabilitado ? "not-allowed" : "pointer",
            opacity: desabilitado ? 0.5 : 1,
          }}
        >
          {/* Anel pulsante */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "2px solid rgba(139,92,246,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
          </motion.div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            Selecionar agente
          </span>
        </motion.button>
      ) : (
        /* ── Slot preenchido ── */
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 16,
            border: `2px solid ${COR_NIVEL[agenteSelecionado.level] ?? "#9333ea"}55`,
            background: `linear-gradient(135deg, ${COR_NIVEL[agenteSelecionado.level] ?? "#9333ea"}12 0%, rgba(10,10,15,0.95) 60%)`,
            boxShadow: `0 0 24px ${COR_NIVEL[agenteSelecionado.level] ?? "#9333ea"}33`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow de fundo */}
          <div style={{
            position: "absolute", right: -20, top: -20,
            width: 80, height: 80, borderRadius: "50%",
            background: `${COR_NIVEL[agenteSelecionado.level] ?? "#9333ea"}20`,
            filter: "blur(20px)", pointerEvents: "none",
          }} />

          {/* Avatar */}
          <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
            <Image
              src={agenteSelecionado.imageUrl}
              alt={agenteSelecionado.technicalName}
              fill
              sizes="56px"
              style={{ objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Fallback letra */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: `${COR_NIVEL[agenteSelecionado.level] ?? "#9333ea"}33`,
              fontSize: 20, fontWeight: 900, color: COR_NIVEL[agenteSelecionado.level] ?? "#9333ea",
            }}>
              {agenteSelecionado.technicalName.charAt(0)}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                color: "#fff", background: COR_NIVEL[agenteSelecionado.level] ?? "#9333ea",
                padding: "2px 6px", borderRadius: 4, textTransform: "uppercase",
              }}>
                {NIVEL_LABEL[agenteSelecionado.level] ?? agenteSelecionado.level}
              </span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {agenteSelecionado.technicalName}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>
              &quot;{agenteSelecionado.nickname}&quot;
            </p>
          </div>

          {/* Botão remover */}
          {!desabilitado && (
            <motion.button
              type="button"
              onClick={onRemover}
              whileHover={{ scale: 1.15, backgroundColor: "rgba(239,68,68,0.3)" }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(239,68,68,0.4)",
                background: "rgba(239,68,68,0.1)", color: "#f87171",
                fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
              aria-label={`Remover ${agenteSelecionado.technicalName}`}
            >
              ×
            </motion.button>
          )}
        </motion.div>
      )}

      {/* ── Dropdown de seleção ── */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
              background: "#0f1a34",
              border: "1px solid rgba(139,92,246,0.4)",
              borderRadius: 14,
              boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.15)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {/* Campo de busca */}
            <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                ref={inputRef}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar agente..."
                style={{
                  width: "100%", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                  padding: "6px 10px", fontSize: 12, color: "#fff",
                  outline: "none",
                }}
              />
            </div>

            {/* Lista */}
            <div style={{ maxHeight: 220, overflowY: "auto", padding: "6px 0" }}>
              {agentesFiltrados.length === 0 ? (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "16px 0" }}>
                  Nenhum agente encontrado
                </p>
              ) : (
                agentesFiltrados.map((agent) => (
                  <motion.button
                    key={agent.id}
                    type="button"
                    onClick={() => { onSelecionar(agent); setMenuAberto(false); setBusca(""); }}
                    whileHover={{ backgroundColor: "rgba(139,92,246,0.15)" }}
                    data-testid="agent-option"
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: "8px 14px", cursor: "pointer",
                      background: "transparent", border: "none", textAlign: "left",
                    }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <Image src={agent.imageUrl} alt={agent.technicalName} fill sizes="34px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {agent.technicalName}
                      </p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                        {agent.category} • {agent.level}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: "#fff", background: COR_NIVEL[agent.level] ?? "#9333ea",
                      padding: "2px 5px", borderRadius: 3, flexShrink: 0,
                    }}>
                      {NIVEL_LABEL[agent.level] ?? "•"}
                    </span>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
