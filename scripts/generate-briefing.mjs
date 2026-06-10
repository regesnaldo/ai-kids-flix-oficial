/**
 * generate-briefing.mjs — Gera snapshot do projeto MENTE.AI para análise externa
 * Uso: node scripts/generate-briefing.mjs
 * Saída: openhuman-briefing.md (raiz do projeto)
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'openhuman-briefing.md');
const SRC = join(ROOT, 'src');

const FOCUS_FILES = [
  'src/app/api/chat/route.ts',
  'src/app/api/agents/chat/route.ts',
  'src/engine/router.ts',
  'src/engine/narrative-engine.ts',
  'src/engine/agent-conflicts.ts',
  'src/engine/narrative-transitions.ts',
  'src/engine/phase-router.ts',
  'src/engine/profiler.ts',
  'src/lib/engine/conflicts.ts',
  'src/lib/agents/conflict-engine.ts',
  'src/lib/agent-runner.ts',
  'src/lib/db/index.ts',
  'src/lib/db/schema.ts',
  'src/canon/agents/canon.ts',
  'src/canon/agents/all-agents.ts',
];

function getFileInfo(relPath) {
  const full = join(ROOT, relPath);
  try {
    const content = readFileSync(full, 'utf-8');
    const lines = content.split('\n').length;
    const exports = [...content.matchAll(/^export (async )?(function|const|class|interface|type) (\w+)/gm)]
      .map(m => m[3]);
    const imports = [...content.matchAll(/^import .+ from ['"].+['"]/gm)];
    return { lines, exports, importCount: imports.length, hasDeprecated: content.includes('DEPRECATED') || content.includes('deprecated') };
  } catch {
    return { lines: 0, exports: [], importCount: 0, hasDeprecated: false };
  }
}

function countLines(dir) {
  let total = 0;
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.')) walk(p);
      else if (entry.isFile() && entry.name.endsWith('.ts')) {
        try {
          total += readFileSync(p, 'utf-8').split('\n').length;
        } catch { /* skip */ }
      }
    }
  };
  walk(dir);
  return total;
}

function getAgentCount() {
  const canon = join(SRC, 'canon/agents/canon.ts');
  try {
    const content = readFileSync(canon, 'utf-8');
    return (content.match(/^\s+[a-z]+:\s*\{/gm) || []).length;
  } catch { return 0; }
}

function getPackageJson() {
  const pj = join(ROOT, 'package.json');
  try {
    const data = JSON.parse(readFileSync(pj, 'utf-8'));
    return {
      name: data.name,
      version: data.version,
      scripts: Object.keys(data.scripts || {}),
      deps: Object.keys(data.dependencies || {}).length,
      devDeps: Object.keys(data.devDependencies || {}).length,
    };
  } catch { return {}; }
}

const pkg = getPackageJson();
const totalLines = countLines(SRC);
const agentCount = getAgentCount();

let md = `# MENTE.AI — Project Briefing (auto-generated)
> Gerado em ${new Date().toISOString()}
> ${pkg.name} v${pkg.version}

## Visão Geral
- **Stack**: Next.js + TypeScript + Drizzle ORM + MySQL/TiDB
- **Agentes**: ${agentCount}
- **Total de linhas TS**: ~${totalLines}
- **Dependências**: ${pkg.deps} production, ${pkg.devDeps} development
- **Scripts**: ${(pkg.scripts || []).join(', ')}

## Arquivos Foco

| Arquivo | Linhas | Exports | Imports | Deprecated |
|---------|--------|---------|---------|------------|
`;

for (const f of FOCUS_FILES) {
  const info = getFileInfo(f);
  md += `| ${f} | ${info.lines} | ${info.exports.join(', ')} | ${info.importCount} | ${info.hasDeprecated ? '⚠️' : ''} |\n`;
}

md += `\n## Estado dos Arquivos\n\n`;

for (const f of FOCUS_FILES) {
  const info = getFileInfo(f);
  const content = readFileSync(join(ROOT, f), 'utf-8');
  md += `### ${f} (${info.lines} linhas)\n`;
  md += `**Exports:** ${info.exports.join(', ') || '(nenhum)'}\n`;
  md += `**Deprecated:** ${info.hasDeprecated ? 'SIM' : 'não'}\n\n`;

  // First 10 lines as summary
  const head = content.split('\n').slice(0, 8).join('\n').trim();
  md += `\`\`\`typescript\n${head}\n...\n\`\`\`\n\n`;
  md += `---\n\n`;
}

md += `\n*Gerado por generate-briefing.mjs — execute novamente para atualizar*\n`;

writeFileSync(OUT, md, 'utf-8');
console.log(`Briefing gerado: ${OUT} (${md.length} caracteres)`);
