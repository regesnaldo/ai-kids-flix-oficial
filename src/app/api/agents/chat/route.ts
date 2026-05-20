import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/langchain/agentRunner'
import { NEXUS_PROMPT, VOLT_PROMPT, AURORA_PROMPT } from '@/lib/langchain/agents'

const AGENT_PROMPTS: Record<string, string> = {
  nexus: NEXUS_PROMPT,
  volt: VOLT_PROMPT,
  aurora: AURORA_PROMPT,
}

// ─── Visual Story Intent Detection ──────────────────────────────────────────

const VISUAL_STORY_TRIGGERS = [
  // Explicit visual requests
  /\bshow\s+me\b/i,
  /\bvisualize\b/i,
  /\bmostre[\s-]me\b/i,
  /\bem\s+(quadros|cenas|frames)\b/i,
  /\bin\s+(frames|scenes?|quadros?|cenas?)\b/i,
  /\bconta\s+a\s+hist[oó]ria\s+de\b/i,
  /\btell\s+me\s+the\s+story\b.+\b(in\s+)?(frames|scenes?|images|illustrations?)\b/i,
]

const AI_CONCEPT_KEYWORDS = [
  /\brede\s+neural\b/i, /\bmachine\s+learning\b/i, /\bdeep\s+learning\b/i,
  /\balgoritmo\b/i, /\binteligência\s+artificial\b/i, /\btransformers?\b/i,
  /\bprocessamento\s+de\s+linguagem\b/i, /\bnlp\b/i,
  /\bvis[aã]o\s+computacional\b/i, /\baprendizado\s+(de|por)\s+m[aá]quina\b/i,
  /\bgpt\b/i, /\bllm\b/i, /\bchatgpt\b/i, /\blangchain\b/i,
  /\bembedding\b/i, /\btokeniza[cç][aã]o\b/i, /\bfine[\s-]?tuning\b/i,
  /\bprompt\b/i, /\brag\b/i, /\battention\b/i,
  /\bcomputa[cç][aã]o\s+qu[aâ]ntica\b/i,
  /\bmodelo\s+de\s+linguagem\b/i, /\bgera[cç][aã]o\s+de\s+imagem\b/i,
  /\bdiffusion\b/i, /\bstable\s+diffusion\b/i,
  /\bneural\b/i, /\bneur[oô]nios?\b/i,
]

const QUESTION_PATTERNS = [
  /\bo\s+que\s+[éé]\b/i,
  /\bcomo\s+funciona\b/i,
  /\bexplique\b/i,
  /\bexplica\b/i,
  /\bme\s+explica\b/i,
  /\bwhat\s+is\b/i,
  /\bhow\s+does\b/i,
  /\bexplain\b/i,
  /\bcomo\s+se\s+faz\b/i,
]

function detectVisualStoryIntent(message: string): { detected: boolean; topic: string } {
  const clean = message.trim()
  
  // Check explicit visual triggers first
  const explicitMatch = VISUAL_STORY_TRIGGERS.some(p => p.test(clean))
  if (explicitMatch) {
    let topic = clean
      .replace(/\b(show\s+me|visualize|tell\s+me\s+the\s+story|in\s+(frames|scenes?|images?|quadros?|cenas?)|mostre[\s-]me|conta\s+a\s+hist[oó]ria\s+de|em\s+(quadros|cenas|frames)|cenas?)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (topic.length < 10) {
      topic = clean.replace(/\b(in\s+)?(\d+)\s*(frames|scenes?|cenas?|quadros?)\b/gi, '').trim()
    }
    return { detected: true, topic: topic || clean }
  }

  // Check AI concept questions
  const hasConcept = AI_CONCEPT_KEYWORDS.some(p => p.test(clean))
  const hasQuestion = QUESTION_PATTERNS.some(p => p.test(clean))
  if (hasConcept && hasQuestion) {
    return { detected: true, topic: clean }
  }

  // Check if message is just an AI concept name (e.g., "rede neural")
  if (hasConcept && clean.length > 5 && clean.length < 80) {
    return { detected: true, topic: `como funciona ${clean}` }
  }

  return { detected: false, topic: '' }
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
