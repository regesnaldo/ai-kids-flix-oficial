'use client';

/**
 * MENTE.AI — Modal "Mais Informações" do Agente
 * src/components/info/AgentInfoModal.tsx
 *
 * Conteúdo detalhado de um agente no estilo Netflix.
 * Usa NetflixModal como base.
 *
 * Exibe:
 *  - Descrição expandida
 *  - Nível de dificuldade com barra visual
 *  - Categoria, dimensão e facção
 *  - Botão para iniciar interação com o agente
 */

import NetflixModal from '@/components/ui/NetflixModal';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Layers, Tag } from 'lucide-react';
import type { Agent } from '@/data/agents';

// ─── Paleta por nível ─────────────────────────────────────────────────────────

const NIVEL_CONFIG: Record<Agent['level'], {
  cor: string;
  barras: number;
  label: string;
  descricao: string;
}> = {
  Fundamentos:  { cor: '#3b82f6', barras: 1, label: 'Fundamentos',  descricao: 'Ideal para quem está começando' },
  Intermediário:{ cor: '#22c55e', barras: 2, label: 'Intermediário', descricao: 'Requer conhecimento básico' },
  Avançado:     { cor: '#f97316', barras: 3, label: 'Avançado',      descricao: 'Para quem já domina os fundamentos' },
  Mestre:       { cor: '#a855f7', barras: 4, label: 'Mestre',        descricao: 'Nível especialista' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AgentInfoModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  /** Chamado ao clicar em "Iniciar Interação" */
  onIniciarInteracao?: (agent: Agent) => void;
}

// ─── Seção com ícone ──────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  cor,
}: {
  icon: React.FC<{ className?: string; color?: string }>;
  label: string;
  value: string;
  cor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: cor ? `${cor}22` : 'rgba(255,255,255,0.07)' }}
      >
        <Icon className="h-4 w-4" color={cor ?? 'rgba(255,255,255,0.6)'} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-zinc-200 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AgentInfoModal({
  agent,
  isOpen,
  onClose,
  onIniciarInteracao,
}: AgentInfoModalProps) {
  if (!agent) return null;

  const nivel = NIVEL_CONFIG[agent.level] ?? NIVEL_CONFIG.Fundamentos;
  const totalBarras = 4;

  return (
    <NetflixModal
      isOpen={isOpen}
      onClose={onClose}
      title={agent.technicalName}
      coverUrl={agent.imageUrl}
      accentColor={nivel.cor}
    >
      <div className="space-y-6">

        {/* ── Nickname + nível ── */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-cyan-400 font-semibold text-lg">
            &ldquo;{agent.nickname}&rdquo;
          </p>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: `${nivel.cor}22`, color: nivel.cor, border: `1px solid ${nivel.cor}55` }}
          >
            {nivel.label}
          </span>
        </div>

        {/* ── Descrição ── */}
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider" style={{ color: nivel.cor }}>
            Sobre o Agente
          </h3>
          <p className="text-zinc-300 leading-relaxed text-sm">
            {agent.description}
          </p>
        </div>

        {/* ── Detalhes: categoria, dimensão, facção ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InfoRow icon={Tag}    label="Categoria" value={agent.category}  cor={nivel.cor} />
          <InfoRow icon={Layers} label="Dimensão"  value={agent.dimension} cor={nivel.cor} />
          <InfoRow icon={Cpu}    label="Facção"    value={agent.faction}   cor={nivel.cor} />
        </div>

        {/* ── Nível de dificuldade ── */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: nivel.cor }}>
            Nível de Dificuldade
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {Array.from({ length: totalBarras }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 20 }}
                  style={{ originY: 1 }}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                  css-var-color={nivel.cor}
                >
                  <div
                    className="w-full h-full rounded-md flex items-center justify-center text-xs font-bold"
                    style={
                      i < nivel.barras
                        ? { background: nivel.cor, color: '#fff', boxShadow: `0 0 8px ${nivel.cor}88` }
                        : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)' }
                    }
                  >
                    {i + 1}
                  </div>
                </motion.div>
              ))}
            </div>
            <span className="text-sm text-zinc-400">{nivel.descricao}</span>
          </div>
        </div>

        {/* ── Funcionalidades ── */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: nivel.cor }}>
            O que você vai aprender
          </h3>
          <ul className="space-y-2">
            {[
              'Conceitos fundamentais desta tecnologia de IA',
              'Exemplos práticos e casos de uso reais',
              'Exercícios interativos com feedback imediato',
              'Como este agente se conecta com os outros no ecossistema',
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-0.5 shrink-0 text-base" style={{ color: nivel.cor }}>▸</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ── Rodapé: tempo estimado + botões ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { onIniciarInteracao?.(agent); onClose(); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 px-5 font-bold text-white transition-all"
            style={{
              background: `linear-gradient(135deg, ${nivel.cor}, ${nivel.cor}cc)`,
              boxShadow: `0 0 20px ${nivel.cor}44`,
            }}
          >
            <BookOpen className="h-4 w-4" />
            Iniciar Interação
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="flex-1 sm:flex-none rounded-xl py-3 px-5 font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Fechar
          </motion.button>
        </div>

        <p className="text-center text-xs text-zinc-600">
          Tempo estimado de estudo: 2–4 min · Agente #{agent.discoveryOrder}
        </p>
      </div>
    </NetflixModal>
  );
}




