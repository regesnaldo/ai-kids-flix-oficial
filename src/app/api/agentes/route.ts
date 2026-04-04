import { NextResponse } from 'next/server';
import { agents } from '@/data/agents';

/**
 * API para retornar todos os agentes disponíveis
 */
export async function GET() {
  try {
    return NextResponse.json({ 
      agentes: agents,
      total: agents.length,
    });
  } catch (error) {
    console.error('[API /api/agentes] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar agentes' },
      { status: 500 }
    );
  }
}
