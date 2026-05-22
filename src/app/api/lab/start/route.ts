import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBoard, saveBoard, type KnowledgeBoard } from "../board-store";

// ── POST /api/lab/start ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { topic } = (await request.json()) as { topic: string };
    if (!topic) return NextResponse.json({ error: "topic é obrigatório" }, { status: 400 });

    const experimentId = randomUUID();
    const board: KnowledgeBoard = {
      experimentId,
      topic,
      facts: [],
      currentAgent: "",
      completedAgents: [],
      agentOutputs: {},
      history: [],
    };

    saveBoard(board);

    return NextResponse.json({ experimentId, topic });
  } catch (err) {
    console.error("[lab/start]", err);
    return NextResponse.json({ error: "Falha ao criar experimento" }, { status: 500 });
  }
}
