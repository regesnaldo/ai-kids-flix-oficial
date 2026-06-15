# MENTE.AI — SYSTEM RUNTIME ARCHITECTURE BLUEPRINT

> **Principal Systems Architect:** Hermes Agent
> **Derived from:** Cognitive Topology Map (2026-05-24)
> **Grounded in:** Current codebase at `/src/lib/universe/`, `/src/canon/agents/`, `/src/app/api/`
> **Status:** ARCHITECTURAL BLUEPRINT — implementation roadmap
> **CONSTITUTION:** FOUNDATION FREEZE active — runtime-first, config-driven, event-driven

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Runtime Architecture Diagram](#2-runtime-architecture-diagram)
3. [System Layers — 5-Tier Hierarchy](#3-system-layers)
4. [Core Orchestration — Nexus Core](#4-core-orchestration)
5. [Agent Governance](#5-agent-governance)
6. [Memory Architecture](#6-memory-architecture)
7. [Event Architecture](#7-event-architecture)
8. [Frontend Runtime](#8-frontend-runtime)
9. [Backend Infrastructure](#9-backend-infrastructure)
10. [Event Flow Diagram](#10-event-flow-diagram)
11. [Execution Priority Roadmap](#11-execution-priority-roadmap)
12. [Architectural Risk Analysis](#12-architectural-risk-analysis)

---

## 1. EXECUTIVE SUMMARY

The MENTE.AI ecosystem is evolving from a Next.js web application with AI features into a **multi-agent cognitive operating system**. The cognitive topology map defines 6 radial domains orbiting a central Nexus — not as UI pages, but as **runtime domains with agent jurisdiction, event subscriptions, and memory access contracts**.

### What Already Exists (Foundation)
- `UniverseEventBus` — singleton pub/sub event bus (proven, tested)
- `PlanetRegistry` — 12 planets with config-driven unlock trees
- `ProgressionEngine` — pure-function state machine (client + server)
- `ContextCompressor` — heuristic memory compaction before LLM inference
- `ALL_AGENTS` — 12 agent definitions with personality contracts
- Lab Agent Pipeline — sequential multi-agent execution (nexus→cipher→kaos→aurora)
- Universe Chat Route — adaptive agent routing with LangChain

### What Must Be Built (Gap Analysis)
- **Nexus Core** — explicit orchestrator (currently implicit/dispersed)
- **Agent Lifecycle** — spawn, pause, terminate, health check
- **Authority Matrix** — formalized read/write permissions per agent
- **Memory Keeper** — dedicated memory agent with access control
- **Guardian Agent** — ethics/governance runtime enforcement
- **Recursive Delegation** — Nexus → secondary agent spawning
- **WebSocket Realtime Sync** — push STATE_UPDATED to UI runtime
- **Gamification Engine** — progression-triggered achievement pipeline
- **Expansion Layer SDK** — isolated public API mesh

---

## 2. RUNTIME ARCHITECTURE DIAGRAM

```
                           ┌──────────────────────────────────────┐
                           │      EXPANSION LAYER (Layer 5)       │
                           │  ┌─────────┐  ┌─────────┐           │
                           │  │ SDK     │  │ External│           │
                           │  │ Gateway │  │ API Mesh│           │
                           │  └────┬────┘  └────┬────┘           │
                           │       │            │                 │
                           │  ┌────┴────────────┴────┐           │
                           │  │  Community Interfaces │           │
                           │  └──────────────────────┘           │
                           └──────────────┬───────────────────────┘
                                          │ isolated channel
                           ┌──────────────┴───────────────────────┐
                           │     EXPERIENCE LAYER (Layer 4)       │
                           │  ┌──────────┐  ┌────────────────┐   │
                           │  │ UI       │  │ Cinematic      │   │
                           │  │Orchestrtr│  │ Boundaries     │   │
                           │  └────┬─────┘  └───────┬────────┘   │
                           │       │                  │            │
                           │  ┌────┴──────────────────┴────┐      │
                           │  │  Realtime Sync (WebSocket)  │      │
                           │  └────────────┬───────────────┘      │
                           │               │ STATE_UPDATED         │
                           │  ┌────────────┴───────────────┐      │
                           │  │  User Journey Runtime       │      │
                           │  │  Adaptive UI Engine         │      │
                           │  └────────────────────────────┘      │
                           └──────────────┬───────────────────────┘
                                          │ consumes events
                           ┌──────────────┴───────────────────────┐
                           │      RUNTIME LAYER (Layer 3)         │
                           │  ┌──────────┐  ┌────────────────┐   │
                           │  │ Session  │  │ Execution      │   │
                           │  │ Manager  │  │ Context        │   │
                           │  └────┬─────┘  └───────┬────────┘   │
                           │       │                  │            │
                           │  ┌────┴──────────────────┴────┐      │
                           │  │  Gamification Engine        │      │
                           │  │  Sync Engines               │      │
                           │  └────────────────────────────┘      │
                           └──────────────┬───────────────────────┘
                                          │ agent execution
        ╔═════════════════════════════════╧══════════════════════════════════╗
        ║                    COGNITIVE LAYER (Layer 2)                       ║
        ║                                                                    ║
        ║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         ║
        ║  │ HERMES   │  │ TUTOR AI │  │ MYTHOS   │  │ NARRATOR │         ║
        ║  │ (dev)    │  │ (ensino) │  │ (hist)   │  │ (voz)    │         ║
        ║  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         ║
        ║       │              │              │              │               ║
        ║  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐         ║
        ║  │ GUARDIAN │  │ MEMORY   │  │ ADAPTIVE │  │ ASSESS   │         ║
        ║  │ (ética)  │  │ KEEPER   │  │ ENGINE   │  │ PIPELINE │         ║
        ║  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         ║
        ║       │              │              │              │               ║
        ║  ┌────┴──────────────┴──────────────┴──────────────┴────┐        ║
        ║  │              AUTHORITY MATRIX                         │        ║
        ║  └────────────────────────┬─────────────────────────────┘        ║
        ║                           │                                      ║
        ║  ┌────────────────────────┴─────────────────────────────┐        ║
        ║  │              MEMORY PIPELINES (4 tiers)               │        ║
        ║  │  Session │ Contextual │ Vector │ Architectural        │        ║
        ║  └──────────────────────────────────────────────────────┘        ║
        ╚═══════════════════════════════╤══════════════════════════════════╝
                                        │
        ╔═══════════════════════════════╧══════════════════════════════════╗
        ║                  FOUNDATION LAYER (Layer 1)                      ║
        ║                                                                  ║
        ║         ┌──────────────────────────────────────┐                ║
        ║         │           NEXUS CORE                  │                ║
        ║         │  ┌────────┐  ┌────────┐  ┌────────┐ │                ║
        ║         │  │Canonicl│  │ Agent  │  │ Event  │ │                ║
        ║         │  │ State  │  │ Lifecl │  │Bus Root│ │                ║
        ║         │  └────────┘  └────────┘  └────┬───┘ │                ║
        ║         │                        ┌──────┴───┐ │                ║
        ║         │                        │Bootstrap │ │                ║
        ║         │                        │ Sequence │ │                ║
        ║         └────────────────────────┴─────────┘ │                ║
        ║                                                                  ║
        ║  ┌──────────────────────────────────────────────────┐           ║
        ║  │  INFRASTRUCTURE                                   │           ║
        ║  │  TiDB (relational) │ Pinecone (vector) │ Groq    │           ║
        ║  │  Supabase (auth)   │ Vercel (hosting)   │ Stripe │           ║
        ║  └──────────────────────────────────────────────────┘           ║
        ╚══════════════════════════════════════════════════════════════════╝
```

---

## 3. SYSTEM LAYERS — 5-Tier Hierarchy

### Layer 1: FOUNDATION (Kernel)
**Location:** `/src/lib/nexus/` (to be created)
**Current analog:** `/src/lib/universe/` + implicit routing logic
**Ownership:** Nexus Core

| Component | Status | Description |
|-----------|--------|-------------|
| Canonical State | PARTIAL | ProgressionEngine holds player state; no global runtime state |
| Event Bus Root | EXISTS | `universeBus` — singleton pub/sub, synchronous dispatch |
| Bootstrap Sequence | MISSING | No explicit init flow; implicit in page mounts |
| Agent Lifecycle | MISSING | No spawn/pause/terminate; agents are stateless API calls |
| System Auth | EXISTS | JWT jose, cookie `mente_ai_token` |

**What to build:**
- `NexusRuntime` class — singleton holding `canonicalState`, `eventBus`, `agentRegistry`
- `bootstrap()` — initialization sequence that loads config, warms caches, validates schema
- `AgentLifecycleManager` — spawn(id), pause(id), resume(id), terminate(id), health(id)

### Layer 2: COGNITIVE (Agent Runtime)
**Location:** `/src/canon/agents/` + `/src/lib/agents/` (to be created)
**Current analog:** `ALL_AGENTS` array + per-route agent selection
**Ownership:** Agent Registry (managed by Nexus)

| Agent | Domain | Status | Jurisdiction |
|-------|--------|--------|-------------|
| NEXUS | Orchestration | EXISTS (partial) | Connects concepts, routes intents, delegates to sub-agents |
| HERMES | Development | EXISTS (this agent) | Code generation, docs, technical Q&A |
| TUTOR AI | Pedagogy | MISSING | Adaptive teaching, curriculum generation |
| MYTHOS | Narrative | MISSING | Storytelling, world-building, lore generation |
| NARRATOR | Audio | MISSING | Voice synthesis, ElevenLabs integration |
| GUARDIAN | Ethics | MISSING | Content safety, bias detection, alignment enforcement |
| MEMORY KEEPER | Memory | MISSING | Vector retrieval, session persistence, profile management |
| KAOS | Creative Chaos | EXISTS (lab pipeline) | Provocative perspective, creative disruption |
| CIPHER | Pattern Recognition | EXISTS (lab pipeline) | Hidden pattern discovery, encryption metaphors |
| AURORA | Synthesis | EXISTS (lab pipeline) | Poetic synthesis, final narrative integration |
| ETHOS | Philosophy/Ethics | DEFINED (not wired) | Ethics education, bias revelation |
| VOLT | Energy/Motivation | DEFINED (not wired) | Energetic teaching, neural network metaphors |

### Layer 3: RUNTIME (Execution)
**Location:** `/src/lib/runtime/` (to be created)
**Current analog:** `/src/lib/universe/progression-engine.ts`, `/src/lib/navigation-hints/`
**Ownership:** Runtime Layer (consumes Nexus state)

| Component | Status | Description |
|-----------|--------|-------------|
| Session Manager | PARTIAL | Board-store KV for lab; no unified session container |
| Execution Context | PARTIAL | Ad-hoc per API route; no shared execution sandbox |
| Sync Engines | MISSING | No STATE_UPDATED → UI push mechanism |
| Gamification Engine | PARTIAL | GamificationProvider exists; not event-driven yet |
| Progression Engine | EXISTS | Pure functions, config-driven, tested |

### Layer 4: EXPERIENCE (UI Runtime)
**Location:** `/src/components/` (scattered)
**Current analog:** React components + Zustand stores
**Ownership:** UI Orchestrator

| Component | Status | Description |
|-----------|--------|-------------|
| UI Orchestrator | PARTIAL | Zustand `useNavigationStore`; no centralized render controller |
| Cinematic Boundaries | EXISTS | `CinematicParticles`, `UniverseTransition`, `LabMotionController` |
| Realtime Sync | MISSING | No WebSocket; polling-based; page refresh for updates |
| Adaptive UI Engine | PARTIAL | HUD components (ScannerRing, SignalBars); no runtime adaptation |
| User Journey Runtime | PARTIAL | Navigation hints system exists; not connected to gamification |

### Layer 5: EXPANSION (External)
**Location:** `/src/app/api/` (public routes)
**Current analog:** API routes (blog, lab, universo, progression)
**Ownership:** SDK Gateway (read-only access to public state)

| Component | Status | Description |
|-----------|--------|-------------|
| SDK Gateway | MISSING | No public API surface for third-party developers |
| External API Mesh | MISSING | No integration mesh for partner services |
| Community Interfaces | MISSING | No contribution pipeline or plugin system |
| Documentation | PARTIAL | Hermes Agent generates docs; no auto-generated API reference |

**ISOLATION RULE:** Layer 5 has ZERO write access to canonical state. All writes go through Layer 3 → Layer 1 validation.

---

## 4. CORE ORCHESTRATION — NEXUS CORE

### 4.1 Nexus Runtime Contract

```typescript
// src/lib/nexus/NexusRuntime.ts (TO BE CREATED)

interface NexusRuntime {
  // ── State ─────────────────────────────────────────────────
  readonly canonicalState: CanonicalState;           // single source of truth
  readonly agentRegistry: Map<AgentId, AgentInstance>; // running agents
  readonly eventBus: UniverseEventBus;               // root event bus

  // ── Lifecycle ─────────────────────────────────────────────
  bootstrap(): Promise<void>;                        // init sequence
  shutdown(): Promise<void>;                         // graceful drain

  // ── Agent Management ─────────────────────────────────────
  spawnAgent(agentId: AgentId, context: ExecutionContext): AgentHandle;
  pauseAgent(handle: AgentHandle): void;
  resumeAgent(handle: AgentHandle): void;
  terminateAgent(handle: AgentHandle): void;
  healthCheck(handle: AgentHandle): AgentHealth;

  // ── State Operations ──────────────────────────────────────
  validateStateDelta(delta: StateDelta): boolean;
  applyStateDelta(delta: StateDelta): void;          // only Nexus writes
  getStateSnapshot(): CanonicalState;               // read-only for all

  // ── Event Bus ─────────────────────────────────────────────
  createChannel(name: string, scope: ChannelScope): EventChannel;
  destroyChannel(name: string): void;
}
```

### 4.2 Canonical State Shape

```typescript
interface CanonicalState {
  runtime: {
    version: string;
    uptime: number;
    activeAgentCount: number;
    bootstrapComplete: boolean;
  };
  user: {
    profile: UserCognitiveProfile;
    progression: PlayerProgression;       // from ProgressionEngine
    gamification: GamificationState;
  };
  session: {
    id: string;
    startedAt: number;
    currentAgent: AgentId | null;
    activeChannels: string[];
  };
  topology: {
    agents: Map<AgentId, AgentStatus>;    // who's running, paused, etc.
    channels: Map<string, ChannelStatus>;
    memoryPipelines: MemoryPipelineState[];
  };
}
```

### 4.3 Nexus DOES NOT
- Generate content (agents do that)
- Execute pedagogical logic (Tutor AI does that)
- Render UI (Experience Layer does that)
- Store memory directly (Memory Keeper does that)
- Make ethical decisions (Guardian advises; human decides)

---

## 5. AGENT GOVERNANCE

### 5.1 Authority Matrix

| Asset | Owner | Read Access | Write Access |
|-------|-------|-------------|--------------|
| Global Runtime State | Nexus | All agents (R/O) | **Nexus only** |
| User Cognitive Profile | Memory Keeper | Nexus, Tutor AI | Memory Keeper, Nexus (sync) |
| Session Context | Runtime Layer | Current Agent | Current Agent, Nexus (sync) |
| Vector Memory | Pinecone (infra) | All agents via pipeline | **Ingestion Agent only** |
| Event Log | Event Bus | Observability agents | Event Bus (append-only) |
| Prompt Registry | Hermes Agent | All agents | Hermes Agent, Nexus |
| Agent Definitions | Canon Repository | All (R/O) | Hermes Agent, Architect |
| Gamification State | Gamification Engine | Nexus, Experience Layer | Gamification Engine |

### 5.2 Agent Communication Protocol

```
Agent → Agent: ONLY through event bus
Agent → Nexus: state_delta proposal (Nexus validates before applying)
Agent → Memory: through Memory Keeper pipeline (never direct DB access)
Agent → UI: NEVER directly. Emit event → Experience Layer consumes → renders
```

### 5.3 Agent Lifecycle State Machine

```
         ┌─────────┐
    ────→│REGISTERED│──── Nexus registers agent definition
         └────┬─────┘
              │ spawnAgent()
         ┌────┴─────┐
    ────→│  ACTIVE   │──── Agent executing with context
         └────┬─────┘
          ┌───┴───┐
     ┌────┴──┐ ┌──┴────┐
     │PAUSED │ │ERROR  │
     └───┬───┘ └──┬────┘
         │resume() │retry()
     ┌───┴───┐     │
     │ACTIVE │←────┘
     └───┬───┘
         │ terminateAgent()
     ┌───┴──────┐
     │TERMINATED│
     └──────────┘
```

### 5.4 Agent Isolation Boundaries

- **Memory isolation:** Agents share NO mutable state. All state passes through Nexus validation.
- **Execution isolation:** Each agent runs in its own execution context (API route or Web Worker).
- **Network isolation:** Agents do NOT call external APIs directly. All external calls go through a Gateway that logs and rate-limits.
- **Error isolation:** One agent crashing MUST NOT affect others. Event bus catches subscriber errors.

---

## 6. MEMORY ARCHITECTURE

### 6.1 Memory Tiers

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY ARCHITECTURE                       │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │  SESSION     │   │  CONTEXTUAL  │   │   VECTOR     │    │
│  │  (volatile)  │   │  (short-term)│   │  (long-term) │    │
│  │              │   │              │   │              │    │
│  │ TTL: session │   │ TTL: 24h     │   │ TTL: forever │    │
│  │ Owner: RT    │   │ Owner: Nexus │   │ Owner: Memory│    │
│  │ Layer        │   │ Core         │   │ Keeper       │    │
│  │              │   │              │   │              │    │
│  │ Stores:      │   │ Stores:      │   │ Stores:      │    │
│  │ - active     │   │ - compressed │   │ - embeddings │    │
│  │   planet     │   │   context    │   │ - knowledge  │    │
│  │ - current    │   │ - recent     │   │   vectors    │    │
│  │   agent      │   │   messages   │   │ - semantic   │    │
│  │ - UI state   │   │ - intent     │   │   memory     │    │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘    │
│         │                  │                  │              │
│         │    ┌─────────────┴─────────────┐    │              │
│         │    │  ARCHITECTURAL (system)   │    │              │
│         │    │                           │    │              │
│         │    │  TTL: permanent            │    │              │
│         │    │  Owner: Nexus Core         │    │              │
│         │    │                           │    │              │
│         │    │  Stores:                   │    │              │
│         │    │  - agent definitions       │    │              │
│         │    │  - planet registry         │    │              │
│         │    │  - prompt templates        │    │              │
│         │    │  - authority matrix        │    │              │
│         │    └─────────────┬─────────────┘    │              │
│         │                  │                  │              │
│    ┌────┴──────────────────┴──────────────────┴────┐         │
│    │           USER COGNITIVE PROFILE                │         │
│    │  TTL: permanent | Owner: Memory Keeper          │         │
│    │  Stores: archetype, emotional state, level,     │         │
│    │  learning style, competency map, gaps           │         │
│    └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Retrieval Pipeline

```
USER_SESSION_INIT
        │
        ▼
┌───────────────────┐
│ 1. Load Profile   │ ← Memory Keeper: UserCognitiveProfile from TiDB
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 2. Load Session   │ ← Session Manager: active planet, recent context
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 3. Vector Search  │ ← Pinecone: top-K semantic matches for user intent
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 4. Compress       │ ← ContextCompressor: merge into compact payload
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 5. Inject into    │ ← Agent receives: profile + session + vectors + compressed
│    Agent Context  │
└───────────────────┘
```

### 6.3 Synchronization Strategy

- **Session → Contextual:** On agent response, `compressMemory()` extracts insights
- **Contextual → Vector:** On session checkpoint, Memory Keeper generates embeddings and persists to Pinecone
- **Vector → Profile:** Periodic batch job updates UserCognitiveProfile from vector patterns
- **All → Architectural:** Agent definitions and config are source-of-truth in code; never derived from runtime

---

## 7. EVENT ARCHITECTURE

### 7.1 Event Bus Topology

```
                        ┌──────────────────┐
                        │  EVENT BUS ROOT   │
                        │  (universeBus)    │
                        └────────┬─────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
   ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐
   │ AGENT       │       │ STATE       │       │ UI          │
   │ CHANNEL     │       │ SYNC        │       │ RUNTIME     │
   │             │       │ CHANNEL     │       │ CHANNEL     │
   │ Events:     │       │ Events:     │       │ Events:     │
   │ - AGENT_*   │       │ - STATE_*   │       │ - RENDER_*  │
   │ - RESPONSE_*│       │ - DELTA_*   │       │ - CINEMATIC │
   │ - ERROR_*   │       │ - SYNC_*    │       │ - FEEDBACK  │
   └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
          │                      │                      │
   ┌──────┴──────┐       ┌──────┴──────┐       ┌──────┴──────┐
   │ MEMORY      │       │ GAMIFICATION│       │ EXPANSION   │
   │ CHANNEL     │       │ CHANNEL     │       │ CHANNEL     │
   │             │       │             │       │             │
   │ Events:     │       │ Events:     │       │ Events:     │
   │ - MEMORY_*  │       │ - ACHIEVE_* │       │ - SDK_*     │
   │ - RETRIEVE  │       │ - PROGRESS  │       │ - API_*     │
   │ - STORE     │       │ - BADGE     │       │ (isolated)  │
   └─────────────┘       └─────────────┘       └─────────────┘
```

### 7.2 Current vs Target Event Types

| Current (`UniverseEvent`) | Target (expanded) |
|---------------------------|-------------------|
| PLANET_UNLOCKED | PLANET_UNLOCKED |
| PLANET_ACTIVATED | PLANET_ACTIVATED |
| PLANET_COMPLETED | PLANET_COMPLETED |
| SIGNAL_DETECTED | SIGNAL_DETECTED |
| MISSION_COMPLETED | MISSION_COMPLETED |
| MISSION_FAILED | MISSION_FAILED |
| HINT_GENERATED | HINT_GENERATED |
| PROGRESSION_STATE_CHANGED | PROGRESSION_STATE_CHANGED |
| AUDIO_STATE_CHANGED | AUDIO_STATE_CHANGED |
| CONTEXT_COMPRESSED | CONTEXT_COMPRESSED |
| *(missing)* | AGENT_SPAWNED |
| *(missing)* | AGENT_PAUSED |
| *(missing)* | AGENT_TERMINATED |
| *(missing)* | AGENT_ERROR |
| *(missing)* | RESPONSE_GENERATED |
| *(missing)* | STATE_DELTA_PROPOSED |
| *(missing)* | STATE_DELTA_VALIDATED |
| *(missing)* | STATE_UPDATED |
| *(missing)* | MEMORY_RETRIEVED |
| *(missing)* | MEMORY_STORED |
| *(missing)* | ACHIEVEMENT_UNLOCKED |
| *(missing)* | CINEMATIC_TRIGGER |
| *(missing)* | SDK_REQUEST_RECEIVED |

### 7.3 Realtime Communication

**Current:** HTTP request/response (stateless, polling-based refresh)
**Target:** WebSocket for `STATE_UPDATED` → UI runtime push

```
┌──────────┐  WebSocket  ┌──────────────┐  subscribe()  ┌──────────┐
│  Nexus   │────────────→│ Realtime Sync │←──────────────│ UI Store │
│  Core    │ STATE_UPDATED│   Server     │  channel      │(Zustand) │
└──────────┘             └──────────────┘               └──────────┘
```

**Implementation path:**
1. Add `STATE_UPDATED` event to `universeBus`
2. Create `/api/realtime` WebSocket endpoint (Next.js Edge or Node.js)
3. UI Zustand stores subscribe to WebSocket channel
4. Fallback: HTTP polling (for environments without WebSocket support)

### 7.4 Queue Systems

For long-running agent tasks (content generation, vector embedding, batch processing):

```
Agent Request → Event Bus → Task Queue (BullMQ/Redis) → Worker → Agent Response → Event Bus
                                    ↑                                        │
                                    └────────── status updates ─────────────┘
```

---

## 8. FRONTEND RUNTIME

### 8.1 UI Orchestration

```
┌─────────────────────────────────────────────────────────────┐
│                    UI ORCHESTRATOR                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Zustand      │  │ React        │  │ Motion       │      │
│  │ State Stores │  │ Components   │  │ Controllers  │      │
│  │              │  │              │  │              │      │
│  │ - navigation │  │ - UniverseHU│  │ - QuantumLeap│      │
│  │ - gamificatn │  │ - PlanetNode │  │ - DeepScan   │      │
│  │ - session    │  │ - LabPrompt  │  │ - EchoPulse  │      │
│  │ - hud        │  │ - AgentPipe  │  │ - MemoryEcho │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │                │
│         └─────────┬───────┴─────────┬───────┘                │
│                   │                 │                        │
│            ┌──────┴─────────────────┴──────┐                 │
│            │     REALTIME SYNC ADAPTER      │                 │
│            │  (WebSocket → Zustand bridge)  │                 │
│            └───────────────┬───────────────┘                 │
│                            │                                  │
│                   STATE_UPDATED events                        │
└────────────────────────────┼──────────────────────────────────┘
```

### 8.2 Provider Hierarchy

```
<NexusProvider>              ← Reads canonical state snapshot, provides to tree
  <GamificationProvider>     ← Achievement tracking, progression display
    <SessionProvider>        ← Current agent, planet, context
      <UniverseHUD>          ← ScannerRing, SignalBars, ClassificationTag
        <PlanetNode />       ← Planet visualization (Three.js)
        <LabInterface />     ← Agent pipeline, prompt input, results
        <CinematicBoundaries>← Transitions, particles, motion cues
```

### 8.3 Cinematic UX Boundaries

Already implemented and proven:
- `QuantumLeap` — page transitions
- `DeepScan` — data loading states
- `EchoPulse` — notification pulses
- `SignalAcquisition` — data arrival feedback
- `MemoryEcho` — recall/context-loading feedback
- `LabMotionController` — lab-specific motion orchestration

**Rule:** Cinematic components subscribe to event bus. They never read state directly.

---

## 9. BACKEND INFRASTRUCTURE

### 9.1 Current Infrastructure Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL (Hosting)                          │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Next.js 16       │  │ API Routes       │  │ Edge Functions│ │
│  │ App Router       │  │ (Node.js)        │  │ (WebSocket?)  │ │
│  │                  │  │                  │  │               │ │
│  │ /(main)/universo │  │ /api/universo/*  │  │ /api/realtime │ │
│  │ /(main)/lab      │  │ /api/lab/*       │  │ (to be built) │ │
│  │ /onboarding      │  │ /api/blog/*      │  │               │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────────────┘ │
│           │                     │                                │
└───────────┼─────────────────────┼────────────────────────────────┘
            │                     │
    ┌───────┴───────┐     ┌───────┴───────┐
    │   TiDB Cloud  │     │    Groq       │
    │   (Drizzle)   │     │  (llama-3.3)  │
    └───────────────┘     └───────────────┘
            │                     │
    ┌───────┴───────┐     ┌───────┴───────┐
    │   Supabase    │     │  ElevenLabs   │
    │   (Auth)      │     │  (TTS)        │
    └───────────────┘     └───────────────┘
            │
    ┌───────┴───────┐
    │   Stripe      │
    │   (Payments)  │
    └───────────────┘
```

### 9.2 Target Infrastructure (expanded)

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL (Hosting)                          │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Next.js 16       │  │ API Routes       │  │ Edge (WS)     │ │
│  │ (App Router)     │  │ (Node.js)        │  │               │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘ │
│           │                     │                     │          │
└───────────┼─────────────────────┼─────────────────────┼──────────┘
            │                     │                     │
    ┌───────┴───────┐     ┌───────┴───────┐     ┌───────┴───────┐
    │   TiDB Cloud  │     │  LLM Gateway  │     │  Redis/Upstash│
    │   (Drizzle)   │     │               │     │  (Queue+Cache)│
    └───────────────┘     │  ┌─────────┐  │     └───────────────┘
                          │  │ Groq    │  │
    ┌───────────────┐     │  │ OpenAI  │  │     ┌───────────────┐
    │   Supabase    │     │  │Claude   │  │     │   Pinecone    │
    │   (Auth+Store)│     │  └─────────┘  │     │  (Vectors)    │
    └───────────────┘     └───────────────┘     └───────────────┘

    ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
    │   Stripe      │     │  ElevenLabs   │     │  Observability│
    │   (Payments)  │     │  (TTS)        │     │  (Sentry/     │
    └───────────────┘     └───────────────┘     │   PostHog)    │
                                                └───────────────┘
```

### 9.3 Bottlenecks & Scalability Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Groq single-model dependency** | HIGH | Multi-provider gateway with fallback chain (Groq→OpenAI→Anthropic) |
| **No WebSocket → polling** | HIGH | Implement `/api/realtime` with Server-Sent Events as fallback |
| **TiDB single-region** | MEDIUM | TiDB Cloud multi-region; cache hot data in Redis |
| **No task queue** | MEDIUM | BullMQ + Redis for long-running agent tasks |
| **Stateless agents** | MEDIUM | Agent state serialized to TiDB; resume from checkpoint |
| **No Pinecone yet** | MEDIUM | Implement as priority; semantic search is core to Memory Keeper |
| **Vercel cold starts** | LOW | Edge Functions for latency-sensitive routes; keep Node warm |
| **Context window limits** | LOW | ContextCompressor already handles this; monitor token usage |

---

## 10. EVENT FLOW DIAGRAM

### 10.1 Primary User Flow (Runtime Event Sequence)

```
USER_SENDS_MESSAGE
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│ 1. USER_SESSION_INIT                                          │
│    Nexus validates JWT, loads UserCognitiveProfile            │
│    Event: none (synchronous)                                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. AGENT_ROUTING_REQUEST                                      │
│    Nexus evaluates intent + profile → selects agent           │
│    Event: AGENT_SELECTED { agentId, reason, confidence }      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. MEMORY_RETRIEVAL_PIPELINE                                  │
│    Memory Keeper: profile → vectors → session → compressed    │
│    Events: MEMORY_RETRIEVED { tier, tokenCount }              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. AGENT_EXECUTION_CONTEXT                                    │
│    Agent receives: context + memory + authority scope         │
│    Event: AGENT_SPAWNED { agentId, contextSize }              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. EVENT_EMISSION                                             │
│    Agent emits RESPONSE_GENERATED + STATE_DELTA proposal      │
│    Event: RESPONSE_GENERATED { agentId, content, delta }      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. NEXUS_SYNC                                                 │
│    Nexus validates delta, updates canonical state             │
│    Events: STATE_DELTA_VALIDATED → STATE_UPDATED (broadcast)  │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 7a. UI Sync  │ │ 7b. Memory   │ │ 7c. Gamific. │
│ Experience   │ │ Keeper       │ │ Engine       │
│ Layer renders│ │ stores       │ │ checks       │
│ new state    │ │ checkpoint   │ │ achievements │
└──────────────┘ └──────────────┘ └──────┬───────┘
                                         │
                                         ▼
                              ┌──────────────────┐
                              │ 8. ACHIEVEMENT   │
                              │ if triggered:    │
                              │ ACHIEVEMENT_     │
                              │ UNLOCKED event   │
                              └──────────────────┘
```

### 10.2 Error Flow

```
AGENT_ERROR
    │
    ▼
┌──────────────────────────────────────────┐
│ Event Bus catches error (isolated)        │
│ Emits: AGENT_ERROR { agentId, error }     │
└──────────────────┬───────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ Nexus   │  │ Guardian │  │ UI       │
│ retry   │  │ logs     │  │ shows    │
│ or      │  │ safety   │  │ fallback │
│ failover│  │ check    │  │ message  │
└─────────┘  └──────────┘  └──────────┘
```

---

## 11. EXECUTION PRIORITY ROADMAP

### Phase 0: Foundation Hardening (NOW)
**Goal:** Everything that exists must be rock-solid before expansion.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 0.1 | Extract `NexusRuntime` singleton from implicit logic | `src/lib/nexus/NexusRuntime.ts` | 3h |
| 0.2 | Formalize `CanonicalState` type contract | `src/lib/nexus/types.ts` | 1h |
| 0.3 | Add missing event types to `universeBus` | `src/lib/universe/event-bus.ts` | 1h |
| 0.4 | Create `AgentLifecycleManager` | `src/lib/nexus/AgentLifecycle.ts` | 2h |
| 0.5 | Wire existing lab agents to lifecycle manager | `src/app/api/lab/agent/route.ts` | 2h |

### Phase 1: Agent Governance (WEEK 1-2)
**Goal:** Every agent has clear boundaries, permissions, and error isolation.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1.1 | Implement `AuthorityMatrix` with enforcement | `src/lib/nexus/AuthorityMatrix.ts` | 3h |
| 1.2 | Create `Memory Keeper` agent (vector retrieval pipeline) | `src/lib/agents/memory-keeper/` | 6h |
| 1.3 | Create `Guardian` agent (content safety, alignment) | `src/lib/agents/guardian/` | 4h |
| 1.4 | Implement `Tutor AI` agent (adaptive pedagogy) | `src/lib/agents/tutor-ai/` | 8h |
| 1.5 | Agent health monitoring + error recovery | `src/lib/nexus/AgentHealth.ts` | 3h |

### Phase 2: Memory Infrastructure (WEEK 2-3)
**Goal:** Full 4-tier memory architecture operational.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 2.1 | Set up Pinecone vector database | Infra + `src/lib/memory/vector-store.ts` | 4h |
| 2.2 | Implement `IngestionAgent` for vector writes | `src/lib/agents/ingestion/` | 4h |
| 2.3 | Create `MemoryRetrievalPipeline` | `src/lib/memory/retrieval-pipeline.ts` | 4h |
| 2.4 | Session checkpoint persistence to TiDB | `src/lib/memory/session-store.ts` | 3h |
| 2.5 | User Cognitive Profile schema + migration | `src/lib/db/schema-extensions.ts` | 2h |

### Phase 3: Event & Realtime (WEEK 3-4)
**Goal:** Push-based state sync, WebSocket, task queues.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 3.1 | WebSocket endpoint `/api/realtime` | `src/app/api/realtime/route.ts` | 5h |
| 3.2 | Zustand ↔ WebSocket bridge | `src/lib/realtime/ws-bridge.ts` | 3h |
| 3.3 | Gamification Engine — event-driven refactor | `src/lib/gamification/engine.ts` | 4h |
| 3.4 | BullMQ task queue for long-running agent ops | `src/lib/queue/` | 4h |
| 3.5 | SSE fallback for environments without WebSocket | `src/lib/realtime/sse-fallback.ts` | 2h |

### Phase 4: Experience Layer (WEEK 4-5)
**Goal:** Cinematic UI runtime fully event-driven.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 4.1 | `UIOrchestrator` — centralized render controller | `src/lib/experience/UIOrchestrator.ts` | 4h |
| 4.2 | Adaptive UI Engine — responds to progression state | `src/lib/experience/AdaptiveUI.ts` | 4h |
| 4.3 | User Journey Runtime — connected to gamification | `src/lib/experience/UserJourney.ts` | 3h |
| 4.4 | Cinematic trigger system (event → animation mapping) | `src/lib/experience/CinematicTriggers.ts` | 3h |

### Phase 5: Expansion Layer (WEEK 5-6)
**Goal:** Public SDK, API mesh, community interfaces.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 5.1 | SDK Gateway — typed public API surface | `src/lib/expansion/SDKGateway.ts` | 6h |
| 5.2 | API key management + rate limiting | `src/lib/expansion/APIKeys.ts` | 3h |
| 5.3 | Auto-generated API reference docs | `docs/api/` | 4h |
| 5.4 | Webhook system for external integrations | `src/lib/expansion/Webhooks.ts` | 4h |
| 5.5 | Sandbox environment for third-party agents | `src/lib/expansion/Sandbox.ts` | 6h |

---

## 12. ARCHITECTURAL RISK ANALYSIS

### 12.1 Critical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Nexus becomes monolith** | MEDIUM | HIGH | Strict interface contracts; every domain is a separate module; Nexus is ONLY orchestration — zero business logic |
| **Event bus saturation** | LOW | HIGH | Channel partitioning; rate limiting per subscriber; async queues for non-critical events |
| **Memory inconsistency** | MEDIUM | CRITICAL | Single writer per memory tier; Vector writes ONLY through IngestionAgent; Nexus sync validates before apply |
| **Agent cascading failures** | MEDIUM | HIGH | Error isolation in event bus (catch per subscriber); agent health checks; automatic pause on repeated errors |
| **Pinecone vendor lock-in** | LOW | MEDIUM | Abstract `VectorStore` interface; swap implementations without agent changes |
| **WebSocket scaling** | LOW | MEDIUM | Vercel Edge limits; fallback to SSE; for >1k concurrent, consider dedicated WS server |

### 12.2 Design Constraints (NON-NEGOTIABLE)

1. **Nexus NEVER executes business logic.** It validates, routes, and syncs. Nothing else.
2. **Agents NEVER write to canonical state directly.** Delta proposal → Nexus validation → apply.
3. **Expansion Layer has ZERO write access to internal state.** Read-only API mesh for external consumers.
4. **Every event is typed.** No `any`, no stringly-typed events. Use discriminated unions.
5. **Memory access is explicit.** No agent accesses a memory tier without declaring it in its authority contract.
6. **One writer per memory tier.** Vector writes = IngestionAgent. Profile writes = Memory Keeper + Nexus.
7. **Error isolation is mandatory.** One subscriber failure MUST NOT crash the event bus or other subscribers.

### 12.3 What NOT to Build (Anti-Patterns)

- ❌ **Microservice mesh** — premature. Stay monolithic Next.js until user count demands split.
- ❌ **GraphQL layer** — overkill for this stage. REST + WebSocket is sufficient.
- ❌ **Agent-to-agent direct calls** — always through event bus. Direct coupling is forbidden.
- ❌ **Real-time everything** — expensive. Only STATE_UPDATED and ACHIEVEMENT_UNLOCKED need push.
- ❌ **Plugin system before SDK** — plugins need a stable API surface. SDK first.
- ❌ **Multi-region deployment** — premature. Single Vercel region until latency data proves need.

---

## APPENDIX A: File Structure Target

```
src/
├── lib/
│   ├── nexus/                    # NEW — Layer 1: Foundation
│   │   ├── NexusRuntime.ts       # Singleton orchestrator
│   │   ├── CanonicalState.ts     # State type + validation
│   │   ├── AgentLifecycle.ts     # Spawn, pause, terminate
│   │   ├── AuthorityMatrix.ts    # Permission enforcement
│   │   ├── Bootstrap.ts          # Initialization sequence
│   │   └── __tests__/
│   │
│   ├── agents/                   # NEW — Agent implementations
│   │   ├── memory-keeper/        # Memory retrieval + profile
│   │   ├── guardian/             # Ethics + safety
│   │   ├── tutor-ai/             # Adaptive pedagogy
│   │   ├── mythos/               # Narrative generation
│   │   ├── narrator/             # Voice/TTS integration
│   │   └── ingestion/            # Vector write agent
│   │
│   ├── universe/                 # EXISTS — Planet + Progression
│   │   ├── event-bus.ts          # EXPAND — more event types
│   │   ├── planet-registry.ts    # Stable
│   │   ├── progression-engine.ts # Stable
│   │   ├── context-compressor.ts # Stable
│   │   └── ...
│   │
│   ├── memory/                   # NEW — Tier 2-3 memory
│   │   ├── vector-store.ts       # Pinecone abstraction
│   │   ├── retrieval-pipeline.ts # Full retrieval flow
│   │   ├── session-store.ts      # Session persistence
│   │   └── __tests__/
│   │
│   ├── realtime/                 # NEW — WebSocket + SSE
│   │   ├── ws-bridge.ts          # WebSocket → Zustand
│   │   ├── sse-fallback.ts       # Server-Sent Events
│   │   └── __tests__/
│   │
│   ├── gamification/             # NEW — Event-driven engine
│   │   ├── engine.ts             # Achievement pipeline
│   │   ├── triggers.ts           # Progression → achievement map
│   │   └── __tests__/
│   │
│   ├── experience/               # NEW — UI orchestration
│   │   ├── UIOrchestrator.ts     # Render controller
│   │   ├── AdaptiveUI.ts         # State → render mapping
│   │   ├── UserJourney.ts        # Journey state machine
│   │   ├── CinematicTriggers.ts  # Event → animation
│   │   └── __tests__/
│   │
│   ├── expansion/                # NEW — Public API mesh
│   │   ├── SDKGateway.ts         # Typed public API
│   │   ├── APIKeys.ts            # Key management
│   │   ├── Webhooks.ts           # Outbound webhooks
│   │   ├── Sandbox.ts            # Third-party agent sandbox
│   │   └── __tests__/
│   │
│   ├── queue/                    # NEW — Task queues
│   │   ├── worker.ts             # BullMQ worker
│   │   ├── jobs/                 # Job definitions
│   │   └── __tests__/
│   │
│   └── db/                       # EXISTS — Database
│       ├── schema.ts             # EXPAND — profile, memory tables
│       └── ...
│
├── canon/agents/                 # EXISTS — Agent definitions
│   ├── all-agents.ts             # EXPAND — new agents
│   └── types.ts                  # Stable
│
└── app/api/                      # EXISTS — API routes
    ├── realtime/route.ts         # NEW — WebSocket endpoint
    ├── sdk/                      # NEW — Public SDK routes
    └── ...
```

---

## APPENDIX B: Key Type Contracts

```typescript
// ─── Nexus Runtime Types ───────────────────────────────────────

type AgentId = 'nexus' | 'hermes' | 'tutor-ai' | 'mythos' | 'narrator'
  | 'guardian' | 'memory-keeper' | 'kaos' | 'cipher' | 'aurora'
  | 'ethos' | 'volt';

type AgentStatus = 'registered' | 'active' | 'paused' | 'error' | 'terminated';

interface AgentHandle {
  id: string;
  agentId: AgentId;
  status: AgentStatus;
  spawnedAt: number;
  context: ExecutionContext;
}

interface StateDelta {
  source: AgentId;
  target: keyof CanonicalState;
  operation: 'set' | 'merge' | 'delete';
  payload: unknown;
  timestamp: number;
}

interface ExecutionContext {
  sessionId: string;
  userId: number;
  planetId: PlanetId;
  memory: CompressedContext;
  permissions: PermissionSet;
  parentAgent?: AgentId;
}

// ─── Permission Types ──────────────────────────────────────────

interface PermissionSet {
  read: MemoryTier[];
  write: MemoryTier[];
  eventChannels: ChannelId[];
  maxTokens: number;
  timeoutMs: number;
}
```

---

*Blueprint generated 2026-05-24 by Hermes Agent acting as Principal Systems Architect.*
*Next step: Review with Reginaldo → approve Phase 0 → begin NexusRuntime extraction.*
