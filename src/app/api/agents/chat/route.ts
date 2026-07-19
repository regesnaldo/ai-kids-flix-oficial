import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/langchain/agentRunner'
import { AGENT_PROMPTS, type AgentId } from '@/canon/agents/canon'
import { ALL_AGENTS } from '@/canon/agents/all-agents'
import { buildSystemPromptForAgent } from '@/engine/langchain-integration'
import { routeAdaptiveNarrative } from '@/engine/router'
import { getMemoryContext } from '@/lib/agent-memory'
import { detectConflict, injectConflictIntoPrompt, getNexusIntervention } from '@/lib/agents/conflict-engine'
import { getAuthCookieFromRequest, verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { chatHistory } from '@/lib/db/schema'

// ─── Visual Story Intent Detection ──────────────────────────────────────────

const VISUAL_STORY_TRIGGERS = [
  /\\bshow\\s+me\\b/i,
  /\\bvisualize\\b/i,
  /\\bmostre[\\s-]me\\b/i,
  /\\bem\\s+(quadros|cenas|frames)\\b/i,
  /\\bin\\s+(frames|scenes?|quadros?|cenas?)\\b/i,
  /\\bconta\\s+a\\s+hist[oó]ria\\s+de\\b/i,
  /\\btell\\s+me\\s+the\\s+story\\b.+\\b(in\\s+)?(frames|scenes?|images|illustrations?)\\b/i,
]

const AI_CONCEPT_KEYWORDS = [
  /\\brede\\s+neural\\b/i, /\\bmachine\\s+learning\\b/i, /\\bdeep\\s+learning\\b/i,
  /\\balgoritmo\\b/i, /\\binteligência\\s+artificial\\b/i, /\\btransformers?\\b/i,
  /\\bprocessamento\\s+de\\s+linguagem\\b/i, /\\bnlp\\b/i,
  /\\bvis[aã]o\\s+computacional\\b/i, /\\baprendizado\\s+(de|por)\\s+m[aá]quina\\b/i,
  /\\bgpt\\b/i, /\\bllm\\b/i, /\\bchatgpt\\b/i, /\\blangchain\\b/i,
  /\\bembedding\\b/i, /\\btokeniza[cç][aã]o\\b/i, /\\bfine[\\s-]?tuning\\b/i,
  /\\bprompt\\b/i, /\\brag\\b/i, /\\battention\\b/i,
  /\\bcomputa[cç][aã]o\\s+qu[aâ]ntica\\b/i,
  /\\bmodelo\\s+de\\s+linguagem\\b/i, /\\bgera[cç][aã]o\\s+de\\s+imagem\\b/i,
  /\\bdiffusion\\b/i, /\\bstable\\s+diffusion\\b/i,
  /\\bneural\\b/i, /\\bneur[oô]nios?\\b/i,
]

const QUESTION_PATTERNS = [
  /\\bo\\s+que\\s+é\\b/i, /\\bcomo\\s+funciona\\b/i,
  /\\bexplique\\b/i, /\\bexplica\\b/i, /\\bme\\s+explica\\b/i,
  /\\bwhat\\s+is\\b/i, /\\bhow\\s+does\\b/i, /\\bexplain\\b/i,
  /\\bcomo\\s+se\\s+faz\\b/i,
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const KNOWN_AGENTS = new Set(ALL_AGENTS.map((a: { id: string }) => a.id))

async function getUserId(token: string | null): Promise<number | null> {
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  const id = Number(payload.userId)
  return Number.isInteger(id) && id > 0 ? id : null
}

function detectVisualStoryIntent(message: string): { detected: boolean; topic: string } {
  const clean = message.trim()
  const explicitMatch = VISUAL_STORY_TRIGGERS.some(p => p.test(clean))
  if (explicitMatch) {
    let topic = clean
      .replace(/\\b(show\\s+me|visualize|tell\\s+me\\s+the\\s+story|in\\s+(frames|scenes?|images?|quadros?|cenas?)|mostre[\\s-]me|conta\\s+a\\s+hist[oó]ria\\s+de|em\\s+(quadros|cenas|frames)|cenas?)\\b/gi, '')
      .replace(/\\s{2,}/g, ' ').trim()
    if (topic.length < 10) topic = clean.replace(/\\b(in\\s+)?(\\d+)\\s*(frames|scenes?|cenas?|quadros?)\\b/gi, '').trim()
    return { detected: true, topic: topic || clean }
  }
  const hasConcept = AI_CONCEPT_KEYWORDS.some(p => p.test(clean))
  const hasQuestion = QUESTION_PATTERNS.some(p => p.test(clean))
  if (hasConcept && hasQuestion) return { detected: true, topic: clean }
  if (hasConcept && clean.length > 5 && clean.length < 80) return { detected: true, topic: `como funciona ${clean}` }
  return { detected: false, topic: '' }
}

function extractFrameCount(message: string): number {
  const match = message.match(/\\b(\\d+)\\s*(frames|scenes?|cenas?|quadros?)\\b/i)
  return match ? parseInt(match[1], 10) : 5
}

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const token = getAuthCookieFromRequest(request)
    const userId = await getUserId(token)
    // userId is optional — unauthenticated users can still chat (but without memory/persistence)

    // ── Parse body ──────────────────────────────────────────────────────────
    const { agentId, message, history } = await request.json()
    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message required' }, { status: 400 })
    }

    const agentKey = agentId.toLowerCase()
    if (!KNOWN_AGENTS.has(agentKey)) {
      return NextResponse.json({ error: `Agent ${agentId} not found` }, { status: 404 })
    }

    // ── Step 1: Router — adaptive narrative routing ─────────────────────────
    let routerDecision = null
    if (userId) {
      try {
        routerDecision = await routeAdaptiveNarrative({
          userId,
          userText: message,
          currentAgent: agentKey,
        })
      } catch (routerErr) {
        console.warn('[AgentChat] Router unavailable, falling back to direct agent:', routerErr)
      }
    }

    // ── Visual Story detection (NEXUS only) ─────────────────────────────────
    if (agentKey === 'nexus') {
      const { detected, topic } = detectVisualStoryIntent(message)
      if (detected && topic.length >= 5) {
        return NextResponse.json({
          type: 'visual_story',
          response: `Teus olhos já viram muito — mas ainda não viram ${topic.toLowerCase()}. Deixe-me tecer essa história em ${extractFrameCount(message)} cenas...`,
          topic,
          frames: extractFrameCount(message),
          agentId: 'nexus',
          timestamp: new Date().toISOString(),
        })
      }
    }

    // ── Step 2: Prompt Builder — build full system prompt ───────────────────
    const systemPrompt = buildSystemPromptForAgent(agentKey as AgentId, {
      userId: userId ?? 0,
      emotionalScore: 0,
      intellectualScore: 0,
      moralScore: 0,
      archetype: (routerDecision?.archetype as string | undefined) ?? 'creative',
      currentAgent: agentKey as AgentId,
      decisionHistory: [],
      lastUpdated: Date.now(),
    })

    // ── Step 3: Memory Injection ────────────────────────────────────────────
    let memoryContext = ''
    if (userId) {
      try {
        memoryContext = await getMemoryContext({ userId, agentId: agentKey, limit: 4 })
      } catch (memErr) {
        console.warn('[AgentChat] Memory unavailable:', memErr)
      }
    }

    // ── Step 4: Conflict Injection ──────────────────────────────────────────
    let conflictAugmentedPrompt = systemPrompt
    if (userId) {
      const conflict = detectConflict(agentKey)
      if (conflict) {
        conflictAugmentedPrompt = injectConflictIntoPrompt(systemPrompt, agentKey)
      }
    }

    // ── Assembled prompt ────────────────────────────────────────────────────
    const assembledPrompt = memoryContext
      ? `${conflictAugmentedPrompt}

// MEMORY CONTEXT — what NEXUS remembers about you
${memoryContext}`
      : conflictAugmentedPrompt

    // ── Step 5: LLM Call ───────────────────────────────────────────────────
    const response = await runAgent(assembledPrompt, message, history || [])

    // ── Step 6: Persistence ─────────────────────────────────────────────────
    if (userId) {
      db.insert(chatHistory).values({
        userId,
        userMessage: message,
        botResponse: response,
        context: routerDecision
          ? {
              router: {
                archetype: routerDecision.archetype,
                selectedUniverse: routerDecision.selectedUniverse,
                reason: routerDecision.reason,
              },
            }
          : null,
      }).catch((err: unknown) => {
        console.warn('[AgentChat] Persistence unavailable:', err)
      })
    }

    // ── Response ────────────────────────────────────────────────────────────
    return NextResponse.json({
      type: 'chat',
      response,
      agentId,
      router: routerDecision
        ? {
            archetype: routerDecision.archetype,
            selectedUniverse: routerDecision.selectedUniverse,
            reason: routerDecision.reason,
            hasConflict: routerDecision.hasConflict,
          }
        : null,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('[AgentChat] error:', error)
    return NextResponse.json(
      { error: 'Agent temporarily unavailable' },
      { status: 500 }
    )
  }
}
