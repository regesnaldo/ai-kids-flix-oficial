import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const event = request.headers.get('x-github-event');
    console.log(`[Webhook] GitHub event: ${event}`);

    if (event === 'push' || event === 'pull_request') {
      console.log(`[Webhook] Evento recebido: ${event}`);
    }

    return NextResponse.json({ received: true, event });
  } catch {
    return NextResponse.json({ received: true });
  }
}
