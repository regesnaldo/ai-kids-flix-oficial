/**
 * profile-detector.ts — Detector de Perfil Narrativo do Usuário — MENTE.AI
 *
 * Analisa as respostas e padrões do usuário para identificar qual dos
 * 6 perfis narrativos melhor representa seu estado atual.
 * Funciona como a "triagem LangChain" descrita na Bíblia do Metaverso.
 */

import type { PerfilId, DimensaoId } from '@/types/narrativa';

interface SinalComportamental {
  texto: string;
  peso: number;  // -1 a 1
}

const SINAIS_POR_PERFIL: Record<PerfilId, SinalComportamental[]> = {
  'analitico-protetor': [
    { texto: 'como funciona', peso: 0.9 },
    { texto: 'quais os dados', peso: 0.9 },
    { texto: 'analisar', peso: 0.8 },
    { texto: 'verificar', peso: 0.8 },
    { texto: 'confirmar', peso: 0.7 },
    { texto: 'segurança', peso: 0.7 },
    { texto: 'risco', peso: 0.6 },
    { texto: 'preciso entender', peso: 0.8 },
  ],
  'rebelde-experimentador': [
    { texto: 'vamos tentar', peso: 0.9 },
    { texto: 'não acredito', peso: 0.8 },
    { texto: 'diferente', peso: 0.7 },
    { texto: 'quebrar', peso: 0.8 },
    { texto: 'experimentar', peso: 0.9 },
    { texto: 'sem regras', peso: 0.8 },
    { texto: 'por que não', peso: 0.7 },
    { texto: 'inovar', peso: 0.7 },
  ],
  'pacifico-conformista': [
    { texto: 'tudo bem', peso: 0.7 },
    { texto: 'concordo', peso: 0.8 },
    { texto: 'pode ser', peso: 0.6 },
    { texto: 'não sei', peso: 0.7 },
    { texto: 'talvez', peso: 0.6 },
    { texto: 'prefiro', peso: 0.5 },
    { texto: 'evitar', peso: 0.7 },
  ],
  'empatico-humanista': [
    { texto: 'sentir', peso: 0.8 },
    { texto: 'pessoas', peso: 0.9 },
    { texto: 'impacto', peso: 0.8 },
    { texto: 'juntos', peso: 0.8 },
    { texto: 'cuidar', peso: 0.9 },
    { texto: 'comunidade', peso: 0.8 },
    { texto: 'compreender', peso: 0.7 },
    { texto: 'empatia', peso: 0.9 },
  ],
  'estrategico-visioneiro': [
    { texto: 'longo prazo', peso: 0.9 },
    { texto: 'estratégia', peso: 0.9 },
    { texto: 'planejamento', peso: 0.8 },
    { texto: 'futuro', peso: 0.7 },
    { texto: 'otimizar', peso: 0.8 },
    { texto: 'sistema', peso: 0.8 },
    { texto: 'eficiência', peso: 0.7 },
    { texto: 'padrão', peso: 0.6 },
  ],
  'criativo-experimental': [
    { texto: 'ideia', peso: 0.9 },
    { texto: 'criar', peso: 0.9 },
    { texto: 'imaginar', peso: 0.8 },
    { texto: 'arte', peso: 0.8 },
    { texto: 'diferente', peso: 0.7 },
    { texto: 'novo', peso: 0.7 },
    { texto: 'inventar', peso: 0.9 },
    { texto: 'explorar', peso: 0.7 },
  ],
};

/** Detecta o perfil do usuário com base em um texto de mensagem */
export function detectarPerfilPorTexto(texto: string): PerfilId {
  const textNorm = texto.toLowerCase();
  const pontuacoes: Record<PerfilId, number> = {
    'analitico-protetor': 0,
    'rebelde-experimentador': 0,
    'pacifico-conformista': 0,
    'empatico-humanista': 0,
    'estrategico-visioneiro': 0,
    'criativo-experimental': 0,
  };

  for (const [perfil, sinais] of Object.entries(SINAIS_POR_PERFIL) as [PerfilId, SinalComportamental[]][]) {
    for (const sinal of sinais) {
      if (textNorm.includes(sinal.texto)) {
        pontuacoes[perfil] += sinal.peso;
      }
    }
  }

  const melhorPerfil = (Object.entries(pontuacoes) as [PerfilId, number][]).reduce(
    (best, [perfil, pontos]) => (pontos > best[1] ? [perfil, pontos] : best),
    ['analitico-protetor', 0] as [PerfilId, number],
  );

  return melhorPerfil[0];
}

/** Detecta a dimensão narrativa dominante em uma mensagem */
export function detectarDimensao(texto: string): DimensaoId {
  const textNorm = texto.toLowerCase();

  const emocional = ['sentir', 'medo', 'coragem', 'raiva', 'amor', 'feliz', 'triste', 'ansioso', 'curioso', 'quero'].filter(
    (p) => textNorm.includes(p),
  ).length;

  const intelectual = ['como', 'por que', 'funciona', 'lógica', 'analisar', 'dados', 'pesquisa', 'hipótese', 'método', 'sistema'].filter(
    (p) => textNorm.includes(p),
  ).length;

  const moral = ['certo', 'errado', 'deve', 'ético', 'justo', 'responsável', 'impacto', 'proteger', 'decidir', 'consequência'].filter(
    (p) => textNorm.includes(p),
  ).length;

  if (moral >= emocional && moral >= intelectual) return 'D3_MORAL';
  if (intelectual >= emocional) return 'D2_INTELECTUAL';
  return 'D1_EMOCIONAL';
}

/** Calcula confiança do perfil detectado (0-1) */
export function calcularConfiancaPerfil(
  textos: string[],
  perfil: PerfilId,
): number {
  if (textos.length === 0) return 0;
  const pontosTotais = textos.reduce((acc, texto) => {
    const pontuacoes: Record<PerfilId, number> = {
      'analitico-protetor': 0,
      'rebelde-experimentador': 0,
      'pacifico-conformista': 0,
      'empatico-humanista': 0,
      'estrategico-visioneiro': 0,
      'criativo-experimental': 0,
    };
    const sinais = SINAIS_POR_PERFIL[perfil];
    for (const sinal of sinais) {
      if (texto.toLowerCase().includes(sinal.texto)) {
        pontuacoes[perfil] += sinal.peso;
      }
    }
    return acc + pontuacoes[perfil];
  }, 0);

  return Math.min(pontosTotais / (textos.length * 3), 1);
}

