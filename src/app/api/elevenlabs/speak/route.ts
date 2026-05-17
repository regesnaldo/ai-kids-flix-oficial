import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id, model_id } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    const defaultVoiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_DEFAULT || 'pNInz6obpgDQGcFmaJgB';
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id || defaultVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: model_id || 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }
    
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    
    return new Response(response.body, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('[ElevenLabs API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
