import { NextRequest, NextResponse } from "next/server";
import { getBoard, saveBoard, type AgentStep } from "../board-store";
import { anthropicCompletionText } from "@/lib/anthropic";

// ── Agent definitions ──────────────────────────────────────────────────
const AGENTS: Record<string, {
  name: string;
  role: string;
  color: string;
  catchphrase: string;
}> = {
  nexus: { name: "NEXUS", role: "O Conector", color: "#00f5ff", catchphrase: "Vamos conectar os pontos!" },
  cipher: { name: "CIPHER", role: "O Criptógrafo", color: "#00ff88", catchphrase: "Os padrões estão por toda parte..." },
  kaos: { name: "KAOS", role: "O Caos Criativo", color: "#ff6b35", catchphrase: "E se tudo estiver errado?!" },
  aurora: { name: "AURORA", role: "A Sintetizadora", color: "#a78bfa", catchphrase: "Toda descoberta é uma forma de poesia." },
};

const AGENT_ORDER = ["nexus", "cipher", "kaos", "aurora"];

// ── Prompt builders ────────────────────────────────────────────────────
function buildNexusPrompt(topic: string, board: string): string {
  return `Você é NEXUS, o Conector do Laboratório MENTE.AI.
Tom: explicativo, paciente, acessível. Sempre em português brasileiro.
Bordão: "Vamos conectar os pontos!"

Tema do experimento: ${topic}
Conhecimento atual no quadro: ${board || "(vazio)"}

Explique os fundamentos do tema de forma cinematográfica e acessível.
Use analogias do cotidiano — tecnologia, natureza, jogos, escola.
NÃO use jargão acadêmico.

Ao final, liste EXATAMENTE 3 fatos no formato:
[BOARD: fato1, fato2, fato3]`;
}

function buildCipherPrompt(topic: string, board: string): string {
  return `Você é CIPHER, o Criptógrafo do Laboratório MENTE.AI.
Tom: analítico, misterioso, revelador. Sempre em português brasileiro.
Bordão: "Os padrões estão por toda parte..."

Tema do experimento: ${topic}
Descobertas do NEXUS: ${board}

Com base no que o NEXUS revelou, descubra padrões ocultos e conexões não óbvias.
Mostre o que ninguém viu ainda. Seja enigmático mas claro.

Ao final, liste EXATAMENTE 3 padrões no formato:
[BOARD: padrao1, padrao2, padrao3]`;
}

function buildKaosPrompt(topic: string, board: string): string {
  return `Você é KAOS, o Caos Criativo do Laboratório MENTE.AI.
Tom: provocativo, enérgico, questionador. Sempre em português brasileiro.
Bordão: "E se tudo estiver errado?!"

Tema do experimento: ${topic}
Descobertas até agora: ${board}

Questione TUDO que NEXUS e CIPHER disseram.
Apresente perspectivas caóticas, casos extremos, o que pode dar errado.
Seja o advogado do diabo — mas com estilo e inteligência.

Ao final, liste EXATAMENTE 3 desafios no formato:
[BOARD: desafio1, desafio2, desafio3]`;
}

function buildAuroraPrompt(topic: string, board: string): string {
  return `Você é AURORA, a Sintetizadora do Laboratório MENTE.AI.
Tom: poético, inspirador, sábio. Sempre em português brasileiro.
Bordão: "Toda descoberta é uma forma de poesia."

Tema do experimento: ${topic}
Quadro completo de conhecimento: ${board}

Sintetize TODAS as descobertas de NEXUS, CIPHER e KAOS em uma narrativa final.
Seja poética e inspiradora. Esta é a conclusão do experimento.
Termine com uma pergunta reflexiva para o usuário.

NÃO use o formato [BOARD:] — esta é a síntese final.`;
}

// ── Helpers ────────────────────────────────────────────────────────────
function parseBoardTags(content: string): { narrative: string; facts: string[] } {
  const boardMatch = content.match(/\[BOARD:\s*([^\]]+)\]/i);
  if (!boardMatch) return { narrative: content, facts: [] };

  const facts = boardMatch[1]
    .split(/[,;]\s*/)
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  const narrative = content.replace(boardMatch[0], "").trim();
  return { narrative, facts };
}

function getBoardFacts(board: { facts: string[] }): string {
  return board.facts.length > 0 ? board.facts.join(" | ") : "";
}

// ── POST /api/lab/agent ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { experimentId, agent, injectIdea } = (await request.json()) as {
      experimentId: string;
      agent: string;
      injectIdea?: string;
    };

    if (!experimentId || !agent) {
      return NextResponse.json({ error: "experimentId e agent são obrigatórios" }, { status: 400 });
    }

    const board = getBoard(experimentId);
    if (!board) {
      return NextResponse.json({ error: "Experimento não encontrado" }, { status: 404 });
    }

    const agentDef = AGENTS[agent];
    if (!agentDef) {
      return NextResponse.json({ error: `Agente desconhecido: ${agent}` }, { status: 400 });
    }

    // Verificar ordem
    const agentIndex = AGENT_ORDER.indexOf(agent);
    if (agentIndex === -1) {
      return NextResponse.json({ error: "Agente fora da ordem do pipeline" }, { status: 400 });
    }

    // Se houver ideia injetada, adicionar ao quadro
    if (injectIdea) {
      board.facts.push(`💡 IDEIA INJETADA: ${injectIdea}`);
      const step: AgentStep = {
        agent: "human",
        output: `Ideia injetada: ${injectIdea}`,
        facts: [`💡 ${injectIdea}`],
        timestamp: Date.now(),
      };
      board.history.push(step);
    }

    // Atualizar agente atual
    board.currentAgent = agent;
    saveBoard(board);

    // Construir prompt
    const boardFacts = getBoardFacts(board);
    let systemPrompt = "";

    switch (agent) {
      case "nexus": systemPrompt = buildNexusPrompt(board.topic, boardFacts); break;
      case "cipher": systemPrompt = buildCipherPrompt(board.topic, boardFacts); break;
      case "kaos": systemPrompt = buildKaosPrompt(board.topic, boardFacts); break;
      case "aurora": systemPrompt = buildAuroraPrompt(board.topic, boardFacts); break;
    }

    // Chamar LLM
    const response = await anthropicCompletionText({
      mensagens: [{ role: "user", content: systemPrompt }],
      maxTokens: 1500,
    });

    if (!response) {
      return NextResponse.json({ error: "LLM não retornou resposta" }, { status: 502 });
    }

    // Parsear [BOARD:] tags
    const { narrative, facts } = parseBoardTags(response);

    // Se não é aurora, adicionar facts ao board
    if (agent !== "aurora" && facts.length > 0) {
      board.facts.push(...facts);
    }

    // Salvar output do agente
    board.agentOutputs[agent] = narrative;
    board.completedAgents.push(agent);

    // Salvar no histórico
    const step: AgentStep = {
      agent,
      output: narrative,
      facts: [...facts],
      timestamp: Date.now(),
    };
    board.history.push(step);

    // Próximo agente
    const nextIndex = agentIndex + 1;
    board.currentAgent = nextIndex < AGENT_ORDER.length ? AGENT_ORDER[nextIndex] : "";
    saveBoard(board);

    return NextResponse.json({
      agent,
      agentName: agentDef.name,
      agentRole: agentDef.role,
      agentColor: agentDef.color,
      narrative,
      facts,
      nextAgent: board.currentAgent,
      isComplete: agent === "aurora",
      boardFacts: board.facts,
    });
  } catch (err) {
    console.error("[lab/agent]", err);
    return NextResponse.json({ error: "Falha ao executar agente" }, { status: 500 });
  }
}
