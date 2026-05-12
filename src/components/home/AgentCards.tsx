'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['600', '700'] });

export interface HomeAgent {
  id: string;
  name: string;
  role: string;
  universeColor: string;
  trigger: string;
  preview?: string;
}

interface AgentCardsProps {
  agents: HomeAgent[];
}

export default function AgentCards({ agents }: AgentCardsProps) {
  const router = useRouter();

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Universos Ativos</h2>
        <span className="text-xs text-white/50">Cinematic hover preview</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const glow = `0 18px 48px ${agent.universeColor}40`;
          return (
            <motion.button
              key={agent.id}
              type="button"
              onClick={() => router.push(`/agentes/${agent.id}`)}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1126] text-left"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: glow }} />

              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={agent.preview || `/images/agentes/${agent.id}.png`}
                  alt={agent.name}
                  className="h-full w-full object-cover object-top opacity-85 transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1126] via-[#0d112680] to-transparent" />
              </div>

              <div className="relative space-y-2 px-4 pb-4 pt-3">
                <div className="inline-flex rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white/65">
                  {agent.role}
                </div>
                <h3 className={`${orbitron.className} text-lg text-white`}>{agent.name}</h3>
                <div className="text-xs text-white/65">
                  Trigger: <span className="text-[var(--cognitive-accent)]">{agent.trigger}</span>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-white/15 bg-[#0a0a1acc] px-2 py-1 text-[11px] text-white/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {agent.role} • {agent.trigger}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
