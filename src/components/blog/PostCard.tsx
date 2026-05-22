'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Zap, User } from 'lucide-react';
import { WhatsAppShare } from './WhatsAppShare';
import { allAgents } from '@/data/all-agents';

interface PostCardProps {
  slug: string;
  title: string;
  summary: string;
  category: string;
  agentId: string | null;
  xpReward: number;
  ageRating: string;
  publishedAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'IA Geral': 'var(--neon-cyan)',
  'Negócios': 'var(--neon-purple)',
  'Crianças': 'var(--neon-pink)',
  'Ética': '#10B981',
  'Futuro': '#F59E0B',
  'Ferramentas': '#3B82F6',
};

const AGE_LABELS: Record<string, string> = {
  all: 'Todos',
  teen: '+12',
  adult: '+18',
};

export function PostCard({ slug, title, summary, category, agentId, xpReward, ageRating, publishedAt }: PostCardProps) {
  const agent = agentId ? allAgents.find(a => a.id === agentId) : null;
  const catColor = CATEGORY_COLORS[category] || 'var(--neon-cyan)';
  const readingTime = Math.max(1, Math.ceil((summary?.length || 300) / 200));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="p-5 rounded-xl border border-white/5 transition-all duration-300 hover:border-white/15" style={{ background: 'rgba(255,255,255,0.02)' }}>
          {/* Category + Age */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${catColor}15`, color: catColor }}>
              {category}
            </span>
            <span className="text-[10px] text-gray-600">{AGE_LABELS[ageRating] || ageRating}</span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-sm leading-snug mb-2 group-hover:underline">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
            {summary}
          </p>

          {/* Agent commentary badge */}
          {agent && (
            <div className="flex items-center gap-2 mb-3 text-[10px]" style={{ color: agent.color }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: `${agent.color}20` }}>
                {agent.name.charAt(0)}
              </div>
              {agent.name} comenta
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={10} /> {readingTime} min</span>
              <span className="flex items-center gap-1" style={{ color: 'var(--neon-cyan)' }}><Zap size={10} /> +{xpReward} XP</span>
            </div>
            <span>{new Date(publishedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </Link>

      {/* WhatsApp share (outside Link) */}
      <div className="px-5 pb-3 -mt-1">
        <WhatsAppShare slug={slug} title={title} />
      </div>
    </motion.div>
  );
}

/** Hero variant — larger card for featured post */
export function PostCardHero({ slug, title, summary, category, agentId, xpReward, ageRating, publishedAt, openingScene }: PostCardProps & { openingScene?: string | null }) {
  const agent = agentId ? allAgents.find(a => a.id === agentId) : null;
  const catColor = CATEGORY_COLORS[category] || 'var(--neon-cyan)';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div className="p-6 rounded-xl border border-white/5 transition-all duration-300 hover:border-white/15" style={{ background: `linear-gradient(135deg, ${catColor}08 0%, rgba(255,255,255,0.02) 100%)` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${catColor}20`, color: catColor }}>
              DESTAQUE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${catColor}10`, color: catColor }}>
              {category}
            </span>
          </div>
          <h2 className="text-white text-xl md:text-2xl font-black leading-tight mb-3 group-hover:underline">{title}</h2>
          {openingScene && <p className="text-gray-500 text-sm leading-relaxed italic mb-3">&ldquo;{openingScene}&rdquo;</p>}
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{summary}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {agent && <span className="flex items-center gap-1" style={{ color: agent.color }}><User size={12} /> {agent.name}</span>}
            <Zap size={12} style={{ color: 'var(--neon-cyan)' }} />
            <span style={{ color: 'var(--neon-cyan)' }}>+{xpReward} XP ao ler</span>
            <WhatsAppShare slug={slug} title={title} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
