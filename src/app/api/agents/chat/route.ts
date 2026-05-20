import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/langchain/agentRunner'
import { NEXUS_PROMPT, VOLT_PROMPT, AURORA_PROMPT } from '@/lib/langchain/agents'

const AGENT_PROMPTS: Record<string, string> = {
  nexus: NEXUS_PROMPT,
  volt: VOLT_PROMPT,
  aurora: AURORA_PROMPT,
}

// ─── Visual Story Intent Detection ──────────────────────────────────────────

const VISUAL_STORY_PATTERNS = [
  // EN
  /\bshow\s+me\b/i,
  /\bvisualize\b/i,
  /\btell\s+me\s+the\s+story\b.+\b(in\s+)?(frames|scenes?|images|illustrations?)\b/i,
  /\bin\s+(frames|scenes?|quadros?|cenas?)\b/i,
  // PT-BR
  /\bmostre[\s-]me\b/i,
  /\bvisualize\b/i,
  /\bconta\s+a\s+hist[oó]ria\s+de\b/i,
  /\bem\s+(quadros|cenas|frames)\b/i,
  /\bcenas?\b/i,
]

function detectVisualStoryIntent(message: string): { detected: boolean; topic: string } {
  const clean = message.trim()
  
  // Must match at least one keyword
  const matched = VISUAL_STORY_PATTERNS.some(p => p.test(clean))
  if (!matched) return { detected: false, topic: '' }

  // Extract the topic: remove the trigger phrases
  let topic = clean
    .replace(/\b(show\s+me|visualize|tell\s+me\s+the\s+story|in\s+(frames|scenes?|images?|quadros?|cenas?)|mostre[\s-]me|conta\s+a\s+hist[oó]ria\s+de|em\s+(quadros|cenas|frames)|cenas?)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  // If topic is too short after extraction, use the full message
  if (topic.length < 10) {
    topic = clean.replace(/\b(in\s+)?(\d+)\s*(frames|scenes?|cenas?|quadros?)\b/gi, '').trim()
  }

  return { detected: true, topic: topic || clean }
}

function extractFrameCount(message: string): number {
  const match = message.match(/\b(\d+)\s*(frames|scenes?|cenas?|quadros?)\b/i)
  return match ? parseInt(match[1], 10) : 5
}

// ─── POST Handler ───────────────────────────────────────────────────────────

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

    // ── Visual Story detection (NEXUS only) ──────────────────────────────
    if (agentId.toLowerCase() === 'nexus') {
      const { detected, topic } = detectVisualStoryIntent(message)
      if (detected && topic.length >= 5) {
        const frames = extractFrameCount(message)
        return NextResponse.json({
          type: 'visual_story',
          response: `Teus olhos já viram muito — mas ainda não viram ${topic.toLowerCase()}. Deixe-me tecer essa história em ${frames} cenas...`,
          topic,
          frames,
          agentId: 'nexus',
          timestamp: new Date().toISOString(),
        })
      }
    }

    // ── Normal agent response ────────────────────────────────────────────
    const response = await runAgent(systemPrompt, message, history || [])

    return NextResponse.json({
      type: 'chat',
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
