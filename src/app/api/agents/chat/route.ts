import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/langchain/agentRunner'
import { NEXUS_PROMPT, VOLT_PROMPT, AURORA_PROMPT } from '@/lib/langchain/agents'

const AGENT_PROMPTS: Record<string, string> = {
  nexus: NEXUS_PROMPT,
  volt: VOLT_PROMPT,
  aurora: AURORA_PROMPT,
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, message, history } = await request.json()

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'agentId and message required' },
        { status: 400 }
      )
    }

    const systemPrompt = AGENT_PROMPTS[agentId.toLowerCase()]
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Agent ${agentId} not found` },
        { status: 404 }
      )
    }

    const response = await runAgent(systemPrompt, message, history || [])

    return NextResponse.json({
      response,
      agentId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[AgentChat] error:', error)
    return NextResponse.json(
      { error: 'Agent temporarily unavailable' },
      { status: 500 }
    )
  }
}
