# Phase 2 — LangChain Readiness Report
Generated: 2026-05-31

## What exists

### Dependencies
- `@langchain/core: ^1.1.46` — installed
- `@langchain/openai: ^1.4.5` — installed

### Files

| File | Lines | Status | Description |
|------|-------|--------|-------------|
| `src/lib/langchain/config.ts` | 13 | ✅ Ready | ChatOpenAI config with Groq base URL. Uses `GROQ_MODEL` or fallback `llama-3.3-70b-versatile`. |
| `src/lib/langchain/agentRunner.ts` | 26 | ✅ Ready | `runAgent()` — invokes LLM with system + human messages. Returns string response. |
| `src/engine/langchain-integration.ts` | 325 | 🔄 Partial | Full narrative engine: Tree of Thoughts (OpenAI), archetype classification, agent routing, conflict detection. BUT: uses OpenAI fetch API directly, NOT LangChain abstractions. |
| `src/engine/router.ts` | — | 🔄 Exists | Router engine |
| `src/engine/backtrack.ts` | — | 🔄 Exists | Backtrack logic |
| `src/engine/profiler.ts` | — | 🔄 Exists | User profiling |
| `src/engine/phase-router.ts` | — | 🔄 Exists | Phase routing |
| `src/engine/narrative-transitions.ts` | — | 🔄 Exists | Narrative transitions |

### What's already working
- LangChain ChatOpenAI integration via Groq (used in `agentRunner.ts`)
- Tree of Thoughts system with OpenAI (standalone fetch, not LangChain pipeline)
- 12-agent routing engine with archetype classification
- Semantic signal detection (emotional, intellectual, moral — via regex, not embeddings)
- Conflict detection between agent pairs
- Dynamic system prompt builder per agent + user profile

## What is missing

### Critical gaps (blockers for Phase 2)

| Gap | Details | Depends on |
|-----|---------|------------|
| No automatic agent router | Agent selection is manual (user clicks a planet card). The routing engine exists in `langchain-integration.ts` but is NOT connected to the chat API. | Integration work |
| No conversation summarization | Long conversations have no summary mechanism. `agentRunner.ts` passes full history each call. | LangChain pipeline |
| No RAG / vector store | No embeddings, no vector DB, no retrieval. Memory engine uses TF-IDF + recency only. | LangChain + embedding model |
| DeepSeek V4 Pro not activated | The config uses Groq (llama-3.3-70b) and OpenAI (gpt-4o). DeepSeek is not configured as a LangChain provider. | Hermes account |
| `langchain-integration.ts` uses raw OpenAI fetch | The Tree of Thoughts and routing logic bypass LangChain abstractions. Would need refactoring to use LangChain chains. | Refactoring effort |

### Warnings

| Warning | Detail |
|---------|--------|
| No LANGCHAIN_API_KEY env var | LangChain project tracing not configured |
| Agent Bible prompts in `canon.ts` cover only 4 agents | `all-agents.ts` has 12, but canon.ts only defines NEXUS, CIPHER, KAOS, AURORA. Missing: VOLT, ETHOS, LYRA, AXIOM, STRATOS, TERRA, PRISM, JANUS |
| `langchain-integration.ts` duplicates conflict detection | `src/engine/agent-conflicts.ts` and `src/engine/langchain-integration.ts` both define conflict pairs. Need dedup. |

## Prerequisites before starting

- [ ] Activate DeepSeek V4 Pro on Hermes (required for LangChain Phase 2)
- [ ] Define Agent Bible prompts for all 12 agents in `canon.ts` (currently 4/12)
- [ ] Configure LANGCHAIN_API_KEY in Vercel environment variables
- [ ] Define Tree of Thought routing rules (exists partially, needs review)
- [ ] Review MASTER_SCREENPLAY.md Scene 10 for final routing spec
- [ ] Dedup conflict definitions between `agent-conflicts.ts` and `langchain-integration.ts`
- [ ] Decide: keep Groq + OpenAI, or migrate to DeepSeek V4 as primary LangChain provider?

## Estimated effort

| Phase | Task | Effort |
|-------|------|--------|
| P0 | Activate DeepSeek V4 Pro | External (Hermes) |
| P1 | Define remaining 8 agent prompts in canon.ts | 2-4 hours |
| P1 | Connect routing engine to chat API | 2-3 hours |
| P2 | Refactor langchain-integration.ts to use LangChain chains | 3-5 hours |
| P2 | Implement conversation summarization | 2-3 hours |
| P3 | RAG + vector embeddings | 5-8 hours (Phase 2+) |
| P3 | Conversation history across agents | 3-5 hours |

**Minimum viable Phase 2:** ~2-3 days (P0 + P1 items)
**Full Phase 2:** ~1-2 weeks (P0-P3 items)
