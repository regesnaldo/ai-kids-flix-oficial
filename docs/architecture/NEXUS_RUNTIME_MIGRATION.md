# NEXUS RUNTIME — Migration Map (Phase 0)

> Created: 2026-05-24 — FOUNDATION HARDENING Phase 0
> Status: Extraction complete. All existing components preserved.

---

## What Changed

Phase 0 extracts the NexusRuntime — the cognitive kernel — from dispersed implicit
logic across routes and makes it an explicit singleton with clear authority boundaries.

**Zero existing code was rewritten.** All files created are NEW additions.
Existing imports and APIs continue to work unchanged.

### New Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib/nexus/nexus.types.ts` | Canonical state shape, delta proposal protocol, ownership matrix | ~320 |
| `src/lib/nexus/nexus.events.ts` | Governed event bus + 3 new event channels | ~310 |
| `src/lib/nexus/nexus.guards.ts` | Runtime validation (5 guards) + conflict detection | ~380 |
| `src/lib/nexus/NexusRuntime.ts` | Singleton cognitive kernel | ~380 |
| `src/lib/nexus/index.ts` | Barrel export | ~65 |
| `src/lib/universe/index.ts` | Added nexus wiring comment (no code changes) | +13 lines |

### No Changes To

- `universeBus` (event-bus.ts) — wrapped, not modified
- `planetRegistry` (planet-registry.ts) — read by Nexus, not modified
- `progression-engine.ts` — pure functions used by guards, not modified
- `progression-engine.server.ts` — DB mutations, not modified
- `context-compressor.ts` — compression pipeline, not modified
- `audio-manager.ts` — singleton audio, not modified
- `ALL_AGENTS` (all-agents.ts) — static definitions, not modified
- All API routes (`/api/chat`, `/api/universo/chat`, etc.) — not modified
- All React components — not modified

---

## How Existing Components Wire Into NexusRuntime

### 1. universeBus → nexusBus

```
Before:  Components emit directly to universeBus
After:   Components emit through nexusBus (governed wrapper)
         Universe events are automatically forwarded to universeBus
         New Nexus events (MEMORY_SYNC, AGENT_LIFECYCLE, RUNTIME_HEALTH)
           flow ONLY through nexusBus

Usage changes:
  OLD: import { universeBus } from "@/lib/universe";
       universeBus.emit({ type: "PLANET_ACTIVATED", planetId: "nexus" });

  NEW: import { nexusBus } from "@/lib/nexus";
       // Same API — universe events still work
       nexusBus.emit({ type: "PLANET_ACTIVATED", planetId: "nexus" });

       // New event channels
       nexusBus.emit({ type: "AGENT_LIFECYCLE", subtype: "REGISTERED", ... });
```

### 2. planetRegistry → Nexus Agent Registration

```
Before:  planetRegistry used directly by components for planet config
After:   Same. Nexus also reads planetRegistry at init() to register all agents.
         Each planet becomes an agent in the agentRecords.

Flow:
  nexusRuntime.init()
    → reads ALL_PLANET_IDS from planetRegistry
    → matches with ALL_AGENTS definitions
    → calls registerAgent() for each
    → agents transition: unregistered → initializing → active
```

### 3. progression-engine → Nexus Guards

```
Before:  Progression mutations done via progression-engine.server.ts functions
After:   Same. Nexus guards also use calculatePlanetState() for validation.
         Agents propose planet changes → Nexus validates → calls existing functions.

Flow:
  Agent: submitProposal({ type: "PLANET_ACTIVATE", payload: { planetId: "kaos" } })
    → Nexus: validateProposal() → validateStateTransition() → validatePlanetActivate()
    → Nexus: applyDelta() → updates state.playerProgression
```

### 4. context-compressor → Nexus Memory Governance

```
Before:  compressMemory() called directly, emits CONTEXT_COMPRESSED event
After:   Same. Nexus governs access via MEMORY_SYNC events.
         Memory Keeper (future) responds to MEMORY_SYNC events.

Flow:
  Nexus.requestMemorySync(userId, planetId)
    → emits MEMORY_SYNC:CONTEXT_COMPACTION_REQUESTED
    → Memory Keeper (future) compresses and responds
    → Nexus updates state.compressedContext
```

### 5. audio-manager → Nexus Lifecycle Management

```
Before:  audioManager.init() called on user gesture
After:   Same. Nexus can suspend/resume audio via agent lifecycle transitions.
         When an agent is suspended, Nexus can suspend its audio.

Flow:
  Nexus.transitionAgent("kaos", "suspended", "Resource constraint")
    → audioManager.suspend() (if kaos was playing)
```

### 6. ALL_AGENTS → Nexus Agent Records

```
Before:  ALL_AGENTS is a static export used directly by components and routes
After:   Same. Nexus reads ALL_AGENTS at init() to populate agentRecords.
         Components can still import ALL_AGENTS directly for display purposes.
         Runtime state (lifecycle, scope, sessions) lives in Nexus, not in ALL_AGENTS.
```

---

## Ownership Matrix (Type-Level Enforcement)

| Asset | Owner | Write Access | Read Access |
|-------|-------|-------------|-------------|
| Global Runtime State | Nexus | Nexus only | Nexus, Memory Keeper, Runtime Layer, Event Bus |
| User Cognitive Profile | Memory Keeper | Memory Keeper + Nexus | Nexus, Memory Keeper, Runtime Layer |
| Session Context | Runtime Layer | Runtime Layer + Nexus | Nexus, Memory Keeper, Runtime Layer |
| Event Log | Event Bus | All (append-only) | All |
| Agent Registry | Nexus | Nexus only | Nexus, Memory Keeper, Runtime Layer, Event Bus |

---

## New Event Channels

| Channel | Purpose | Emitter | Subscribers |
|---------|---------|---------|-------------|
| MEMORY_SYNC | Memory Keeper ↔ Nexus sync | Memory Keeper | Nexus, Context Compressor |
| AGENT_LIFECYCLE | Agent state transitions | Nexus only | UI, Audio Manager, Health Monitor |
| RUNTIME_HEALTH | Health monitoring | Nexus (periodic) | Health Dashboard, Alerting |

---

## Integration Checklist (Future Phases)

Phase 0 is extraction only. These integration points will be wired in Phase 1+:

- [ ] Wire `nexusRuntime.init()` into app startup (`layout.tsx` or `_app.tsx`)
- [ ] Replace direct `universeBus.emit()` calls in API routes with `nexusBus.emit()`
- [ ] Wire agent lifecycle events to audio-manager (suspend audio on agent suspend)
- [ ] Implement Memory Keeper as a Nexus-registered agent
- [ ] Add runtime health dashboard component
- [ ] Wire `nexusRuntime.submitProposal()` into `/api/universo/chat`
- [ ] Add proposal queue with FIFO ordering for concurrent proposals
- [ ] Implement persistence for NexusCanonicalState (currently in-memory)

---

## Validation Rules (Self-Check)

These rules were applied during Phase 0 creation. Verify:

- [x] No React components in deliverables
- [x] No UI organization or routing
- [x] No frontend-first patterns
- [x] Runtime contracts with TypeScript interfaces
- [x] Singleton extraction with dependency injection
- [x] Event governance layer (nexusBus wraps universeBus)
- [x] State ownership enforcement (ownership matrix in types)
- [x] ALL existing components preserved (universeBus, planetRegistry, progression-engine, context-compressor, audio-manager, ALL_AGENTS)
- [x] Zero breaking changes to existing APIs
