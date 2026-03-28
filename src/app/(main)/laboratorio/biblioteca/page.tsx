import { agents } from '@/data/agents';
import BibliotecaVivaClient from '@/components/biblioteca/BibliotecaVivaClient';

export default function BibliotecaPage() {
  // Agrupar agentes por temporada/nível
  const seasons = [
    { id: 'fundamentos', name: 'Fundamentos', slug: 'fundamentos', agents: agents.filter((a: any) => a.level === 'Fundamentos') },
    { id: 'intermediario', name: 'Intermediário', slug: 'intermediario', agents: agents.filter((a: any) => a.level === 'Intermediário') },
    { id: 'avancado', name: 'Avançado', slug: 'avancado', agents: agents.filter((a: any) => a.level === 'Avançado') },
    { id: 'mestre', name: 'Mestre', slug: 'mestre', agents: agents.filter((a: any) => a.level === 'Mestre') },
  ].filter((s: any) => s.agents.length > 0);

  return <BibliotecaVivaClient agents={agents} seasons={seasons} />;
}
