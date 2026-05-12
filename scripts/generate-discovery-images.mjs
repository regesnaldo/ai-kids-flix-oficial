import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
if (!apiKey) {
  console.error("GOOGLE_AI_STUDIO_API_KEY não configurada.");
  process.exit(1);
}

const baseUrl = process.env.GOOGLE_AI_STUDIO_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
const model = process.env.GOOGLE_AI_STUDIO_MODEL || "imagen-4.0-generate-001";

const prompts = [
  {
    file: "agent-01.png",
    prompt:
      "Futuristic AI brain entity, glowing neural networks, purple and blue cyberpunk style, Netflix character design, digital art portrait, high tech holographic elements, intelligent glowing eyes, head and shoulders, 300x400px",
  },
  {
    file: "agent-02.png",
    prompt:
      "Spider web network visualization with glowing nodes, interconnected purple blue lines, cyberpunk aesthetic, Netflix series character, digital art portrait, web pattern overlay, 300x400px",
  },
  {
    file: "agent-03.png",
    prompt:
      "Cute fuzzy neuron characters, friendly AI entities, purple blue gradient, cyberpunk kawaii style, Netflix character design, portrait orientation, soft glowing lights, 300x400px",
  },
  {
    file: "agent-04.png",
    prompt:
      "Mathematical weights visualization, floating numbers and equations, purple blue cyberpunk style, Netflix character, digital art portrait, balance scales motif, 300x400px",
  },
  {
    file: "agent-05.png",
    prompt:
      "Alarm clock meets AI entity, waking neurons, glowing purple blue lights, cyberpunk style, Netflix character design, digital art portrait, activation energy waves, 300x400px",
  },
];

async function generateOne(promptText, outputPath) {
  const url = `${baseUrl}/models/${model}:predict?key=${encodeURIComponent(apiKey)}`;
  const response = await globalThis.fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: `Digital art, cinematic, high quality: ${promptText}` }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "3:4",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "unknown");
    throw new Error(`Google API ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const base64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (typeof base64 !== "string" || !base64) {
    throw new Error("Resposta sem imagem base64");
  }

  const raw = Buffer.from(base64, "base64");
  const optimized = await sharp(raw)
    .resize(300, 400, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(outputPath, optimized);
}

async function main() {
  const outDir = path.join(process.cwd(), "public", "images", "agents");
  mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < prompts.length; i++) {
    const item = prompts[i];
    const out = path.join(outDir, item.file);
    console.log(`[${i + 1}/${prompts.length}] Gerando ${item.file}...`);
    await generateOne(item.prompt, out);
    console.log(`✅ ${item.file}`);
  }
}

main().catch((error) => {
  console.error("❌ Falha na geração:", error.message);
  process.exit(1);
});
