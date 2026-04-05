'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { t } from '@/lib/translations';
import type { AgentDefinition } from '@/canon/agents/all-agents';

interface AgentCardProps {
  agent: AgentDefinition;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();

  const factionColors: Record<string, string> = {
    order: 'from-blue-600 to-blue-800',
    chaos: 'from-red-600 to-red-800',
    balance: 'from-purple-600 to-purple-800',
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/agentes/${agent.id}`)}
      className={`relative group cursor-pointer rounded-2xl bg-gradient-to-br ${factionColors[agent.faction] || 'from-gray-600 to-gray-800'} p-1 transition-all duration-500 ease-out shadow-xl hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] w-full h-full`}
      aria-label={`Ver detalhes do agente ${agent.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/agentes/${agent.id}`);
        }
      }}
    >
      <div className="relative bg-gray-950 rounded-xl overflow-hidden h-full aspect-[2/3]">
        <img
          src={`/images/agentes/${agent.id}.png`}
          alt={agent.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-black/70" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-[0.7rem] text-white/60 mb-1">
            {t(`dimensions.${agent.dimension}`)} • {t(`levels.${agent.level}`)}
          </div>
          <h3 className="text-xl font-bold tracking-widest text-white group-hover:text-[#00F0FF] transition-colors duration-300">
            {agent.name}
          </h3>
          <div className="text-sm text-white/60">
            {agent.badge?.description ?? t(`factions.${agent.faction}`)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
