# UNIVERSE RUNTIME — Architecture Specification

> **Status:** FOUNDATION FREEZE — Phase 1
> **Version:** 1.0.0
> **Last Updated:** 2026-05-23

---

## 1. OVERVIEW

MENTE.AI is no longer a web application. It is a **spatial cognitive operating system** where:

- **The Universe** is the operating system
- **Planets** are contextual cognitive applications
- **Signals** represent progression
- **The Map** is a live mission dashboard (not navigation UI)

This document defines the runtime architecture that all future systems obey.

---

## 2. RUNTIME HIERARCHY

```
┌──────────────────────────────────────────────────┐
│                   UNIVERSE MAP                     │
│  (Visual representation — reads state, never      │
│   writes it. All mutations flow through engine.)  │
└────────────────────┬─────────────────────────────┘
                     │ reads state
┌────────────────────▼─────────────────────────────┐
│               PROGRESSION ENGINE                   │
│  (Deterministic state machine. Validates,          │
│   calculates, emits events.)                       │
└────────────────────┬─────────────────────────────┘
                     │ emits events
┌────────────────────▼─────────────────────────────┐
│                  EVENT BUS                         │
│  (Decouples all subsystems. Fire-and-forget.       │
│   No component talks to another directly.)         │
└──────┬──────────────┬──────────────┬─────────────┘
       │              │              │
┌──────▼─────┐ ┌──────▼─────┐ ┌──────▼─────┐
│   AUDIO    │ │  CONTEXT   │ │   PROMPT   │
│  MANAGER   │ │ COMPRESSOR │ │   LOADER   │
│ (Singleton)│ │ (Pre-inf.) │ │  (Dynamic) │
└────────────┘ └────────────┘ └────────────┘
```

**Rule:** Data flows DOWN. Events flow UP. Never both.

---

## 3. CORE MODULES

### 3.1 Planet Registry (`planet-registry.ts`)

- Planets are **configuration objects only**
- Zero behavior, zero hardcoded logic in components
- Each planet config controls: identity, unlocks, requirements, threat, prompt key, audio, tokens
- Registry is `as const` — immutable type-level safety

### 3.2 Event Bus (`event-bus.ts`)

- Typed event system
- Subscribers filter by event type
- Emitters fire into the void — no return value, no coupling
- One subscriber crash never affects others
- Singleton: entire app shares one bus

### 3.3 Progression Engine (`progression-engine.ts`)

- Pure functions calculate planet state
- Deterministic: same input always produces same output
- Cooldown system prevents rapid-fire progression
- Max 2 active hints at any time
- All unlocks validated before state transitions
- Flow: AI → Hint → Validation → Engine → Store → UI

### 3.4 Context Compressor (`context-compressor.ts`)

- NEVER send full conversation history to AI
- Extracts: key concepts, insights, user level, intent
- Enforces `maxContextTokens` from planet registry
- Returns compressed context + last 3 raw messages
- Lightweight heuristics — no LLM call for compression

### 3.5 Prompt Loader (`prompt-loader.ts`)

- Prompts load dynamically at inference time
- In-memory cache (Map)
- Fallback prompts generated from registry config
- Prompts NEVER bundled into client code
- Registry stores only `promptKey`

### 3.6 Audio Manager (`audio-manager.ts`)

- Singleton AudioContext
- Lazy initialization (first user gesture)
- NO autoplay
- NO audio logic inside React components
- Audio signatures map to procedural sound generation
- Reacts only through event bus

---

## 4. DATA FLOW

### Progression Update Flow

```
User completes mission
  → API validates
    → Progression Engine (completePlanet)
      → Validates state
      → Calculates unlocks
      → Returns new progression
      → Emits: PLANET_COMPLETED + PLANET_UNLOCKED + SIGNAL_DETECTED
        → UI reads new state, re-renders
        → Audio reacts to events
```

### Inference Flow

```
User sends message
  → Context Compressor (compressMemory)
    → Extracts concepts, insights, intent
    → Returns CompressedContext
  → Prompt Loader (loadPlanetPrompt)
    → Resolves prompt from cache or fallback
  → Build payload: compressed context + system prompt + last 3 messages
  → Send to LLM
```

---

## 5. IMMUTABLE RULES

1. **Config-driven** — planet behavior comes from registry, not from component code
2. **Event-driven** — no component directly controls another
3. **Deterministic** — progression is a pure function of state + input
4. **Runtime-oriented** — all logic is runtime-resolved, not compile-time
5. **No hardcoded planets** — adding a planet is a registry entry, not a code change
6. **Compressed inference** — full history stays in DB, AI gets compressed context
7. **Zero autoplay** — audio only through user gesture + events

---

## 6. EXTENSION POINTS

| Extension | How | Where |
|-----------|-----|-------|
| New planet | Add entry to `planetRegistry` | `planet-registry.ts` |
| New unlock rule | Add to `completePlanet` logic | `progression-engine.ts` |
| New event type | Add to `UniverseEvent` union | `event-bus.ts` |
| New audio signature | Add handler in `playSignature` | `audio-manager.ts` |
| New prompt | Add `.txt` file or update fallback | `prompt-loader.ts` |
| New compression heuristic | Add extractor function | `context-compressor.ts` |

---

## 7. PHASE 1 DELIVERABLES

- [x] `planet-registry.ts` — 12 planets, config-only
- [x] `event-bus.ts` — typed pub/sub
- [x] `progression-engine.ts` — deterministic state machine
- [x] `context-compressor.ts` — memory compaction
- [x] `prompt-loader.ts` — dynamic prompt resolution
- [x] `audio-manager.ts` — singleton audio system
- [ ] `PlanetNode.tsx` — UI adapter
- [ ] `UniverseHUD.tsx` — system status display
- [ ] `MissionOrbit.tsx` — orbital connection renderer
- [ ] Contextualized lab page
- [ ] Minimal universe integration

---

## 8. NEXT PHASE

**Phase 2 — Visual Scaffolding:**
- Implement full audio signature generators
- Create prompt files for all 12 planets
- Add PlanetNode visual states
- Build MissionOrbit SVG renderer
- Wire audio signatures to planet focus

**Phase 3 — AAA Perception Layer:**
- Cinematic transitions between planets
- Spatial audio positioning
- Advanced particle effects (Three.js)
- Full planet detail views
