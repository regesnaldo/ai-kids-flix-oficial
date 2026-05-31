/**
 * ─── LangChain config — DEPRECATED ──────────────────────────────────────
 *
 * This file now delegates to src/lib/llm/provider.ts.
 * Kept for backward compatibility — all consumers of createAgentLLM()
 * continue working without changes.
 *
 * New code: import { createLLM } from '@/lib/llm/provider'
 */

import { createLLM } from '@/lib/llm/provider'

/** @deprecated Use createLLM() from @/lib/llm/provider instead. */
export const createAgentLLM = () => createLLM({ provider: 'auto' })
