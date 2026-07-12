# MENTE.AI — Project Briefing (auto-generated)
> Gerado em 2026-06-07T14:47:38.690Z
> mente-ai-platform v1.0.0

## Visão Geral
- **Stack**: Next.js + TypeScript + Drizzle ORM + MySQL/TiDB
- **Agentes**: 36
- **Total de linhas TS**: ~42521
- **Dependências**: 31 production, 29 development
- **Scripts**: dev, dev:clean, build, start, lint, typecheck, test, test:watch, test:coverage, test:e2e, test:e2e:ui, test:all, quality, lighthouse, arch:map, arch:circular, arch:modules, arch:heatmap, arch:validate, arch:full, agents:generate, agents:images, agents:images:batch, agents:check, agents:retry, agents:translate-names, automate:all, commit, commit:quick, openhuman:briefing, demo:record, precommit

## Arquivos Foco

| Arquivo | Linhas | Exports | Imports | Deprecated |
|---------|--------|---------|---------|------------|
| src/app/api/chat/route.ts | 879 | runtime, POST | 10 |  |
| src/app/api/agents/chat/route.ts | 215 | POST | 11 |  |
| src/engine/router.ts | 279 | Archetype, UniverseId, RouterDecision, routeAdaptiveNarrative | 8 |  |
| src/engine/narrative-engine.ts | 318 | UserProfile, DecisionRecord, NarrativeDecision, analyzeNarrative, buildSystemPromptForAgent | 2 |  |
| src/engine/agent-conflicts.ts | 97 | AgentId, AgentConflict, AGENT_CONFLICTS, getConflictForAgents, getActiveConflicts | 0 |  |
| src/engine/narrative-transitions.ts | 156 | NarrativeTransition, findTransition, getNextAgentForTransition, shouldTriggerTransition | 1 |  |
| src/engine/phase-router.ts | 272 | PhaseRouterDecision, UserProgress, routeSeason, shouldBacktrackToPhase, canUnlockSeason, integrateWithMainRouter | 2 |  |
| src/engine/profiler.ts | 288 | EmotionalSignal, IntellectualSignal, MoralSignal, ProfileSignals, InteractionContext, extractProfileSignals, persistInteractionDecision, updateSilentProfile, getUserProfile, updateUserProfile, getLocalProfile | 4 |  |
| src/lib/engine/conflicts.ts | 151 | AgentId, Conflict, AGENT_CONFLICTS, getConflictPrompt, detectarConflito, agenteOponente | 0 |  |
| src/lib/agents/conflict-engine.ts | 51 | ConflictContext, detectConflict, injectConflictIntoPrompt, getNexusIntervention | 1 |  |
| src/lib/agent-runner.ts | 32 | runAgent | 1 | ⚠️ |
| src/lib/db/index.ts | 70 | db, pool | 3 |  |
| src/lib/db/schema.ts | 717 | users, User, InsertUser, series, Series, InsertSeries, episodes, Episode, InsertEpisode, watchProgress, WatchProgress, InsertWatchProgress, favorites, Favorite, InsertFavorite, chatHistory, ChatHistory, InsertChatHistory, userPreferences, UserPreferences, InsertUserPreferences, interactiveDecisions, InteractiveDecision, InsertInteractiveDecision, AI_KNOWLEDGE_LEVELS, AGE_GROUPS, TRACKS, PILLARS, AiKnowledgeLevel, AgeGroup, TrackId, PillarId, explorers, Explorer, NewExplorer, explorerProgress, ExplorerProgress, NewExplorerProgress, explorerDecisions, ExplorerDecision, NewExplorerDecision, profiles, Profile, InsertProfile, agentNotes, AgentNote, NewAgentNote, userXp, UserXp, CATEGORIAS_AGENTE, TIPOS_SINERGIA, CategoriaAgente, TipoSinergia, RequisitosDesbloqueio, agentMetadata, AgentMetadata, NewAgentMetadata, userAgentProgress, UserAgentProgress, NewUserAgentProgress, agentCombinations, AgentCombination, NewAgentCombination, userCombinations, UserCombination, NewUserCombination, MEMORY_TYPES, MemoryType, agentMemories, AgentMemory, NewAgentMemory, universeProgression, UniverseProgression, NewUniverseProgression, logosAttempts, LogosAttempt, COGNITIVE_LEVELS, CognitiveLevel, ASSET_TYPES, AssetType, EDITORIAL_STATUS, EditorialStatus, CONTENT_SOURCE, ContentSource, knowledgeUnit, KnowledgeUnit, NewKnowledgeUnit, knowledgeAsset, KnowledgeAsset, NewKnowledgeAsset, GRAPH_RELATIONSHIPS, GraphRelationship, knowledgeGraphEdge, KnowledgeGraphEdge, NewKnowledgeGraphEdge, NewLogosAttempt | 2 |  |
| src/canon/agents/canon.ts | 679 | AgentIdentity, AgentCognition, AgentRelationships, AgentDefinition, AgentId, AGENT_ORDER, AGENTS, AGENT_PROMPTS | 0 |  |
| src/canon/agents/all-agents.ts | 243 | NEXUS, KAOS, CIPHER, LYRA, AXIOM, STRATOS, TERRA, PRISM, JANUS, ALL_AGENTS | 1 |  |

## Estado dos Arquivos

### src/app/api/chat/route.ts (879 linhas)
**Exports:** runtime, POST
**Deprecated:** não

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { anthropicCompletionText, anthropicStream, type AnthropicMensagem } from "@/lib/anthropic";
import { detectarConflito, agenteOponente, getConflictPrompt } from "@/lib/engine/conflicts";
import { routeAdaptiveNarrative } from "@/engine/router";
import { getMemoryContext, getSemanticMemoryContext, storeMemory } from "@/lib/agent-memory";
import { analyzeIdentity, formatIdentityContext } from "@/lib/identity-profiler";
import {
...
```

---

### src/app/api/agents/chat/route.ts (215 linhas)
**Exports:** POST
**Deprecated:** não

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent-runner'
import { AGENT_PROMPTS, type AgentId } from '@/canon/agents/canon'
import { ALL_AGENTS } from '@/canon/agents/all-agents'
import { buildSystemPromptForAgent } from '@/engine/narrative-engine'
import { routeAdaptiveNarrative } from '@/engine/router'
import { getMemoryContext } from '@/lib/agent-memory'
import { detectConflict, injectConflictIntoPrompt, getNexusIntervention } from '@/lib/agents/conflict-engine'
...
```

---

### src/engine/router.ts (279 linhas)
**Exports:** Archetype, UniverseId, RouterDecision, routeAdaptiveNarrative
**Deprecated:** não

```typescript
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { interactiveDecisions } from "@/lib/db/schema";
// NOTE (Phase 0): universeTransitions and userProfiles are Phase 2 tables.
// All inserts/updates to those tables are stubbed out until migrations land.
import { getUserProfile, updateUserProfile } from "@/engine/profiler";
import { getActiveConflicts, type AgentId } from "./agent-conflicts";
import { findTransition } from "./narrative-transitions";
...
```

---

### src/engine/narrative-engine.ts (318 linhas)
**Exports:** UserProfile, DecisionRecord, NarrativeDecision, analyzeNarrative, buildSystemPromptForAgent
**Deprecated:** não

```typescript
/**
 * narrative-engine.ts — Motor de Narrativa Adaptativa
 * 
 * Implementa o motor de narrativa adaptativa com Tree of Thoughts (ToT)
 * via OpenAI API + heurísticas de perfil do usuário.
 * Monitora 3 dimensões: emocional, intelectual, moral.
 *
 * NOTA: originalmente chamava-se langchain-integration.ts, mas nunca usou
...
```

---

### src/engine/agent-conflicts.ts (97 linhas)
**Exports:** AgentId, AgentConflict, AGENT_CONFLICTS, getConflictForAgents, getActiveConflicts
**Deprecated:** não

```typescript
/**
 * agent-conflicts.ts - Sistema de Conflitos entre Agentes
 * 
 * Define os conflitos narrativos entre os 12 agentes do MENTE.AI
 * O usuário é o "árbitro" dessas disputas.
 */

export type AgentId =
...
```

---

### src/engine/narrative-transitions.ts (156 linhas)
**Exports:** NarrativeTransition, findTransition, getNextAgentForTransition, shouldTriggerTransition
**Deprecated:** não

```typescript
/**
 * narrative-transitions.ts - Sistema de Transições Narrativas
 * 
 * Gerencia as transições entre universos dos agentes
 * O agente atual planta a semente da próxima transição
 */

import type { AgentId } from './agent-conflicts';
...
```

---

### src/engine/phase-router.ts (272 linhas)
**Exports:** PhaseRouterDecision, UserProgress, routeSeason, shouldBacktrackToPhase, canUnlockSeason, integrateWithMainRouter
**Deprecated:** não

```typescript
/**
 * phase-router.ts - Roteamento por Fases e Temporadas
 * 
 * Sistema LEGO que conecta:
 * - 5 Fases Narrativas
 * - 50 Temporadas
 * - 12 Agentes
 * - 3 Dimensões do perfil
...
```

---

### src/engine/profiler.ts (288 linhas)
**Exports:** EmotionalSignal, IntellectualSignal, MoralSignal, ProfileSignals, InteractionContext, extractProfileSignals, persistInteractionDecision, updateSilentProfile, getUserProfile, updateUserProfile, getLocalProfile
**Deprecated:** não

```typescript
import { db } from "@/lib/db";
import { interactiveDecisions } from "@/lib/db/schema";
import { userProfile } from "@/lib/db/schema-narrative";
import { eq } from "drizzle-orm";

const VALID_ARCHETYPES = [
  "analytical", "rebel", "paralyzed", "empathetic", "strategic", "creative", "explorer",
];
...
```

---

### src/lib/engine/conflicts.ts (151 linhas)
**Exports:** AgentId, Conflict, AGENT_CONFLICTS, getConflictPrompt, detectarConflito, agenteOponente
**Deprecated:** não

```typescript
export type AgentId =
  | "nexus" | "volt" | "aurora" | "ethos" | "kaos"
  | "cipher" | "lyra" | "axiom" | "stratos" | "terra" | "prism" | "janus"

export interface Conflict {
  agents: [AgentId, AgentId]
  nature: string
  triggerKeywords: string[]
...
```

---

### src/lib/agents/conflict-engine.ts (51 linhas)
**Exports:** ConflictContext, detectConflict, injectConflictIntoPrompt, getNexusIntervention
**Deprecated:** não

```typescript
// conflict-engine.ts
// Cena 9 — Agent Conflict System Runtime
// MASTER_SCREENPLAY.md ACT II Scene 9

import { AGENT_CONFLICTS } from '../../engine/agent-conflicts'

export interface ConflictContext {
  agentId: string
...
```

---

### src/lib/agent-runner.ts (32 linhas)
**Exports:** runAgent
**Deprecated:** SIM

```typescript
// ─── Agent Runner — DEPRECATED ────────────────────────────────────────────
//
// Mantido para compatibilidade com /api/agents/chat e /api/visuals/storyboard.
// Novas implementações: use generateContent() de @/lib/llm/content-engine
//
// TODO: Migrar consumidores para Content Engine e remover este arquivo.

import { generateContent } from '@/lib/llm/content-engine'
...
```

---

### src/lib/db/index.ts (70 linhas)
**Exports:** db, pool
**Deprecated:** não

```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import "server-only";

let _pool: any;
let _db: any;
...
```

---

### src/lib/db/schema.ts (717 linhas)
**Exports:** users, User, InsertUser, series, Series, InsertSeries, episodes, Episode, InsertEpisode, watchProgress, WatchProgress, InsertWatchProgress, favorites, Favorite, InsertFavorite, chatHistory, ChatHistory, InsertChatHistory, userPreferences, UserPreferences, InsertUserPreferences, interactiveDecisions, InteractiveDecision, InsertInteractiveDecision, AI_KNOWLEDGE_LEVELS, AGE_GROUPS, TRACKS, PILLARS, AiKnowledgeLevel, AgeGroup, TrackId, PillarId, explorers, Explorer, NewExplorer, explorerProgress, ExplorerProgress, NewExplorerProgress, explorerDecisions, ExplorerDecision, NewExplorerDecision, profiles, Profile, InsertProfile, agentNotes, AgentNote, NewAgentNote, userXp, UserXp, CATEGORIAS_AGENTE, TIPOS_SINERGIA, CategoriaAgente, TipoSinergia, RequisitosDesbloqueio, agentMetadata, AgentMetadata, NewAgentMetadata, userAgentProgress, UserAgentProgress, NewUserAgentProgress, agentCombinations, AgentCombination, NewAgentCombination, userCombinations, UserCombination, NewUserCombination, MEMORY_TYPES, MemoryType, agentMemories, AgentMemory, NewAgentMemory, universeProgression, UniverseProgression, NewUniverseProgression, logosAttempts, LogosAttempt, COGNITIVE_LEVELS, CognitiveLevel, ASSET_TYPES, AssetType, EDITORIAL_STATUS, EditorialStatus, CONTENT_SOURCE, ContentSource, knowledgeUnit, KnowledgeUnit, NewKnowledgeUnit, knowledgeAsset, KnowledgeAsset, NewKnowledgeAsset, GRAPH_RELATIONSHIPS, GraphRelationship, knowledgeGraphEdge, KnowledgeGraphEdge, NewKnowledgeGraphEdge, NewLogosAttempt
**Deprecated:** não

```typescript
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json, uniqueIndex, primaryKey, index, float, real } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
...
```

---

### src/canon/agents/canon.ts (679 linhas)
**Exports:** AgentIdentity, AgentCognition, AgentRelationships, AgentDefinition, AgentId, AGENT_ORDER, AGENTS, AGENT_PROMPTS
**Deprecated:** não

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// COGNITIVE CANON — Fonte única de verdade do sistema de agentes MENTE.AI
// ═══════════════════════════════════════════════════════════════════════════
// Fonte: Biblia Cinematografica v1.0 + all-agents.ts (12 agentes canonicos)

export interface AgentIdentity {
  id: string
  name: string
...
```

---

### src/canon/agents/all-agents.ts (243 linhas)
**Exports:** NEXUS, KAOS, CIPHER, LYRA, AXIOM, STRATOS, TERRA, PRISM, JANUS, ALL_AGENTS
**Deprecated:** não

```typescript
import type { AgentDefinition } from "./types.ts";
export type { AgentDefinition } from "./types.ts";

// ============================================================================
// AGENTES DO LABORATÓRIO VIRTUAL — NEXUS, VOLT, AURORA, ETHOS
// ============================================================================

export const NEXUS: AgentDefinition = {
...
```

---


*Gerado por generate-briefing.mjs — execute novamente para atualizar*
