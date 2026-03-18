'use client';
import { useRouter } from 'next/navigation';
import type { AgentDefinition } from '@/canon/agents/generated/types';
import { motion } from 'framer-motion';

interface AgentCardProps {
  agent: AgentDefinition;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();

  const dimensionEmoji: Record<AgentDefinition['dimension'], string> = {
    philosophical: '🧠',
    emotional: '💚',
    creative: '🎨',
    ethical: '⚖️',
    social: '🤝',
    spiritual: '🧘',
    intellectual: '📚',
    practical: '🛠️',
    aesthetic: '🎭',
    political: '🏛️',
    scientific: '🔬',
    mystical: '✨',
  };

  const factionColors: Record<string, string> = {
    order: 'from-blue-600 to-blue-800',
    chaos: 'from-red-600 to-red-800',
    balance: 'from-purple-600 to-purple-800',
  };

  const levelIcons: Record<string, string> = {
    primordial: '🌟',
    mythic: '⭐',
    archetypal: '✨',
    human: '👤',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/agentes/${agent.id}`)}
      className={`relative group cursor-pointer rounded-2xl bg-gradient-to-br ${factionColors[agent.faction] || 'from-gray-600 to-gray-800'} p-1 transition-all duration-300 shadow-xl hover:shadow-2xl`}
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
      <div className="relative bg-gray-900 rounded-xl overflow-hidden h-full">
        {/* Container da Imagem com Fallback Visual */}
        <div className="relative h-64 w-full bg-gradient-to-br from-purple-600 via-blue-600 to-gray-900 flex items-center justify-center overflow-hidden">
          {/* Gradiente de Fundo (sempre visível) */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
          {/* Ícone/Emoji por Dimensão (Fallback Principal) */}
          <div className="relative z-10 text-center p-4">
            <div className="text-6xl mb-3">
              {dimensionEmoji[agent.dimension]}
            </div>
            <div className="text-white/90 text-lg font-bold mb-1">
              {agent.name}
            </div>
            <div className="text-white/60 text-xs capitalize">
              {agent.level} • {agent.faction}
            </div>
          </div>
          {/* Imagem Real (Opcional - Só carrega se existir) */}
          {/* Removido temporariamente até gerar imagens com API */}
        </div>

        {/* Badge de Nível */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs border border-white/10 flex items-center gap-1">
          <span>{levelIcons[agent.level] || '💠'}</span>
          <span className="capitalize">{agent.level}</span>
        </div>

        {/* Badge de Facção */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] uppercase tracking-wider border border-white/10">
          {agent.faction}
        </div>

        {/* Informações */}
        <div className="p-5 text-white">
          <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">{agent.name}</h3>
          <p className="text-xs text-purple-300 font-medium mb-3 uppercase tracking-widest">{agent.dimension}</p>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">{agent.personality.approach}</p>
          
          {/* Badge do Laboratório */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-900/50 border border-purple-500/30 px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-2 group-hover:bg-purple-800/60 transition-colors">
              <span className="text-base">{agent.badge.icon}</span>
              <span className="font-semibold text-purple-100">{agent.badge.name}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
