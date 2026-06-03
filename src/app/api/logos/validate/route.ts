import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logosAttempts } from '@/lib/db/schema'
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

    const userId = payload.userId
    const { episodeId, agentId, questions, answers, attemptNumber } = await request.json()

    if (!episodeId || !agentId || !questions || !answers) {
      return NextResponse.json(
        { error: 'episodeId, agentId, questions e answers são obrigatórios' },
        { status: 400 }
      )
    }

    let score = 0
    const results = questions.map((q: { id: string; correctId: string }) => {
      const userAnswer = answers[q.id]
      const correct = userAnswer === q.correctId
      if (correct) score++
      return { questionId: q.id, userAnswer, correct, correctId: q.correctId }
    })

    const passed = score >= 2

    await db.insert(logosAttempts).values({
      id: crypto.randomUUID(),
      userId,
      episodeId,
      agentId,
      questions: JSON.stringify(questions),
      answers: JSON.stringify(answers),
      score,
      passed,
      attemptNumber: attemptNumber || 1,
    })

    return NextResponse.json({
      success: true,
      score,
      total: questions.length,
      passed,
      minPassing: 2,
      results,
      message: passed
        ? 'Acesso concedido. Sua mente está pronta.'
        : 'O conhecimento ainda não foi integrado. Reflita sobre o que foi ensinado e tente novamente.'
    })

  } catch (error) {
    console.error('[LOGOS/VALIDATE]', error)
    return NextResponse.json({ error: 'Erro ao validar respostas' }, { status: 500 })
  }
}
