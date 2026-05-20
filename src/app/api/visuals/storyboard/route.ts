import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/langchain/agentRunner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryScene {
  id: number
  scene_title: string
  visual_description: string
  narration: string
  mood: string
  /** Pollinations.ai image URL — rendered on frontend */
  imageUrl: string
}

interface StoryboardResponse {
  title: string
  language: string
  total_frames: number
  scenes: StoryScene[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Builds a Pollinations.ai image URL from a visual description */
function buildImageUrl(description: string, id: number): string {
  const prompt = encodeURIComponent(
    `${description}, cinematic lighting, cyberpunk aesthetic, neon accents, dark background, high detail, 8k`
  )
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=576&seed=${id + 42}&nologo=true&enhance=true`
}

/** Strips markdown code fences that Groq sometimes wraps JSON in */
function extractJson(raw: string): string {
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
  return cleaned
}

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildStoryboardPrompt(topic: string, frames: number, language: string): string {
  return `You are a visual storyteller. Your ONLY output must be valid JSON — no markdown, no explanation.

Create a ${frames}-frame visual story about: "${topic}"

Rules:
- Each scene is a single "frame" in a visual journey
- Narration must be in ${language}
- Mood must be one of: wonder, tension, calm, power, mystery, hope, awe, curiosity
- visual_description must be a SHORT English prompt (max 30 words) describing what the image shows — good for AI image generation
- scene_title must be a short ${language} title (max 6 words)
- The story should have a clear arc: introduction → development → climax → resolution
- Use vivid, cinematic imagery

Output EXACTLY this JSON structure:
{
  "title": "Story Title",
  "language": "${language}",
  "total_frames": ${frames},
  "scenes": [
    {
      "id": 1,
      "scene_title": "Title in ${language}",
      "visual_description": "Short English image prompt",
      "narration": "Narrative text in ${language}",
      "mood": "wonder"
    }
  ]
}`
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const topic = body.topic as string | undefined
    const language = (body.language as string) || 'pt-BR'
    const frames = Math.min(Math.max(Number(body.frames) || 5, 3), 8) // clamp 3–8

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Tópico muito curto. Conte-me mais sobre o que você quer visualizar.' },
        { status: 400 }
      )
    }

    const systemPrompt = buildStoryboardPrompt(topic.trim(), frames, language)
    const groqResponse = await runAgent(systemPrompt, `Create a visual story about: ${topic.trim()}`)
    const jsonText = extractJson(groqResponse)

    let storyboard: StoryboardResponse
    try {
      storyboard = JSON.parse(jsonText) as StoryboardResponse
    } catch {
      // Groq returned invalid JSON — try again with stricter prompt
      const retryResponse = await runAgent(
        systemPrompt + '\n\nCRITICAL: Output ONLY the JSON object. No markdown. No backticks. Start with { and end with }.',
        `Topic: ${topic.trim()}. Return ONLY JSON.`
      )
      storyboard = JSON.parse(extractJson(retryResponse)) as StoryboardResponse
    }

    // Validate structure
    if (!storyboard.scenes || !Array.isArray(storyboard.scenes) || storyboard.scenes.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível gerar a história visual. Tente um tópico diferente.' },
        { status: 422 }
      )
    }

    // Add Pollinations.ai image URLs to each scene
    const scenes: StoryScene[] = storyboard.scenes.map((scene, index) => ({
      ...scene,
      id: index + 1,
      imageUrl: buildImageUrl(scene.visual_description, index),
    }))

    return NextResponse.json({
      title: storyboard.title,
      language: storyboard.language || language,
      total_frames: scenes.length,
      scenes,
    } satisfies StoryboardResponse)

  } catch (error) {
    console.error('[VisualStory] Erro:', error)
    return NextResponse.json(
      { error: 'Falha ao gerar história visual. Nossos artistas digitais estão descansando — tente novamente.' },
      { status: 500 }
    )
  }
}
