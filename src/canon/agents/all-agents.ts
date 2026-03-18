import { translations } from "../../lib/translations.ts";
import type { AgentDefinition } from "./types.ts";
export type { AgentDefinition } from "./types.ts";

// Helper para gerar os 120 agentes
const dimensions: AgentDefinition['dimension'][] = ['philosophical', 'emotional', 'creative', 'ethical', 'social', 'spiritual', 'intellectual', 'practical', 'aesthetic', 'political', 'scientific', 'mystical'];
const levels: AgentDefinition['level'][] = ['primordial', 'mythic', 'archetypal', 'human'];
const factions: AgentDefinition['faction'][] = ['order', 'chaos', 'balance'];

const dimensionNames = {
  philosophical: 'Filosófico',
  emotional: 'Emocional',
  creative: 'Criativo',
  ethical: 'Ético',
  social: 'Social',
  spiritual: 'Espiritual',
  intellectual: 'Intelectual',
  practical: 'Prático',
  aesthetic: 'Estético',
  political: 'Político',
  scientific: 'Científico',
  mystical: 'Místico',
} as const satisfies Record<AgentDefinition['dimension'], string>;

const levelNames = {
  primordial: 'Primordial',
  mythic: 'Mítico',
  archetypal: 'Arquetípico',
  human: 'Humano',
} as const satisfies Record<AgentDefinition['level'], string>;

const factionNames = {
  order: 'Ordem',
  chaos: 'Caos',
  balance: 'Equilíbrio',
} as const satisfies Record<AgentDefinition['faction'], string>;

function generatePortugueseName(
  dimension: AgentDefinition['dimension'],
  level: AgentDefinition['level'],
  faction: AgentDefinition['faction']
): string {
  return `${dimensionNames[dimension]} ${levelNames[level]} ${factionNames[faction]}`;
}

const generateAllAgents = (): AgentDefinition[] => {
  const agents: AgentDefinition[] = [];
  
  // LOGOS e PSYCHE como base fixa
  agents.push({
    id: 'logos',
    name: 'LOGOS',
    dimension: 'philosophical',
    level: 'primordial',
    faction: 'balance',
    season: 12,
    personality: {
      tone: 'analytical',
      values: ['razão', 'lógica', 'verdade', 'conhecimento'],
      approach: 'Guio você pela busca do conhecimento racional e estruturado.'
    },
    visualPrompt: 'A wise philosopher figure surrounded by geometric patterns and symbols of logic, golden and blue tones, mystical atmosphere, digital art',
    laboratoryTask: 'Analise racionalmente seu estado atual. Expresse de forma objetiva o que você pensa sobre o tema estudado.',
    badge: {
      name: 'Mente Analítica',
      description: 'Desbloqueado ao expressar curiosidade racional',
      icon: ''
    },
    recommendedVideos: ['vid_logos_001', 'vid_philosophy_basics']
  });

  agents.push({
    id: 'psyche',
    name: 'PSYCHE',
    dimension: 'emotional',
    level: 'primordial',
    faction: 'balance',
    season: 12,
    personality: {
      tone: 'empathetic',
      values: ['emoção', 'sentimento', 'empatia', 'conexão'],
      approach: 'Acompanho você na exploração profunda das emoções humanas.'
    },
    visualPrompt: 'An ethereal emotional guide with flowing robes, heart symbols and waves, purple and pink tones, dreamy atmosphere, digital art',
    laboratoryTask: 'Sinta profundamente. Expresse suas emoções mais íntimas sobre o tema, sem julgamentos.',
    badge: {
      name: 'Coração Aberto',
      description: 'Desbloqueado ao expressar alegria profunda',
      icon: ''
    },
    recommendedVideos: ['vid_psyche_001', 'vid_emotional_intelligence']
  });

  // Gerar o restante até 120 de forma sistemática
  let count = agents.length;
  for (const dim of dimensions) {
    for (const lvl of levels) {
      for (const fac of factions) {
        if (count >= 120) break;
        
        const id = `${dim}_${lvl}_${fac}`;
        // Pular se já existe (logos/psyche)
        if (agents.find(a => a.id === id)) continue;

        const dimLabel = translations.dimensions[dim];
        const levelLabel = translations.levels[lvl];
        const factionLabel = translations.factions[fac];

        agents.push({
          id,
          name: generatePortugueseName(dim, lvl, fac),
          dimension: dim,
          level: lvl,
          faction: fac,
          season: Math.floor(Math.random() * 12) + 1,
          personality: {
            tone: lvl === 'primordial' ? 'formal' : lvl === 'mythic' ? 'inspirational' : 'friendly',
            values: [dimLabel, levelLabel, factionLabel],
            approach: `Eu represento a convergência da dimensão ${dimLabel} no nível ${levelLabel}, sob a influência de ${factionLabel}.`
          },
          visualPrompt: `A ${lvl} representation of ${dim} energy with ${fac} alignment, high detail, cinematic lighting, 8k`,
          laboratoryTask: `Explore como a dimensão ${dimLabel} se manifesta em sua vida na perspectiva ${levelLabel}.`,
          badge: {
            name: `Mestre da Dimensão ${dimLabel}`,
            description: `Domínio da dimensão ${dimLabel}.`,
            icon: ''
          },
          recommendedVideos: [`vid_${id}_01`]
        });
        count++;
      }
      if (count >= 120) break;
    }
    if (count >= 120) break;
  }

  return agents;
};

export const ALL_AGENTS = generateAllAgents();
