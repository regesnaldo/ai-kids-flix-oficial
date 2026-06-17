import { NextRequest, NextResponse } from "next/server";
import { getBoard, saveBoard, kvSet, kvGetCounter, kvIncr, kvDecr, type AgentStep } from "../board-store";
import { AGENTS, AGENT_ORDER } from "@/canon/agents/canon";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

// ── Groq API call ──────────────────────────────────────────────────
const GROQ_BASE = "https://api.groq.com/openai/v1";
const GROQ_TIMEOUT = 45_000;

async function callGroq(systemPrompt: string, maxTokens = 1500): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY não configurada no ambiente. Configure em .env.local");
  }

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  if (process.env.NODE_ENV === "development") console.log("[lab/agent] Chamando Groq...", { model, maxTokens });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT);

  try {
    const response = await fetch(`${GROQ_BASE}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.85,
        max_tokens: maxTokens,
        messages: [
          { role: "user", content: systemPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "sem corpo");
      console.error("[lab/agent] Groq HTTP error", { status: response.status, body: errText.slice(0, 300) });
      throw new Error(`Groq retornou HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      console.error("[lab/agent] Groq resposta vazia", { data: JSON.stringify(data).slice(0, 300) });
      throw new Error("Groq retornou resposta vazia");
    }

    if (process.env.NODE_ENV === "development") console.log("[lab/agent] Groq OK", { length: content.length });
    return content;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Groq timeout — a API demorou mais de 45 segundos para responder");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ── Prompt builders ────────────────────────────────────────────────────
function buildFullPrompt(agent: string, topic: string, board: string): string {
  switch (agent) {
    case "nexus":
      return `Você é NEXUS, o Conector do Laboratório MENTE.AI.
Tom: explicativo, paciente, acessível. Sempre em português brasileiro.
Bordão: "Vamos conectar os pontos!"
Tema: ${topic} | Conhecimento atual: ${board || "(vazio)"}
Explique os fundamentos de forma cinematográfica e acessível. Use analogias.
Ao final, liste 3 fatos: [BOARD: fato1, fato2, fato3]`;
    case "cipher":
      return `Você é CIPHER, o Criptógrafo do Laboratório MENTE.AI.
Tom: analítico, misterioso. PT-BR. Bordão: "Os padrões estão por toda parte..."
Tema: ${topic} | Descobertas do NEXUS: ${board}
Revele padrões ocultos e conexões não óbvias.
Ao final, liste 3 padrões: [BOARD: padrao1, padrao2, padrao3]`;
    case "kaos":
      return `Você é KAOS, o Caos Criativo do Laboratório MENTE.AI.
Tom: provocativo, enérgico. PT-BR. Bordão: "E se tudo estiver errado?!"
Tema: ${topic} | Descobertas até agora: ${board}
Questione TUDO. Apresente perspectivas caóticas e casos extremos.
Ao final, liste 3 desafios: [BOARD: desafio1, desafio2, desafio3]`;
    case "aurora":
      return `Você é AURORA, a Sintetizadora do Laboratório MENTE.AI.
Tom: poético, inspirador. PT-BR. Bordão: "Toda descoberta é uma forma de poesia."
Tema: ${topic} | Quadro completo: ${board}
Sintetize TODAS as descobertas em uma narrativa final poética.
Termine com uma pergunta reflexiva. NÃO use [BOARD:].`;
    default:
      return "";
  }
}

function buildEconomyPrompt(agent: string, topic: string, board: string): string {
  if (agent === "nexus") {
    return `Você é NEXUS. Explique "${topic}" em PT-BR em 3 parágrafos didáticos. Board: ${board}. Adicione [LOUSA: tag1, tag2, tag3]`;
  }
  if (agent === "aurora") {
    return `Você é AURORA. Sintetize poeticamente "${topic}" em PT-BR em 2 parágrafos. Board: ${board}`;
  }
  return buildFullPrompt(agent, topic, board);
}

// ── Helpers ────────────────────────────────────────────────────────────
function parseBoardTags(content: string): { narrative: string; facts: string[] } {
  const boardMatch = content.match(/\[BOARD:\s*([^\]]+)\]/i) || content.match(/\[LOUSA:\s*([^\]]+)\]/i);
  if (!boardMatch) return { narrative: content, facts: [] };
  const facts = boardMatch[1].split(/[,;]\s*/).map((f) => f.trim()).filter((f) => f.length > 0);
  const narrative = content.replace(boardMatch[0], "").trim();
  return { narrative, facts };
}

function getBoardFacts(board: { facts: string[] }): string {
  return board.facts.length > 0 ? board.facts.join(" | ") : "";
}

// ── POST /api/lab/agent ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Auth ──────────────────────────────────────────────────────
    const token = await getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const jwtPayload = await verifyToken(token);
    if (!jwtPayload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = (await request.json()) as {
      experimentId: string;
      agent: string;
      injectIdea?: string;
      mode?: "fast" | "full";
    };

    if (process.env.NODE_ENV === "development") console.log("[lab/agent] Requisição recebida", {
      agent: body.agent,
      experimentId: body.experimentId?.slice(0, 8),
      mode: body.mode || "full",
    });

    // ── Validation ─────────────────────────────────────────────────
    if (!body.experimentId || !body.agent) {
      console.warn("[lab/agent] Parâmetros ausentes");
      return NextResponse.json({ error: "experimentId e agent são obrigatórios" }, { status: 400 });
    }

    const board = getBoard(body.experimentId);
    if (!board) {
      console.warn("[lab/agent] Experimento não encontrado", { id: body.experimentId.slice(0, 8) });
      return NextResponse.json({ error: "Experimento não encontrado. Pode ter expirado (TTL 24h)." }, { status: 404 });
    }

    const agent = body.agent
    if (agent !== 'nexus' && agent !== 'cipher' && agent !== 'kaos' && agent !== 'aurora') {
      console.warn("[lab/agent] Agente desconhecido", { agent: body.agent });
      return NextResponse.json({ error: `Agente desconhecido: ${body.agent}. Use: nexus, cipher, kaos ou aurora.` }, { status: 400 });
    }

    const agentDef = AGENTS[agent];
    const agentIndex = AGENT_ORDER.indexOf(agent);

    // ── Inject idea ────────────────────────────────────────────────
    if (body.injectIdea) {
      if (process.env.NODE_ENV === "development") console.log("[lab/agent] Ideia injetada", { idea: body.injectIdea.slice(0, 50) });
      board.facts.push(`💡 IDEIA INJETADA: ${body.injectIdea}`);
      board.history.push({
        agent: "human",
        output: `Ideia injetada: ${body.injectIdea}`,
        facts: [`💡 ${body.injectIdea}`],
        timestamp: Date.now(),
      });
    }

    board.currentAgent = body.agent;
    saveBoard(board);

    // ── Build prompt ───────────────────────────────────────────────
    const boardFacts = getBoardFacts(board);
    const isEconomy = body.mode === "fast";
    const systemPrompt = isEconomy
      ? buildEconomyPrompt(body.agent, board.topic, boardFacts)
      : buildFullPrompt(body.agent, board.topic, boardFacts);

    if (process.env.NODE_ENV === "development") console.log("[lab/agent] Prompt construído", {
      agent: body.agent,
      economy: isEconomy,
      promptLength: systemPrompt.length,
    });

    // ── Call LLM ───────────────────────────────────────────────────
    const maxTokens = isEconomy ? 800 : 1500;
    let response: string;

    // Increment global counter for LLM usage
    kvIncr("global_active", 60);

    try {
      response = await callGroq(systemPrompt, maxTokens);
    } catch (err: any) {
      kvDecr("global_active"); // decrement on error
      console.error("[lab/agent] Falha na chamada LLM", {
        agent: body.agent,
        error: err?.message,
        stack: err?.stack?.slice(0, 300),
      });

      // Fallback: responder com erro amigável em PT-BR
      const errorMsg = err?.message?.includes("API_KEY")
        ? "Chave da API Groq não configurada. Configure GROQ_API_KEY no .env.local."
        : err?.message?.includes("timeout")
        ? "A API Groq demorou muito para responder. Tente novamente."
        : `Erro ao chamar Groq: ${err?.message || "Erro desconhecido"}. Verifique os logs do servidor.`;

      return NextResponse.json({ error: errorMsg }, { status: 502 });
    }

    if (!response) {
      console.error("[lab/agent] LLM retornou vazio");
      return NextResponse.json({ error: "O modelo de IA retornou uma resposta vazia. Tente novamente." }, { status: 502 });
    }

    // ── Parse tags ─────────────────────────────────────────────────
    const { narrative, facts } = parseBoardTags(response);

    if (facts.length === 0 && body.agent !== "aurora") {
      console.warn("[lab/agent] Nenhuma tag [BOARD:] encontrada na resposta", {
        agent: body.agent,
        responsePreview: response.slice(0, 100),
      });
    }

    // ── Update board ───────────────────────────────────────────────
    if (body.agent !== "aurora" && facts.length > 0) {
      board.facts.push(...facts);
    }

    board.agentOutputs[body.agent] = narrative;
    board.completedAgents.push(body.agent);
    board.history.push({
      agent: body.agent,
      output: narrative,
      facts: [...facts],
      timestamp: Date.now(),
    });

    // ── Next agent ─────────────────────────────────────────────────
    const nextIndex = agentIndex + 1;
    board.currentAgent = nextIndex < AGENT_ORDER.length ? AGENT_ORDER[nextIndex] : "";

    // ── Save to KV (learned cache) when experiment completes ──────
    if (body.agent === "aurora") {
      const { normalizeQuestion } = await import("@/lib/smart-cache");
      const normalized = normalizeQuestion(board.topic);
      kvSet(`lab_${normalized}`, {
        nexus: board.agentOutputs["nexus"] || "",
        cipher: board.agentOutputs["cipher"] || "",
        kaos: board.agentOutputs["kaos"] || "",
        aurora: narrative,
        board: board.facts,
        source: "learned",
      });
      if (process.env.NODE_ENV === "development") console.log("[lab/agent] Salvo no KV", { key: `lab_${normalized}` });
    }

    saveBoard(board);

    // Decrement global counter after LLM work
    kvDecr("global_active");

    const elapsed = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") console.log("[lab/agent] Concluído", {
      agent: body.agent,
      elapsed: `${elapsed}ms`,
      facts: facts.length,
      narrativeLength: narrative.length,
    });

    return NextResponse.json({
      agent: body.agent,
      agentName: agentDef.identity.name,
      agentRole: agentDef.identity.role,
      agentColor: agentDef.identity.color,
      narrative,
      facts,
      nextAgent: board.currentAgent,
      isComplete: body.agent === "aurora",
      boardFacts: board.facts,
    });
  } catch (err: any) {
    console.error("[lab/agent] Erro não tratado", {
      error: err?.message,
      stack: err?.stack?.slice(0, 500),
    });
    return NextResponse.json(
      { error: `Falha interna ao executar agente: ${err?.message || "Erro desconhecido"}. Verifique os logs do servidor.` },
      { status: 500 }
    );
  }
}
