import { writeFileSync } from 'fs';
import { ALL_AGENTS } from '../src/canon/agents/all-agents.ts';

// Gerar arquivo de tipos se não existir
const typeContent = `export interface AgentDefinition { 
  id: string; 
  name: string; 
  dimension: string; 
  level: string; 
  faction: string; 
  season: number; 
  personality: { 
    tone: string; 
    values: string[]; 
    approach: string; 
  }; 
  visualPrompt: string; 
  laboratoryTask: string; 
  badge: { 
    name: string; 
    description: string; 
    icon: string; 
  }; 
  recommendedVideos: string[]; 
}`;

writeFileSync('src/canon/agents/generated/types.ts', typeContent, 'utf-8');

// Gerar arquivos individuais para cada agente
ALL_AGENTS.forEach(agent => {
  const content = `// Agente: ${agent.name}
import type { AgentDefinition } from './types';

export const ${agent.id.toUpperCase().replace(/-/g, '_')}_AGENT: AgentDefinition = ${JSON.stringify(agent, null, 2)};`;

  writeFileSync(
    `src/canon/agents/generated/${agent.id}.ts`,
    content,
    'utf-8'
  );

  console.log(`✅ Agente gerado: ${agent.name}`);
});

console.log(`\n🎉 Total: ${ALL_AGENTS.length} agentes gerados com sucesso!`);
