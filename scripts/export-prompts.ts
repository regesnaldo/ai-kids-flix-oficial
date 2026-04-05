import { AGENTS_PROMPTS } from './src/canon/agents/agents-prompts';
import { writeFileSync } from 'fs';

const content = AGENTS_PROMPTS.map(p => 
  `# ${p.agentId}\n${p.prompt}\n`
).join('\n---\n\n');

writeFileSync('prompts-para-gemini.txt', content);
console.log('✅ Prompts salvos em: prompts-para-gemini.txt');
