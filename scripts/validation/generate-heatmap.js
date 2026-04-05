#!/usr/bin/env node 
const fs = require('fs'); 
const path = require('path'); 
 
const DEPS_FILE = path.join(__dirname, '../../docs/architecture/module-deps.json'); 
const OUTPUT_FILE = path.join(__dirname, '../../docs/architecture/heatmap-report.md'); 
 
const deps = JSON.parse(fs.readFileSync(DEPS_FILE, 'utf8')); 
 
// Calcular métricas de risco 
const metrics = Object.entries(deps).map(([file, imports]) => { 
  const outgoing = imports.length; 
  const incoming = Object.entries(deps).filter(([, imps]) => imps.includes(file)).length; 
  const total = outgoing + incoming; 
   
  return { 
    file, 
    outgoing, 
    incoming, 
    total, 
    risk: total > 10 ? 'CRÍTICO' : total > 5 ? 'ALTO' : total > 2 ? 'MÉDIO' : 'BAIXO' 
  }; 
}); 
 
// Ordenar por risco 
metrics.sort((a, b) => b.total - a.total); 
 
// Gerar relatório markdown 
const report = ` # 🔥 Heatmap de Risco Arquitetural — MENTE.AI 
 > Gerado automaticamente em: ${new Date().toLocaleString('pt-BR')} 
 
 ## 📊 Resumo 
 - Total de módulos analisados: ${metrics.length} 
 - Módulos de risco CRÍTICO: ${metrics.filter(m => m.risk === 'CRÍTICO').length} 
 - Módulos de risco ALTO: ${metrics.filter(m => m.risk === 'ALTO').length} 
 
 ## 🎯 Módulos de Maior Risco (Hot Spots) 
 
 | Arquivo | Entradas | Saídas | Total | Risco | 
 |---------|----------|--------|-------|-------| 
 ${metrics.slice(0, 20).map(m => `| \`${m.file}\` | ${m.incoming} | ${m.outgoing} | ${m.total} | ${m.risk === 'CRÍTICO' ? '🔴' : m.risk === 'ALTO' ? '🟠' : m.risk === 'MÉDIO' ? '🟡' : '🟢'} ${m.risk} |`).join('\n')} 
 
 ## ⚠️ Recomendações 
 
 ${metrics.filter(m => m.risk === 'CRÍTICO').length > 0 ? ` ### Módulos CRÍTICOS (requerem atenção imediata): 
 ${metrics.filter(m => m.risk === 'CRÍTICO').map(m => `- **\`${m.file}\`**: ${m.total} conexões. Considere dividir em submódulos.`).join('\n')}` : 'Nenhum módulo crítico identificado.'} 
 
 --- 
 *Relatório gerado por TRAE Build — Sistema de Prevenção MENTE.AI* 
 `; 
 
 fs.writeFileSync(OUTPUT_FILE, report); 
 console.log(`✅ Heatmap gerado: ${OUTPUT_FILE}`); 
