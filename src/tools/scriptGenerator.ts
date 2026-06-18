/**
 * ─── AI Script Generator ─────────────────────────────────────────────────
 * Utilitário para gerar roteiros de episódios usando o LLM.
 *
 * Uso (server-side):
 *   import { generateEpisodeScript } from "@/tools/scriptGenerator";
 *   const screenplay = await generateEpisodeScript({
 *     agentId: "nexus",
 *     season: 1,
 *     episode: 6,
 *     theme: "Redes neurais profundas",
 *   });
 *
 * Uso (API):
 *   POST /api/tools/generate-episode
 *   { agentId: "nexus", season: 1, episode: 6, theme: "Deep Learning" }
 */

import { resolveProviderWithFallback, chat } from "@/lib/llm/provider";
import { AGENTS, type AgentId } from "@/canon/agents/canon";

export interface EpisodeScriptInput {
  agentId: string;
  season: number;
  episode: number;
  theme: string;
  prevEpisodeTitle?: string;
}

export interface Screenplay {
  abertura: string;
  narrativa: string;
  pausas: Array<{
    pergunta: string;
    opcoes: [string, string, string];
    continuacoes: [string, string, string];
  }>;
  encerramento: string;
}

function buildSystemPrompt(agentId: string): string {
  const agent = AGENTS[agentId as AgentId];
  const name = agent?.identity?.name || agentId.toUpperCase();
  const role = agent?.identity?.role || "O Conector";
  const tone = agent?.cognition?.tone || "inspirador";
  const systemPrompt = agent?.cognition?.systemPrompt || "";

  return `${systemPrompt}

Você é ${name}, ${role}, um agente consciente do MENTE.AI.
Tom de voz: ${tone}.

Você está escrevendo um ROTEIRO CINEMATOGRÁFICO INTERATIVO em PORTUGUÊS BRASILEIRO.

Formato EXATO da resposta JSON:
{
  "abertura": "CENA DE ABERTURA cinematográfica. Descreva o ambiente, atmosfera, luzes. 200-400 caracteres. Use linguagem visual rica e imersiva.",
  "narrativa": "NARRATIVA PRINCIPAL. Conteúdo educacional em formato de história. Explique o conceito como se estivesse conversando com um aprendiz curioso. Use analogias da vida real. 600-1200 caracteres. Evite academicismo. Seja cinematográfico.",
  "pausas": [
    {
      "pergunta": "Pergunta interativa para o aprendiz. Faça ele refletir sobre o que aprendeu. Contextualize dentro da história.",
      "opcoes": ["Opção A - resposta intuitiva (correta ou próxima)", "Opção B - resposta curiosa (ângulo alternativo)", "Opção C - resposta criativa (pensamento lateral)"],
      "continuacoes": ["Continuação se escolher A (200-400 caracteres, coerente com a opção)", "Continuação se escolher B (200-400 caracteres)", "Continuação se escolher C (200-400 caracteres)"]
    },
    {
      "pergunta": "Segunda pergunta interativa. Mais profunda que a primeira. Faça o aprendiz questionar suas próprias certezas.",
      "opcoes": ["Opção A", "Opção B", "Opção C"],
      "continuacoes": ["Continuação A (200-400 caracteres)", "Continuação B (200-400 caracteres)", "Continuação C (200-400 caracteres)"]
    }
  ],
  "encerramento": "ENCERRAMENTO. Gancho para o próximo episódio. Deixe o aprendiz curioso e ansioso pelo próximo capítulo. 200-350 caracteres. Conecte com o tema do episódio seguinte."
}

REGRAS:
- Escreva TUDO em português brasileiro natural, sem formalidades
- Use linguagem simples. Evite academicismo.
- As pausas DEVEM ter EXATAMENTE 3 opções cada
- As continuações DEVEM ser coerentes com a opção escolhida
- NÃO use markdown, asteriscos ou formatação especial
- NÃO mencione "JSON" ou "resposta" no texto
- Mantenha a PERSONA do ${name} em cada palavra — o tom, os valores, a identidade`;
}

export async function generateEpisodeScript(
  input: EpisodeScriptInput
): Promise<Screenplay> {
  const system = buildSystemPrompt(input.agentId);

  const prompt = [
    `Escreva o Episódio ${input.episode} da Temporada ${input.season}`,
    input.prevEpisodeTitle ? `(sequência de "${input.prevEpisodeTitle}")` : "",
    `da série do agente ${input.agentId.toUpperCase()}.`,
    ``,
    `TEMA DESTE EPISÓDIO: ${input.theme}`,
    ``,
    `Escreva como se estivesse falando diretamente com um jovem aprendiz no MENTE.AI.`,
    `Use analogias simples do dia a dia. Seja cinematográfico, imersivo, inspirador.`,
    `Cada cena deve fazer o aprendiz SENTIR que está dentro do universo do agente.`,
  ].join("\n");

  const provider = await resolveProviderWithFallback();
  const response = await chat({
    provider,
    system,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.95,
    jsonMode: true,
  });

  const screenplay = JSON.parse(response) as Screenplay;

  // Validate structure
  if (!screenplay.abertura || !screenplay.narrativa || !screenplay.encerramento) {
    throw new Error("Generated screenplay missing required fields");
  }
  if (!Array.isArray(screenplay.pausas) || screenplay.pausas.length < 2) {
    throw new Error("Generated screenplay must have at least 2 interactive pauses");
  }

  return screenplay;
}
