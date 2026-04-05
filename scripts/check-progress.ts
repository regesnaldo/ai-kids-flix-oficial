import { existsSync, readdirSync } from "fs";
import path from "path";
import { ALL_AGENTS } from "../src/canon/agents/all-agents.ts";

const outputDir = path.join(process.cwd(), "public", "agents");

type Result = {
  total: number;
  existing: number;
  missing: number;
  missingAgents: { id: string; name: string }[];
  extraFiles: string[];
};

function computeProgress(): Result {
  const total = ALL_AGENTS.length;
  const missingAgents: { id: string; name: string }[] = [];

  let existing = 0;
  for (const agent of ALL_AGENTS) {
    const filePath = path.join(outputDir, `${agent.id}.png`);
    if (existsSync(filePath)) existing++;
    else missingAgents.push({ id: agent.id, name: agent.name });
  }

  const expected = new Set(ALL_AGENTS.map((a) => `${a.id}.png`));
  const extraFiles = existsSync(outputDir)
    ? readdirSync(outputDir)
        .filter((f) => f.toLowerCase().endsWith(".png"))
        .filter((f) => !expected.has(f))
    : [];

  return { total, existing, missing: missingAgents.length, missingAgents, extraFiles };
}

const result = computeProgress();
const percent = result.total > 0 ? Math.round((result.existing / result.total) * 100) : 0;

console.log("╔═══════════════════════════════════════════════════════╗");
console.log("║  MENTE.AI — Progresso de Imagens (public/agents)      ║");
console.log("╚═══════════════════════════════════════════════════════╝");
console.log("");
console.log(`📊 Total: ${result.total}`);
console.log(`✅ Existentes: ${result.existing}`);
console.log(`❌ Faltando: ${result.missing}`);
console.log(`📈 Progresso: ${percent}%`);

if (result.extraFiles.length > 0) {
  console.log("");
  console.log(`🗂️  Arquivos .png extras: ${result.extraFiles.length}`);
}

if (result.missingAgents.length > 0) {
  console.log("");
  console.log("🔻 Primeiros faltando:");
  for (const item of result.missingAgents.slice(0, 20)) {
    console.log(`- ${item.id} — ${item.name}`);
  }
  if (result.missingAgents.length > 20) {
    console.log(`... e mais ${result.missingAgents.length - 20}`);
  }
}

