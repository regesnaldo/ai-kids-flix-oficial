import { NextRequest, NextResponse } from "next/server";
import { sessionManager } from "@/engine/session/manager";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const body = await req.json();
    const { sessionId, message, userId } = body;

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
      if (!userId) {
        return NextResponse.json(
          { error: "userId required to create session" },
          { status: 400 }
        );
      }
      session = await sessionManager.create({
        agentId,
        userId: Number(userId),
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
