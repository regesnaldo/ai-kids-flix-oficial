import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dimensionPT: Record<string, string> = {
  philosophical: "Filosófico",
  emotional: "Emocional",
  creative: "Criativo",
  ethical: "Ético",
  social: "Social",
  spiritual: "Espiritual",
  intellectual: "Intelectual",
  practical: "Prático",
  aesthetic: "Estético",
  political: "Político",
  scientific: "Científico",
  mystical: "Místico",
};

const levelPT: Record<string, string> = {
  primordial: "Primordial",
  mythic: "Mítico",
  archetypal: "Arquetípico",
  human: "Humano",
};

const factionPT: Record<string, string> = {
  order: "Ordem",
  chaos: "Caos",
  balance: "Equilíbrio",
};

const specialNames: Record<string, string> = {
  logos: "LOGOS",
  psyche: "PSYCHE",
  ethos: "ETHOS",
  sophia: "SOPHIA",
  pathos: "PATHOS",
};

function generatePortugueseName(dimension: string, level: string, faction: string): string {
  return `${dimensionPT[dimension] || dimension} ${levelPT[level] || level} ${factionPT[faction] || faction}`;
}

const filePath = path.join(process.cwd(), "src", "canon", "agents", "all-agents.ts");
const original = readFileSync(filePath, "utf-8");

let updated = original;
let changed = false;

if (!updated.includes("function generatePortugueseName")) {
  const insertAfter = "const factions: AgentDefinition['faction'][] = ['order', 'chaos', 'balance'];";
  if (updated.includes(insertAfter)) {
    const mappingBlock = `\n\nconst dimensionNames = {\n  philosophical: '${dimensionPT.philosophical}',\n  emotional: '${dimensionPT.emotional}',\n  creative: '${dimensionPT.creative}',\n  ethical: '${dimensionPT.ethical}',\n  social: '${dimensionPT.social}',\n  spiritual: '${dimensionPT.spiritual}',\n  intellectual: '${dimensionPT.intellectual}',\n  practical: '${dimensionPT.practical}',\n  aesthetic: '${dimensionPT.aesthetic}',\n  political: '${dimensionPT.political}',\n  scientific: '${dimensionPT.scientific}',\n  mystical: '${dimensionPT.mystical}',\n} as const satisfies Record<AgentDefinition['dimension'], string>;\n\nconst levelNames = {\n  primordial: '${levelPT.primordial}',\n  mythic: '${levelPT.mythic}',\n  archetypal: '${levelPT.archetypal}',\n  human: '${levelPT.human}',\n} as const satisfies Record<AgentDefinition['level'], string>;\n\nconst factionNames = {\n  order: '${factionPT.order}',\n  chaos: '${factionPT.chaos}',\n  balance: '${factionPT.balance}',\n} as const satisfies Record<AgentDefinition['faction'], string>;\n\nfunction generatePortugueseName(\n  dimension: AgentDefinition['dimension'],\n  level: AgentDefinition['level'],\n  faction: AgentDefinition['faction']\n): string {\n  return \`\${dimensionNames[dimension]} \${levelNames[level]} \${factionNames[faction]}\`;\n}\n`;
    updated = updated.replace(insertAfter, `${insertAfter}${mappingBlock}`);
    changed = true;
  }
}

if (updated.includes("name: id.toUpperCase().replace(/_/g, ' '),")) {
  updated = updated.replace(
    "name: id.toUpperCase().replace(/_/g, ' '),",
    "name: generatePortugueseName(dim, lvl, fac),"
  );
  changed = true;
}

if (changed) {
  writeFileSync(filePath, updated, "utf-8");
}

const totalMatch = updated.match(/count\s*>=\s*(\d+)/);
const totalAgents = totalMatch ? Number(totalMatch[1]) : 120;

let specialCount = 0;
for (const id of Object.keys(specialNames)) {
  if (updated.includes(`id: '${id}'`) || updated.includes(`id: "${id}"`)) specialCount++;
}

console.log(`✅ Nomes de ${totalAgents} agentes verificados para português!`);
console.log(`ℹ️ Nomes próprios preservados: ${specialCount}`);
console.log(`📁 Arquivo verificado: ${path.relative(process.cwd(), filePath)}`);

export {};
