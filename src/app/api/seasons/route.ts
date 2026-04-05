import { NextResponse } from 'next/server';
import { agents } from '@/data/agents';

/**
 * API para retornar as temporadas (seasons) da Biblioteca Viva
 * Organiza os agentes por nível de aprendizado
 */
export async function GET() {
  try {
    // Definir as 4 temporadas baseadas nos níveis
    const seasons = [
      {
        id: 'fundamentos',
        name: 'Fundamentos',
        slug: 'fundamentos',
        agents: agents.filter(a => a.level === 'Fundamentos'),
      },
      {
        id: 'intermediario',
        name: 'Intermediário',
        slug: 'intermediario',
        agents: agents.filter(a => a.level === 'Intermediário'),
      },
      {
        id: 'avancado',
        name: 'Avançado',
        slug: 'avancado',
        agents: agents.filter(a => a.level === 'Avançado'),
      },
      {
        id: 'mestre',
        name: 'Mestre',
        slug: 'mestre',
        agents: agents.filter(a => a.level === 'Mestre'),
      },
    ];

    return NextResponse.json({ seasons });
  } catch (error) {
    console.error('[API /api/seasons] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar temporadas' },
      { status: 500 }
    );
  }
}
