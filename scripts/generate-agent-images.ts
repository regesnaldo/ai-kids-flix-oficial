import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { AGENTS_PROMPTS } from "../src/canon/agents/agents-prompts.ts";
import { ALL_AGENTS } from "../src/canon/agents/all-agents.ts";
import { checkUsage, generateImage } from "../src/lib/nano-banana.ts";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const PROVIDER = (process.env.IMAGE_PROVIDER || process.env.IMAGE_GENERATION_PROVIDER || "nano-banana").toLowerCase();

type Config = {
  outputDir: string;
  batchSize: number;
  pauseBetweenBatchesMs: number;
  delayBetweenImagesMs: number;
  maxPerHour: number;
  width: number;
  height: number;
};

function intEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseArgs(argv: string[]): Partial<Config> {
  const overrides: Partial<Config> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (!next) continue;

    if (arg === "--batch") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) overrides.batchSize = parsed;
      i++;
      continue;
    }
    if (arg === "--pause-ms") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) overrides.pauseBetweenBatchesMs = parsed;
      i++;
      continue;
    }
    if (arg === "--delay-ms") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) overrides.delayBetweenImagesMs = parsed;
      i++;
      continue;
    }
    if (arg === "--max-per-hour") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) overrides.maxPerHour = parsed;
      i++;
      continue;
    }
    if (arg === "--width") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) overrides.width = parsed;
      i++;
      continue;
    }
    if (arg === "--height") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) overrides.height = parsed;
      i++;
      continue;
    }
    if (arg === "--output-dir") {
      overrides.outputDir = next;
      i++;
      continue;
    }
  }
  return overrides;
}

const OUTPUT_DIR = path.join(process.cwd(), "public", "agents");

const pauseFallback = PROVIDER === "google" || PROVIDER === "imagen" ? 120000 : 180000;
const delayFallback = PROVIDER === "google" || PROVIDER === "imagen" ? 3000 : 5000;

const baseConfig: Config = {
  outputDir: OUTPUT_DIR,
  batchSize: intEnv("IMAGE_BATCH_SIZE", 10),
  pauseBetweenBatchesMs: intEnv("IMAGE_PAUSE_MS", pauseFallback),
  delayBetweenImagesMs: intEnv("IMAGE_DELAY_MS", delayFallback),
  maxPerHour: intEnv("MAX_PER_HOUR", 20),
  width: intEnv("IMAGE_WIDTH", 1024),
  height: intEnv("IMAGE_HEIGHT", 1024),
};

const config: Config = { ...baseConfig, ...parseArgs(process.argv.slice(2)) };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type GoogleAiStudioConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

function getGoogleConfig(): GoogleAiStudioConfig {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY || "";
  const baseUrl = process.env.GOOGLE_AI_STUDIO_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
  const model = process.env.GOOGLE_AI_STUDIO_MODEL || "imagen-3.0-generate-001";
  return { apiKey, baseUrl, model };
}

async function generateWithGoogleAiStudio(prompt: string, outputPath: string): Promise<void> {
  const cfg = getGoogleConfig();
  if (!cfg.apiKey) throw new Error("GOOGLE_AI_STUDIO_API_KEY não configurada");

  const url = `${cfg.baseUrl}/models/${cfg.model}:predict?key=${encodeURIComponent(cfg.apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: `Digital art, cinematic, mystical, high quality: ${prompt}` }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        safetySetting: "BLOCK_NONE",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Unknown error");
    throw new Error(`Google API error: ${response.status} - ${error}`);
  }

  const data: any = await response.json();
  const base64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (typeof base64 !== "string" || !base64) throw new Error("No image data in response");
  writeFileSync(outputPath, Buffer.from(base64, "base64"));
}

async function generateAllImages() {
  const isGoogle = PROVIDER === "google" || PROVIDER === "imagen";
  const isNanoBanana = PROVIDER === "nano-banana" || PROVIDER === "nanobanana";

  if (isGoogle) {
    const googleCfg = getGoogleConfig();
    if (!googleCfg.apiKey) {
      console.error("❌ ERRO: GOOGLE_AI_STUDIO_API_KEY não configurada!");
      console.error("\nAdicione no .env.local:");
      console.error("  GOOGLE_AI_STUDIO_API_KEY=sua-chave-aqui");
      console.error("  GOOGLE_AI_STUDIO_BASE_URL=https://generativelanguage.googleapis.com/v1beta  (opcional)");
      console.error("  GOOGLE_AI_STUDIO_MODEL=imagen-3.0-generate-001  (opcional)");
      process.exit(1);
    }
  } else if (isNanoBanana) {
    if (!process.env.NANO_BANANA_API_KEY) {
      console.error("❌ ERRO: NANO_BANANA_API_KEY não configurada!");
      console.error("\nAdicione no .env.local:");
      console.error("  NANO_BANANA_API_KEY=sua-chave-pro-aqui");
      console.error("  NANO_BANANA_BASE_URL=https://api.nanobanana.ai/v1  (opcional)");
      console.error("  NANO_BANANA_MODEL=pro-generator-v2  (opcional)");
      process.exit(1);
    }
  } else {
    console.error(`❌ ERRO: IMAGE_PROVIDER inválido: ${PROVIDER}`);
    console.error("Use IMAGE_PROVIDER=google (ou imagen) ou IMAGE_PROVIDER=nano-banana.");
    process.exit(1);
  }

  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║  MENTE.AI — Geração de Imagens dos Agentes            ║");
  console.log("╚═══════════════════════════════════════════════════════╝");
  console.log("");

  if (isNanoBanana) {
    const usage = await checkUsage();
    if (usage) {
      const used = typeof (usage as any).used === "number" ? (usage as any).used : undefined;
      const limit = typeof (usage as any).limit === "number" ? (usage as any).limit : undefined;
      const resetIn = (usage as any).resetIn;
      const headline = used !== undefined && limit !== undefined ? `Uso: ${used}/${limit}` : "Uso: disponível";
      console.log(`📊 ${headline}`);
      if (resetIn) console.log(`🔄 Reset em: ${resetIn}`);
      console.log("");
    }
  }

  console.log(`📊 Total de agentes: ${ALL_AGENTS.length}`);
  console.log(`📐 Tamanho: ${config.width}x${config.height}`);
  console.log(`🔋 Lotes: ${config.batchSize} imagens + ${Math.round(config.pauseBetweenBatchesMs / 1000)}s pausa`);
  console.log(`⏱️  Delay: ${Math.round(config.delayBetweenImagesMs / 1000)}s entre imagens`);
  console.log(`🛑 Limite: ${config.maxPerHour} imagens/hora`);
  console.log(`🔌 Provedor: ${isGoogle ? "Google AI Studio (Imagen)" : "Nano Banana Pro"}`);
  console.log("");

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;
  let missingPromptCount = 0;

  const toGenerate = ALL_AGENTS.filter((agent) => {
    const outputPath = path.join(config.outputDir, `${agent.id}.png`);
    if (existsSync(outputPath)) {
      skipCount++;
      return false;
    }
    return true;
  });

  console.log(`⏭️  Pulados: ${skipCount} | 🎨 Para gerar: ${toGenerate.length}`);
  console.log("");

  if (toGenerate.length === 0) {
    console.log("✅ Todas as imagens já existem!");
    return;
  }

  let windowStart = Date.now();
  let generatedThisWindow = 0;

  const ensureHourlyLimit = async () => {
    const now = Date.now();
    if (now - windowStart >= 60 * 60 * 1000) {
      windowStart = now;
      generatedThisWindow = 0;
      return;
    }

    if (generatedThisWindow < config.maxPerHour) return;

    const waitMs = windowStart + 60 * 60 * 1000 - now + 1000;
    console.log("");
    console.log(`⏳ Limite por hora atingido. Aguardando ${Math.ceil(waitMs / 1000)}s...`);
    await sleep(waitMs);
    windowStart = Date.now();
    generatedThisWindow = 0;
    console.log("");
  };

  for (let i = 0; i < toGenerate.length; i += config.batchSize) {
    const batch = toGenerate.slice(i, i + config.batchSize);
    const batchNumber = Math.floor(i / config.batchSize) + 1;
    const isLastBatch = i + config.batchSize >= toGenerate.length;

    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log(`║  LOTE ${batchNumber} — ${batch.length} imagens                           ║`);
    console.log("╚═══════════════════════════════════════════════════════╝");

    for (let j = 0; j < batch.length; j++) {
      const agent = batch[j];
      const prompt = AGENTS_PROMPTS.find((p) => p.agentId === agent.id);
      const outputPath = path.join(config.outputDir, `${agent.id}.png`);

      if (!prompt) {
        console.log(`  ⚠️  ${agent.name} — Prompt não encontrado`);
        missingPromptCount++;
        continue;
      }

      console.log(`  [${i + j + 1}/${toGenerate.length}] ${agent.name}...`);

      try {
        await ensureHourlyLimit();

        if (isGoogle) {
          await generateWithGoogleAiStudio(prompt.prompt, outputPath);
        } else {
          const buffer = await generateImage({
            prompt: prompt.prompt,
            negativePrompt: prompt.negativePrompt,
            width: config.width,
            height: config.height,
            style: prompt.style,
          });
          writeFileSync(outputPath, buffer);
        }
        console.log(`  ✅ ${agent.name} — OK`);
        successCount++;
        generatedThisWindow++;

        if (j < batch.length - 1) {
          await sleep(config.delayBetweenImagesMs);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  ❌ ${agent.name} — ERRO: ${message}`);
        failCount++;
      }
    }

    if (!isLastBatch) {
      console.log("");
      console.log(`⏳ Pausa de ${Math.round(config.pauseBetweenBatchesMs / 1000)}s para recarregar...`);
      await sleep(config.pauseBetweenBatchesMs);
      console.log("");
    }
  }

  console.log("");
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║  RESUMO DA GERAÇÃO                                    ║");
  console.log("╚═══════════════════════════════════════════════════════╝");
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`⚠️  Sem prompt: ${missingPromptCount}`);
  console.log(`⏭️  Pulados: ${skipCount}`);
  console.log(`📁 Diretório: ${path.relative(process.cwd(), config.outputDir)}`);
  console.log("");
  if (successCount > 0) console.log("Imagens geradas com sucesso!");
}

generateAllImages().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
