'use client';

import Link from 'next/link';
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

const AGE_LABELS: Record<string, string> = {
  all: 'Todos',
  teen: '+12',
  adult: '+18',
};

export function PostCard({ slug, title, summary, category, agentId, xpReward, ageRating, publishedAt }: PostCardProps) {
  const agent = agentId ? allAgents.find(a => a.id === agentId) : null;
  const readingTime = Math.max(1, Math.ceil((summary?.length || 300) / 200));

  return (
    <div className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div
          className="p-5 rounded-xl border transition-all duration-300"
          style={{
            background: 'var(--dark-card)',
            borderColor: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,245,255,0.02)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,245,255,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,245,255,0.02)';
          }}
        >
          {/* Category + Age */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                background: 'rgba(0,245,255,0.08)',
                color: 'var(--accent-cyan)',
              }}
            >
              {category}
            </span>
            <span className="text-[10px] text-white/25">{AGE_LABELS[ageRating] || ageRating}</span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-sm leading-snug mb-2 tracking-tight">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">
            {summary}
          </p>

          {/* Agent badge */}
          {agent && (
            <div className="flex items-center gap-2 mb-3 text-[10px]" style={{ color: agent.color }}>
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                style={{ background: `${agent.color}20` }}
              >
                {agent.name.charAt(0)}
              </div>
              {agent.name} comenta
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between text-[10px] text-white/30">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={10} /> {readingTime} min</span>
              <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--accent-cyan)' }}>
                <Zap size={10} /> +{xpReward} XP
              </span>
            </div>
            <span>{new Date(publishedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </Link>

      {/* WhatsApp share */}
      <div className="px-5 pb-3 -mt-1">
        <WhatsAppShare slug={slug} title={title} />
      </div>
    </div>
  );
}

/** Hero variant — full-width featured card with image area */
export function PostCardHero({ slug, title, summary, category, agentId, xpReward, ageRating, publishedAt, openingScene }: PostCardProps & { openingScene?: string | null }) {
  const agent = agentId ? allAgents.find(a => a.id === agentId) : null;
  const readingTime = Math.max(1, Math.ceil((summary?.length || 300) / 200));

  return (
    <div className="group">
      <Link href={`/blog/${slug}`} className="block">
        <div
          className="rounded-xl border overflow-hidden transition-all duration-300"
          style={{
            background: 'var(--dark-card)',
            borderColor: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,245,255,0.02)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = '0 6px 40px rgba(0,245,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,245,255,0.02)';
          }}
        >
          {/* Hero image area — gradient placeholder */}
          <div
            className="w-full h-52 md:h-72 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(0,245,255,0.01) 30%, var(--dark-bg) 100%)`,
            }}
          >
            {/* Abstract decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl" style={{ background: 'var(--accent-cyan)' }} />
              <div className="absolute bottom-4 right-16 w-48 h-48 rounded-full blur-3xl opacity-60" style={{ background: 'var(--accent-cyan)' }} />
            </div>
            {/* Gradient fade to card */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24"
              style={{ background: 'linear-gradient(to top, var(--dark-card), transparent)' }}
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: 'rgba(0,245,255,0.1)', color: 'var(--accent-cyan)' }}
              >
                DESTAQUE
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: 'rgba(0,245,255,0.06)', color: 'var(--accent-cyan)' }}
              >
                {category}
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-white text-2xl md:text-4xl font-black leading-tight mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h2>

            {/* Opening scene */}
            {openingScene && (
              <p className="text-white/50 text-base leading-relaxed italic mb-4">
                &ldquo;{openingScene.slice(0, 180)}{openingScene.length > 180 ? '...' : ''}&rdquo;
              </p>
            )}

            {/* Summary */}
            <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-2xl">
              {summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {agent && (
                <span className="flex items-center gap-1.5" style={{ color: agent.color }}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${agent.color}20` }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  {agent.name} &mdash; O Conector
                </span>
              )}
              <span className="flex items-center gap-1 text-white/30">
                <Clock size={12} /> {readingTime} min de leitura
              </span>
              <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--accent-cyan)' }}>
                <Zap size={12} /> +{xpReward} XP
              </span>
              <span className="text-white/25">{new Date(publishedAt).toLocaleDateString('pt-BR')}</span>
            </div>

            {/* WhatsApp share */}
            <div className="mt-5 pt-4 border-t border-white/[0.04]">
              <WhatsAppShare slug={slug} title={title} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
