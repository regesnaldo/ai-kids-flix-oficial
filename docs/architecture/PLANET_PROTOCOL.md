# PLANET PROTOCOL — Configuration & Behavior Specification

> **Status:** FOUNDATION FREEZE
> **Version:** 1.0.0

---

## 1. PLANET DEFINITION

A Planet is a **configuration object** in `planet-registry.ts`. It has no behavior — behavior comes from the progression engine reacting to state transitions.

### 1.1 PlanetConfig Interface

```typescript
interface PlanetConfig {
  id: PlanetId;           // "nexus" | "kaos" | "lyra" | ...
  name: string;           // "NEXUS" (UPPERCASE)
  subtitle: string;       // Portuguese: "O Conector"
  color: string;           // Hex or rgba accent color
  clearance: ClearanceLevel;  // surface | deep | core | restricted
  threatLevel: ThreatLevel;   // low | elevated | critical
  promptKey: string;          // Pointer to external prompt file
  unlocks: PlanetId[];        // Planets unlocked when this is completed
  requires: PlanetId[];       // Planets that must be completed first
  audioSignature: AudioSignature;  // Procedural audio key
  maxContextTokens: number;         // Token budget for compressed context
}
```

---

## 2. PLANET REGISTRY (12 Planets)

### 2.1 Unlock Tree

```
                    ┌─────────┐
                    │  NEXUS  │ (starter)
                    │ surface │
                    │  low    │
                    └────┬────┘
              ┌──────────┴──────────┐
         ┌────▼────┐          ┌────▼────┐
         │  KAOS   │          │  LYRA   │
         │  deep   │          │  deep   │
         │ elevated│          │  low    │
         └────┬────┘          └────┬────┘
       ┌──────┴──────┐      ┌──────┴──────┐
  ┌────▼────┐  ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
  │  ETHOS  │  │ CIPHER  │ │  TERRA  │ │  PRISM  │
  │  core   │  │  core   │ │ surface │ │  core   │
  │  low    │  │ elevated│ │  low    │ │  low    │
  └────┬────┘  └────┬────┘ └────┬────┘ └────┬────┘
       │            │           │           │
  ┌────▼────┐  ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
  │  VOLT   │  │  AXIOM  │ │  JANUS  │ │ AURORA  │
  │  deep   │  │  core   │ │restricted│ │  core   │
  │ elevated│  │  low    │ │ critical│ │  low    │
  └────┬────┘  └─────────┘ └─────────┘ └─────────┘
       │
  ┌────▼────┐
  │ STRATOS │
  │restricted│
  │ critical│
  └─────────┘
```

### 2.2 Planet Details

| ID | Name | Subtitle | Clearance | Threat | Unlocks | Tokens |
|----|------|----------|-----------|--------|---------|--------|
| nexus | NEXUS | O Conector | surface | low | kaos, lyra | 4000 |
| kaos | KAOS | A Ruptura | deep | elevated | ethos, cipher | 3500 |
| lyra | LYRA | A Voz | deep | low | terra, prism | 5000 |
| ethos | ETHOS | A Bússola | core | low | volt | 4500 |
| cipher | CIPHER | O Decifrador | core | elevated | axiom | 3000 |
| terra | TERRA | A Fundação | surface | low | janus | 4000 |
| prism | PRISM | O Espectro | core | low | aurora | 3500 |
| volt | VOLT | A Corrente | deep | elevated | stratos | 3000 |
| axiom | AXIOM | O Princípio | core | low | — | 4000 |
| janus | JANUS | O Portal | restricted | critical | — | 2500 |
| aurora | AURORA | O Horizonte | core | low | — | 4000 |
| stratos | STRATOS | A Estratégia | restricted | critical | — | 2500 |

---

## 3. PLANET LIFECYCLE

### 3.1 State Machine

```
┌──────────────┐
│ undiscovered │  ← Initial state (or after reset)
└──────┬───────┘
       │ requiresMet() → true
       ▼
┌──────────────┐
│  available   │  ← SINAL DETECTADO
└──────┬───────┘
       │ user activates
       ▼
┌──────────────┐
│   active     │  ← MISSÃO EM ANDAMENTO
└──────┬───────┘
       │ mission completed
       ▼
┌──────────────┐
│  completed   │  ← DOMINADO
└──────────────┘
```

### 3.2 State Calculation (Pure Function)

```typescript
function calculatePlanetState(planetId, progression): PlanetState {
  // 1. Check prerequisites
  if (!allRequiresMet(planetId, progression)) return "undiscovered";
  // 2. Check if active
  if (planetId === progression.activePlanet) return "active";
  // 3. Check if completed
  if (progression.completed.includes(planetId)) return "completed";
  // 4. Check if available
  if (progression.available.includes(planetId)) return "available";
  // 5. Default
  return "undiscovered";
}
```

---

## 4. ADDING A NEW PLANET

1. Add entry to `planetRegistry` in `planet-registry.ts`
2. Add `promptKey` — create prompt file (or rely on fallback)
3. Update unlock tree — add this planet as `unlocks` on its parent
4. Update `PlanetId` type union
5. That's it. No component changes needed.

---

## 5. CLEARANCE LEVELS

| Level | Meaning | Visual |
|-------|---------|--------|
| `surface` | Public access, introductory | Slate (low opacity border) |
| `deep` | Intermediate, specialized | Cyan |
| `core` | Advanced, nucleus knowledge | Purple |
| `restricted` | Critical, sensitive | Red |

---

## 6. THREAT LEVELS

| Level | Meaning | Audio Character |
|-------|---------|-----------------|
| `low` | Safe exploration | Calm, harmonic |
| `elevated` | Challenging territory | Tense, dissonant |
| `critical` | High-stakes domain | Intense, urgent |
