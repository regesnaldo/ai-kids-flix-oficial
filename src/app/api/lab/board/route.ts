import { NextRequest, NextResponse } from "next/server";
import { getBoard, saveBoard } from "../board-store";

// ── GET /api/lab/board?experimentId=xxx ─────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const experimentId = request.nextUrl.searchParams.get("experimentId");
    if (!experimentId) {
      return NextResponse.json({ error: "experimentId é obrigatório" }, { status: 400 });
    }

    const board = getBoard(experimentId);
    if (!board) {
      return NextResponse.json({ error: "Experimento não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      experimentId: board.experimentId,
      topic: board.topic,
      facts: board.facts,
      currentAgent: board.currentAgent,
      completedAgents: board.completedAgents,
      agentOutputs: board.agentOutputs,
      history: board.history.map((h) => ({
        agent: h.agent,
        facts: h.facts,
        timestamp: h.timestamp,
      })),
    });
  } catch (error) {
    console.error("Erro em GET /api/lab/board:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── POST /api/lab/board — adiciona ideia ao quadro ──────────────────
export async function POST(request: NextRequest) {
  try {
    const { experimentId, idea } = (await request.json()) as {
      experimentId: string;
      idea: string;
    };

    if (!experimentId || !idea) {
      return NextResponse.json({ error: "experimentId e idea são obrigatórios" }, { status: 400 });
    }

    const board = getBoard(experimentId);
    if (!board) {
      return NextResponse.json({ error: "Experimento não encontrado" }, { status: 404 });
    }

    board.facts.push(`💡 ${idea}`);
    board.history.push({
      agent: "human",
      output: `Ideia injetada: ${idea}`,
      facts: [`💡 ${idea}`],
      timestamp: Date.now(),
    });
    saveBoard(board);

    return NextResponse.json({ success: true, facts: board.facts });
  } catch (error) {
    console.error("Erro em POST /api/lab/board:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
