import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookieFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { episodeContent, agentId, episodeId } = await request.json()

    if (!episodeContent || !agentId || !episodeId) {
      return NextResponse.json(
        { error: 'episodeContent, agentId e episodeId são obrigatórios' },
        { status: 400 }
      )
    }

    const systemPrompt = `Você é LOGOS, o Guardião do Conhecimento do MENTE.AI.
Gere exatamente 3 perguntas de múltipla escolha em português brasileiro.
Cada pergunta deve ter 3 alternativas (A, B, C) sendo apenas 1 correta.
Baseie-se EXCLUSIVAMENTE no conteúdo fornecido.
Varie a dificuldade: 1 fácil, 1 média, 1 difícil.

Responda APENAS com JSON válido neste formato:
{
  "questions": [
    {
      "id": "q1",
      "text": "pergunta aqui",
      "options": [
        { "id": "a", "text": "alternativa A" },
        { "id": "b", "text": "alternativa B" },
        { "id": "c", "text": "alternativa C" }
      ],
      "correctId": "a",
      "explanation": "explicação breve do porquê esta é a resposta correta"
    }
  ]
}`

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Conteúdo do episódio:\n\n${episodeContent}` }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const clean = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json({
      success: true,
      episodeId,
      agentId,
      questions: parsed.questions
    })

  } catch (error) {
    console.error('[LOGOS/GENERATE]', error)
    return NextResponse.json({ error: 'Erro ao gerar perguntas' }, { status: 500 })
  }
}
