const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

const audios = {
  biblioteca: {
    filename: "public/audio/biblioteca-welcome.mp3",
    script: `Bem-vindo à Biblioteca Viva do MENTE.AI.
Aqui você encontra 4 andares de conhecimento: Fundamentos, Linguagens, Criação e Inovação.
Cada livro é guiado por um agente especializado.
Passe o mouse para ver detalhes e clique para abrir.
Use as partículas para navegar entre conceitos.
NEXUS conecta todo o conhecimento para você.`
  },
  pratico: {
    filename: "public/audio/pratico-welcome.mp3",
    script: `Bem-vindo ao Laboratório Prático de Dissecação Tecnológica.
Aqui você encontrará 8 estações de experimento guiadas pelos agentes avançados e mestres.
Clique em cada estação para abrir o experimento.
Execute testes, veja métricas e sincronize dados.
Os hologramas mostram o funcionamento interno.
Experimente, teste e aprenda na prática.`
  },
  simulador: {
    filename: "public/audio/simulador-welcome.mp3",
    script: `Bem-vindo ao Simulador de Consciência do MENTE.AI.
Digite seu estado no campo de texto e clique em Conectar Consciência.
Observe como NEXUS processa o sinal emocional e as conexões neurais.
Conecte-se, observe e compreenda.`
  }
};

async function generateAudio(name, config) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("Defina ELEVENLABS_API_KEY no ambiente.");
  }

  console.log(`Gerando áudio: ${name}...`);

  const response = await globalThis.fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: config.script.trim(),
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Falha API ElevenLabs (${response.status}): ${details}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const fs = await import("node:fs");
  fs.mkdirSync("public/audio", { recursive: true });
  fs.writeFileSync(config.filename, Buffer.from(arrayBuffer));
  console.log(`OK: ${config.filename}`);
}

(async () => {
  try {
    for (const [name, config] of Object.entries(audios)) {
      await generateAudio(name, config);
      await new Promise((resolve) => globalThis.setTimeout(resolve, 700));
    }
    console.log("Áudios gerados com sucesso.");
  } catch (error) {
    console.error("Erro ao gerar áudios:", error.message || error);
    process.exitCode = 1;
  }
})();
