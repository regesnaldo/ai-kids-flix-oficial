import { sessionManager, sessionStream } from "@/engine/session/manager";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "stream.connected", sessionId })}\n\n`
        )
      );

      try {
        const eventStream = sessionStream.open(sessionId);

        for await (const event of eventStream) {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(payload));

          if (event.type === "session.status_idle") {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "stream.closed" })}\n\n`
              )
            );
            controller.close();
            break;
          }
        }
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "stream.error", error: String(error) })}\n\n`
          )
        );
        controller.close();
      }
    },
    cancel() {
      sessionStream.close(sessionId);
    },
  });

  return new Response(stream, { headers });
}
