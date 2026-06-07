// ─── Agent Runner — DEPRECATED (ERA 0 audit: 2026-06-06) ──────────────────
//
// Mantido para compatibilidade com:
//   - /api/agents/chat/route.ts
//   - /api/visuals/storyboard/route.ts
//
// Migrar estes consumidores para generateContent() diretamente,
// depois remover este arquivo.

import { generateContent } from '@/lib/llm/content-engine'

export async function runAgent(
  systemPrompt: string,
  userMessage: string,
  history: { role: 'user' | 'assistant', content: string }[] = []
): Promise<string> {
  try {
    const result = await generateContent({
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' as const : 'system' as const,
          content: h.content,
        })),
        { role: 'user', content: userMessage },
      ],
    })
    return result.content
  } catch (error) {
    console.error('[AgentRunner] error:', error)
    throw new Error('Agent unavailable')
  }
}
