import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY não configurada no ambiente.");
  process.exit(1);
}
const isOpenRouterKey = apiKey.startsWith("sk-or-v1-");
const apiBaseUrl = process.env.OPENAI_BASE_URL || (isOpenRouterKey ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1");
const imageModel = process.env.OPENAI_IMAGE_MODEL || (isOpenRouterKey ? "openai/dall-e-3" : "dall-e-3");

const outDir = path.join(process.cwd(), "public", "images", "agents");

const agents = [
  { id: 1, codename: "Cabeção", prompt: "Futuristic AI brain entity, glowing neural networks, purple and blue cyberpunk style, Netflix character design, digital art portrait, high tech holographic elements, intelligent glowing eyes, head and shoulders" },
  { id: 2, codename: "Teia de Aranha", prompt: "Spider web network visualization with glowing nodes, interconnected purple blue lines, cyberpunk aesthetic, Netflix series character, digital art portrait, web pattern overlay, futuristic" },
  { id: 3, codename: "Neurônios Fofos", prompt: "Cute fuzzy neuron characters, friendly AI entities, purple blue gradient, cyberpunk kawaii style, Netflix character design, portrait orientation, soft glowing lights, adorable tech" },
  { id: 4, codename: "Halteres Mentais", prompt: "Mathematical weights visualization, floating numbers and equations, purple blue cyberpunk style, Netflix character, digital art portrait, balance scales motif, glowing mathematics" },
  { id: 5, codename: "Despertador", prompt: "Alarm clock meets AI entity, waking neurons, glowing purple blue lights, cyberpunk style, Netflix character design, digital art portrait, activation energy waves, time awakening" },
  { id: 6, codename: "Subsolo Secreto", prompt: "Underground layers visualization, mysterious deep AI layers, purple blue cyberpunk, Netflix character, digital art portrait, hidden depths, glowing strata, mysterious atmosphere" },
  { id: 7, codename: "Tradutor Universal", prompt: "Universal translator device, language symbols floating, purple blue cyberpunk style, Netflix character, digital art portrait, Babel motif, holographic text, multilingual glow" },
  { id: 8, codename: "Picador de Palavras", prompt: "Word chopping machine, text fragments floating, purple blue cyberpunk, Netflix character, digital art portrait, scissors motif, fragmented letters, text processing" },
  { id: 9, codename: "Caderninho", prompt: "Digital notebook entity, memory pages floating, purple blue cyberpunk style, Netflix character, digital art portrait, glowing notes, book motif, memory storage" },
  { id: 10, codename: "Lanterna Mental", prompt: "Mental spotlight, focused beam of light, purple blue cyberpunk style, Netflix character, digital art portrait, attention mechanism, glowing searchlight, focus beam" },
  { id: 11, codename: "Chefe da Sala", prompt: "Boss character in control room, multiple screens, purple blue cyberpunk style, Netflix character, digital art portrait, authority figure, command center, control hub" },
  { id: 12, codename: "Oráculo", prompt: "Mystical oracle entity, crystal ball, purple blue cyberpunk style, Netflix character, digital art portrait, future vision, glowing predictions, mystical tech" },
  { id: 13, codename: "Detetive", prompt: "Detective character with magnifying glass, clues floating, purple blue cyberpunk style, Netflix character, digital art portrait, Sherlock motif, investigation tech" },
  { id: 14, codename: "Post-it", prompt: "Sticky notes floating around AI entity, purple blue cyberpunk style, Netflix character, digital art portrait, memory notes, quick reminders, temporary storage" },
  { id: 15, codename: "HD Eterno", prompt: "Hard drive entity, infinite storage visualization, purple blue cyberpunk style, Netflix character, digital art portrait, data archives, glowing disks, eternal memory" },
  { id: 16, codename: "Cartomante", prompt: "Fortune teller AI entity, cards floating, purple blue cyberpunk style, Netflix character, digital art portrait, crystal ball, probability waves, prediction tech" },
  { id: 17, codename: "Manual Secreto", prompt: "Secret manual book entity, glowing pages, purple blue cyberpunk style, Netflix character, digital art portrait, hidden instructions, ancient tech book, encrypted knowledge" },
  { id: 18, codename: "Professor Rígido", prompt: "Strict professor character, glasses, rules floating, purple blue cyberpunk style, Netflix character, digital art portrait, academic authority, logical rules" },
  { id: 19, codename: "GPS Mental", prompt: "GPS navigation entity, map coordinates, purple blue cyberpunk style, Netflix character, digital art portrait, directional arrows, location pins, vector navigation" },
  { id: 20, codename: "Planta da Casa", prompt: "Architect blueprint entity, building plans floating, purple blue cyberpunk style, Netflix character, digital art portrait, structural design, holographic blueprints, system architecture" },
];

const args = process.argv.slice(2);
const countArgIndex = args.indexOf("--count");
const startArgIndex = args.indexOf("--start");
const count = countArgIndex >= 0 ? Math.max(1, Number.parseInt(args[countArgIndex + 1] || "5", 10)) : 5;
const start = startArgIndex >= 0 ? Math.max(1, Number.parseInt(args[startArgIndex + 1] || "1", 10)) : 1;

const selected = agents.filter((a) => a.id >= start).slice(0, count);

if (selected.length === 0) {
  console.error("Nenhum agente selecionado com os argumentos informados.");
  process.exit(1);
}

const stylePrefix = [
  "Cyberpunk sci-fi Netflix character portrait",
  "purple #9333ea blue #3b82f6 cyan #06b6d4 neon glow",
  "cinematic lighting, holographic details",
  "high quality digital art",
  "vertical portrait composition",
].join(", ");

async function generateOne(agent) {
  const fullPrompt = `${stylePrefix}, ${agent.prompt}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (isOpenRouterKey) {
    headers["HTTP-Referer"] = process.env.OPENROUTER_REFERER || "https://ai-kids-flix.vercel.app";
    headers["X-Title"] = process.env.OPENROUTER_APP_NAME || "MENTE.AI";
  }

  const response = await globalThis.fetch(`${apiBaseUrl}/images/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: imageModel,
      prompt: fullPrompt,
      size: "1024x1792",
      quality: "hd",
      response_format: "b64_json",
      n: 1,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    throw new Error(`OpenAI ${response.status}: ${err}`);
  }

  const payload = await response.json();
  const base64 = payload?.data?.[0]?.b64_json;
  if (typeof base64 !== "string" || !base64) {
    throw new Error("Resposta sem b64_json de imagem.");
  }

  const fileName = `agent-${String(agent.id).padStart(2, "0")}.png`;
  const outputPath = path.join(outDir, fileName);
  const imageBuffer = Buffer.from(base64, "base64");

  const optimized = await sharp(imageBuffer)
    .resize(300, 450, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(outputPath, optimized);
  console.log(`✅ ${fileName} (${agent.codename})`);
}

async function main() {
  await mkdir(outDir, { recursive: true });

  console.log(`Gerando ${selected.length} imagem(ns): agentes #${selected[0].id} até #${selected[selected.length - 1].id}`);

  for (const agent of selected) {
    console.log(`🎨 Gerando #${agent.id} - ${agent.codename}...`);
    await generateOne(agent);
  }

  console.log("Concluído.");
}

main().catch((error) => {
  console.error(`❌ Falha: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
