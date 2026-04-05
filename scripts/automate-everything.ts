import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('\n' + '='.repeat(60));
console.log('🚀  INICIANDO AUTOMAÇÃO MESTRE MENTE.AI  🚀');
console.log('='.repeat(60) + '\n');

const steps = [
  { 
    name: 'Gerar 120 Agentes Mentais', 
    command: 'npx ts-node --esm scripts/generate-agents.ts' 
  },
  { 
    name: 'Gerar Imagens dos Agentes (AI)', 
    command: 'npx ts-node --esm scripts/generate-agent-images.ts' 
  },
  { 
    name: 'Validar Integridade Arquitetural', 
    command: 'npm run arch:validate' 
  },
  { 
    name: 'Executar Suíte de Testes Unitários (Jest)', 
    command: 'npm run test' 
  },
  { 
    name: 'Executar Testes de Integração (Playwright)', 
    command: 'npm run test:e2e' 
  },
  { 
    name: 'Compilar Projeto (Build Production)', 
    command: 'npm run build' 
  },
  { 
    name: 'Gerar Documentação Automática (README)', 
    command: 'npx ts-node --esm scripts/generate-readme.ts' 
  },
];

let completedSteps = 0;
let failedSteps: string[] = [];

steps.forEach((step, index) => {
  console.log(`\n[${index + 1}/${steps.length}] ${step.name}...`);
  console.log('─'.repeat(50));
  
  try {
    execSync(step.command, { stdio: 'inherit' });
    console.log(`\n✅ CONCLUÍDO: ${step.name}`);
    completedSteps++;
  } catch (error) {
    console.error(`\n❌ FALHOU: ${step.name}`);
    failedSteps.push(step.name);
  }
});

const report = `
============================================================
📊 RELATÓRIO FINAL DE AUTOMAÇÃO — MENTE.AI
============================================================
Data/Hora: ${new Date().toLocaleString('pt-BR')}
Status: ${failedSteps.length === 0 ? '💚 SUCESSO TOTAL' : '🔴 FALHAS DETECTADAS'}

✅ Passos Concluídos: ${completedSteps}/${steps.length}
❌ Passos com Falha:  ${failedSteps.length}

${failedSteps.length > 0 ? `⚠️ Detalhes das Falhas:\n${failedSteps.map(s => ` - ${s}`).join('\n')}` : '🎉 Todos os sistemas estão operacionais!'}

🌐 Produção: https://mente-ai.vercel.app
📹 Demo: tests/e2e/record-demo.spec.ts (Disponível via npm run demo:record)
📚 Docs: README.md atualizado com as últimas mudanças
============================================================
`;

console.log(report);
writeFileSync('automation-log.txt', report, 'utf-8');
console.log('📝 Log salvo em: automation-log.txt\n');
