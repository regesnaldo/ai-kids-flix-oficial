export interface AgentDefinition { 
  id: string; 
  name: string; 
  dimension: 'philosophical' | 'emotional' | 'creative' | 'ethical' | 'social' | 'spiritual' | 'intellectual' | 'practical' | 'aesthetic' | 'political' | 'scientific' | 'mystical'; 
  level: 'primordial' | 'mythic' | 'archetypal' | 'human'; 
  faction: 'order' | 'chaos' | 'balance'; 
  season: number; // 1-12 
  personality: { 
    tone: 'formal' | 'friendly' | 'challenging' | 'empathetic' | 'analytical' | 'inspirational'; 
    values: string[]; 
    approach: string; 
  }; 
  visualPrompt: string; // Prompt para gerar imagem 
  laboratoryTask: string; // Tarefa específica no laboratório 
  badge: { 
    name: string; 
    description: string; 
    icon: string; 
  }; 
  recommendedVideos: string[]; // IDs de vídeos 
} 

// Helper para gerar os 120 agentes
const dimensions: AgentDefinition['dimension'][] = ['philosophical', 'emotional', 'creative', 'ethical', 'social', 'spiritual', 'intellectual', 'practical', 'aesthetic', 'political', 'scientific', 'mystical'];
const levels: AgentDefinition['level'][] = ['primordial', 'mythic', 'archetypal', 'human'];
const factions: AgentDefinition['faction'][] = ['order', 'chaos', 'balance'];

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
      icon: '🧠'
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
      icon: '💚'
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

        agents.push({
          id,
          name: id.toUpperCase().replace(/_/g, ' '),
          dimension: dim,
          level: lvl,
          faction: fac,
          season: Math.floor(Math.random() * 12) + 1,
          personality: {
            tone: lvl === 'primordial' ? 'formal' : lvl === 'mythic' ? 'inspirational' : 'friendly',
            values: [dim, lvl, fac],
            approach: `Eu represento a convergência de ${dim} no nível ${lvl} sob a influência de ${fac}.`
          },
          visualPrompt: `A ${lvl} representation of ${dim} energy with ${fac} alignment, high detail, cinematic lighting, 8k`,
          laboratoryTask: `Explore como ${dim} se manifesta em sua vida através da perspectiva ${lvl}.`,
          badge: {
            name: `${id} Master`,
            description: `Mestre da dimensão ${dim}`,
            icon: '✨'
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
