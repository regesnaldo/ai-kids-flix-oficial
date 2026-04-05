#!/usr/bin/env node 
const fs = require('fs'); 
const path = require('path'); 
 
const CIRCULAR_FILE = path.join(__dirname, '../../docs/architecture/circular-deps.json'); 
 
if (!fs.existsSync(CIRCULAR_FILE)) { 
  console.error('❌ Arquivo de dependências circulares não encontrado.'); 
  console.error('   Execute primeiro: npm run arch:circular'); 
  process.exit(1); 
} 
 
const report = JSON.parse(fs.readFileSync(CIRCULAR_FILE, 'utf8')); 
 
if (report.length > 0) { 
  console.error('╔════════════════════════════════════════════════════════════╗'); 
  console.error('║  ❌ DEPENDÊNCIAS CIRCULARES DETECTADAS — COMMIT BLOQUEADO  ║'); 
  console.error('╚════════════════════════════════════════════════════════════╝'); 
  console.error(''); 
   
  report.forEach((cycle, i) => { 
    console.error(`  🔴 Ciclo ${i + 1}:`); 
    cycle.forEach((file, j) => { 
      const arrow = j === cycle.length - 1 ? '   └─►' : '   ├──'; 
      console.error(`      ${arrow} ${file}`); 
    }); 
    console.error(''); 
  }); 
   
  console.error('🛑 AÇÃO REQUERIDA:'); 
  console.error('   1. Analise os ciclos acima'); 
  console.error('   2. Refatore para quebrar a circularidade'); 
  console.error('   3. Execute: npm run arch:circular novamente'); 
  console.error('   4. Somente então prossiga com o commit'); 
   
  process.exit(1); 
} else { 
  console.log('✅ Nenhuma dependência circular encontrada.'); 
  console.log('   Arquitetura limpa. Commit liberado.'); 
  process.exit(0); 
} 
