import { NextRequest, NextResponse } from "next/server";
import { sessionManager } from "@/engine/session/manager";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Auth ──────────────────────────────────────────────────────
    const token = await getAuthCookieFromRequest(req);
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const jwtPayload = await verifyToken(token);
    if (!jwtPayload || !jwtPayload.userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    const authenticatedUserId = Number(jwtPayload.userId);

    const { id: agentId } = await params;
    const body = await req.json();
    const { sessionId, message } = body;

    let session;
    if (sessionId) {
      session = await sessionManager.get(Number(sessionId));
      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
    } else {
      session = await sessionManager.create({
        agentId,
        userId: authenticatedUserId,
        title: "Chat session",
      });
    }

    if (!session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    await sessionManager.sendEvent(session.id, {
      type: "user.message",
      content: { text: message },
    });

    sessionManager.processAgentTurn(session.id).catch(console.error);

    return NextResponse.json({
      sessionId: session.id,
      status: "processing",
    });
  } catch (error) {
    console.error("[POST /api/agents/chat]", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
