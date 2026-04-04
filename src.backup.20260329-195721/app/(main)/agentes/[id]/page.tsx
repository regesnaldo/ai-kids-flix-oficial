import { notFound } from 'next/navigation';
import { ALL_AGENTS } from '@/canon/agents/all-agents';
import AgentDetailClient from './AgentDetailClient';

interface AgentPageProps {  
  params: Promise<{ id: string }>;
}

export default async function AgentPage({ params }: AgentPageProps) {  
  const { id } = await params;
  const agent = ALL_AGENTS.find(a => a.id === id);
  if (!agent) {    
    notFound();  
  }

  return <AgentDetailClient agent={agent} />;
}
