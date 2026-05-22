'use client';

import { allAgents } from '@/data/all-agents';

const AGENT_LABELS: Record<string, string> = {
  nexus: 'NEXUS conecta',
  cipher: 'CIPHER analisa',
  kaos: 'KAOS reage',
  aurora: 'AURORA cria',
  axiom: 'AXIOM explica',
  ethos: 'ETHOS reflete',
  lyra: 'LYRA traduz',
  volt: 'VOLT energiza',
  terra: 'TERRA fundamenta',
  stratos: 'STRATOS projeta',
  prism: 'PRISM revela',
  janus: 'JANUS questiona',
};

export function AgentCommentary({ agentId, commentary }: { agentId: string; commentary: string }) {
  const agent = allAgents.find((a) => a.id === agentId);
  const label = AGENT_LABELS[agentId] || `${agentId?.toUpperCase()} comenta`;

  return (
    <div className="my-6 p-4 rounded-xl border" style={{ background: `${agent?.color || 'var(--neon-cyan)'}08`, borderColor: `${agent?.color || 'var(--neon-cyan)'}20` }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${agent?.color || 'var(--neon-cyan)'}20`, color: agent?.color || 'var(--neon-cyan)' }}>
          {agent?.name?.charAt(0) || '?'}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: agent?.color || 'var(--neon-cyan)' }}>
          {label}
        </span>
      </div>
      <p className="text-white/80 text-sm leading-relaxed italic">
        &ldquo;{commentary}&rdquo;
      </p>
    </div>
  );
}
