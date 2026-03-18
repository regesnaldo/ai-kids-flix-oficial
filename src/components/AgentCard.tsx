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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/agentes/${agent.id}`)}
      className={`relative group cursor-pointer rounded-2xl bg-gradient-to-br ${factionColors[agent.faction] || 'from-gray-600 to-gray-800'} p-1 transition-all duration-300 shadow-xl hover:shadow-2xl w-full h-full`}
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
      <div className="relative bg-gray-900 rounded-xl overflow-hidden h-full min-h-[400px]">
        <div className="relative h-48 w-full bg-gradient-to-br from-purple-600 via-blue-600 to-gray-900 flex items-center justify-center p-6">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold mb-2">{agent.name}</h3>
            <p className="text-sm text-white/70">
              {t(`dimensions.${agent.dimension}`)} • {t(`levels.${agent.level}`)}
            </p>
          </div>
        </div>

        <div className="p-6 text-white">
          <p className="text-sm text-gray-300 mb-4 line-clamp-3">
            {agent.personality.approach}
          </p>

          <div className="mb-4">
            <span className="bg-purple-600/80 px-3 py-1 rounded-full text-xs font-medium">
              {agent.badge.name}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
              {t(`levels.${agent.level}`)}
            </span>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
              {t(`factions.${agent.faction}`)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
