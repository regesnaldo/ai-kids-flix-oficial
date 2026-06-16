import { NextRequest, NextResponse } from "next/server";
import { getBoard, saveBoard } from "../board-store";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

// ── POST /api/lab/rollback ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────
    const token = await getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const jwtPayload = await verifyToken(token);
    if (!jwtPayload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const { experimentId, targetStep, injectIdea } = (await request.json()) as {
      experimentId: string;
      targetStep: number; // índice no histórico (0-based)
      injectIdea?: string;
    };

    if (!experimentId || targetStep === undefined) {
      return NextResponse.json(
        { error: "experimentId e targetStep são obrigatórios" },
        { status: 400 }
      );
    }

    const board = getBoard(experimentId);
    if (!board) {
      return NextResponse.json({ error: "Experimento não encontrado" }, { status: 404 });
    }

    if (targetStep < 0 || targetStep >= board.history.length) {
      return NextResponse.json({ error: "targetStep inválido" }, { status: 400 });
    }

    // Restaurar estado até o step escolhido
    const restoredHistory = board.history.slice(0, targetStep + 1);

    // Reconstruir facts de todos os agentes até o step
    const restoredFacts: string[] = [];
    const restoredCompleted: string[] = [];
    const restoredOutputs: Record<string, string> = {};

    for (const step of restoredHistory) {
      if (step.agent !== "human") {
        restoredCompleted.push(step.agent);
        restoredOutputs[step.agent] = step.output;
      }
      restoredFacts.push(...step.facts);
    }

    // Adicionar ideia injetada se fornecida
    if (injectIdea) {
      restoredFacts.push(`💡 IDEIA INJETADA: ${injectIdea}`);
    }

    // Restaurar o board
    board.facts = restoredFacts;
    board.completedAgents = restoredCompleted;
    board.agentOutputs = restoredOutputs;
    board.history = restoredHistory;
    board.currentAgent = "";

    // Determinar próximo agente
    const AGENT_ORDER = ["nexus", "cipher", "kaos", "aurora"];
    const lastCompleted = restoredCompleted[restoredCompleted.length - 1];
    const lastIndex = lastCompleted ? AGENT_ORDER.indexOf(lastCompleted) : -1;
    board.currentAgent = AGENT_ORDER[lastIndex + 1] || "";

    saveBoard(board);

    return NextResponse.json({
      success: true,
      currentAgent: board.currentAgent,
      completedAgents: board.completedAgents,
      facts: board.facts,
      historyLength: board.history.length,
    });
  } catch (error) {
    console.error("Erro em POST /api/lab/rollback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
