'use client';

import Image from 'next/image';
import type { Agent } from '@/lib/agents';
import { getAgentImagePath } from '@/lib/agents';

interface AgentCardProps {
  agent: Agent;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function AgentCard({ agent, size = 'md', showName = true }: AgentCardProps) {
  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-48 h-72',
    lg: 'w-64 h-96',
  };

  const imageSizes = {
    sm: { width: 96, height: 144 },
    md: { width: 192, height: 288 },
    lg: { width: 256, height: 384 },
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden group cursor-pointer transition-transform hover:scale-105`}
      style={{
        boxShadow: `0 0 20px ${agent.colorHex}40, 0 0 40px ${agent.colorHex}20`,
      }}
    >
      <Image
        src={getAgentImagePath(agent.id)}
        alt={agent.name}
        width={imageSizes[size].width}
        height={imageSizes[size].height}
        className="object-cover w-full h-full"
        style={{ objectPosition: 'top center' }}
        unoptimized
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderColor: agent.colorHex }}
      />

      {showName && (
        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
          <h3
            className="text-sm font-bold tracking-wider"
            style={{ color: agent.colorHex, textShadow: `0 0 10px ${agent.colorHex}` }}
          >
            {agent.name}
          </h3>
        </div>
      )}
    </div>
  );
}
