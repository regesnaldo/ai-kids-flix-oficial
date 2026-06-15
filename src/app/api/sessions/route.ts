import { NextRequest, NextResponse } from "next/server";
import { sessionManager } from "@/engine/session/manager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, userId, title } = body;

    if (!agentId || !userId) {
      return NextResponse.json(
        { error: "agentId and userId required" },
        { status: 400 }
      );
    }

    const session = await sessionManager.create({
      agentId: String(agentId),
      userId: Number(userId),
      title,
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sessions]", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
