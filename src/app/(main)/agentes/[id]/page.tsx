import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_AGENTS } from '@/canon/agents/all-agents';
import AgentDetailClient from './AgentDetailClient';

interface AgentPageProps {  
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = ALL_AGENTS.find(a => a.id === id);
  if (!agent) return { title: 'Agente não encontrado' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-kids-flix.vercel.app';
  const title = `${agent.name} | MENTE.AI`;
  const description = agent.personality.approach.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteUrl}/agentes/${agent.id}`,
      images: [{ url: `${siteUrl}/images/agentes/${agent.id}.png`, width: 512, height: 512, alt: agent.name }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [`${siteUrl}/images/agentes/${agent.id}.png`],
    },
  };
}

export default async function AgentPage({ params }: AgentPageProps) {  
  const { id } = await params;
  const agent = ALL_AGENTS.find(a => a.id === id);
  if (!agent) {    
    notFound();  
  }

  return <AgentDetailClient agent={agent} />;
}
