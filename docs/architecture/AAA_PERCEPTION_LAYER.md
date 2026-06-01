# AAA PERCEPTION LAYER — Design Specification

> **Status:** FOUNDATION FREEZE — Phase 1 (specification only)
> **Version:** 1.0.0

---

## 1. PHILOSOPHY

AAA perception is not about graphical fidelity. It is about **coherent system behavior** that creates the illusion of a living, breathing universe.

A AAA perception layer achieves this through:

- **Consistency** — every interaction follows the same rules
- **Feedback** — every action produces a visible/audible response
- **Anticipation** — the system hints at what comes next
- **Weight** — transitions have mass, not just CSS duration
- **Memory** — the universe remembers and reflects past actions

---

## 2. PERCEPTION BOUNDARIES

```
┌──────────────────────────────────────────────────────┐
│              AAA PERCEPTION LAYER                     │
│                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ VISUAL  │  │ AUDIO   │  │ HAPTIC  │  │ SPATIAL │ │
│  │ Layer   │  │ Layer   │  │ Layer   │  │ Layer   │ │
│  │ (Phase2)│  │ (Phase2)│  │(Future) │  │(Future) │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │            │       │
│  ┌────▼────────────▼────────────▼────────────▼────┐  │
│  │              EVENT BUS (unified)                │  │
│  └─────────────────────┬──────────────────────────┘  │
│                        │                              │
│  ┌─────────────────────▼──────────────────────────┐  │
│  │           PROGRESSION ENGINE                    │  │
│  │         (single source of truth)                │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 3. VISUAL PERCEPTION RULES

### 3.1 Planet States → Visual Treatment

| State | Visual Treatment |
|-------|-----------------|
| **undiscovered** | Dim, no glow, label hidden. Hover: "COORDENADAS AINDA NÃO REVELADAS" |
| **available** | Subtle pulse (3s), PulseBeacon orbit, label: "SINAL DETECTADO" |
| **active** | Strong glow, ScannerRing (2s), SignalBars visible, label: "MISSÃO EM ANDAMENTO" |
| **completed** | Gold/amber glow, ClassificationTag: "DOMINADO" |

### 3.2 Transition Rules

- All state transitions use `cubic-bezier(0.4, 0, 0.2, 1)` (tokens.animation.easing.default)
- Planet unlock animation: 500ms fade + scale
- Planet activation animation: 300ms glow intensification
- Planet completion animation: 500ms color shift + pulse
- No transition under 100ms (feels glitchy)
- No transition over 800ms (feels sluggish)

### 3.3 Space Rules

- Zero rounded corners > 2px
- clipPath polygon aesthetics only
- Sharp edge aesthetic throughout
- No box-shadow softer than 4px blur

---

## 4. AUDIO PERCEPTION RULES

### 4.1 Audio Signatures

Each planet has a unique procedural audio signature:

| Signature | Character | Planet |
|-----------|-----------|--------|
| `low-hum` | Deep, resonant, grounding | NEXUS |
| `dissonant` | Tension, instability, challenge | KAOS |
| `harmonic` | Layered, musical, connective | LYRA |
| `choir` | Vocal-like, moral, guiding | ETHOS |
| `digital` | Square/sawtooth, analytical | CIPHER |
| `organic` | Natural, filtered, warm | TERRA |
| `crystal` | Bell-like, spectral, refracted | PRISM |
| `pulse` | Rhythmic, electrical, energetic | VOLT |
| `bass-drone` | Sub-bass, foundational, principle | AXIOM |
| `static` | Noise-based, liminal, transitional | JANUS |
| `rhythmic` | Percussive, cyclical, horizon | AURORA |
| `void` | Silence, strategic, contemplative | STRATOS |

### 4.2 Audio Rules

- NO autoplay — AudioContext created on first user gesture
- Volume: 0.08 master gain (ambient only)
- Crossfade between planet signatures: 2s
- Audio ducking during voice/speech: -6dB
- No audio processing in React components

---

## 5. SPATIAL PERCEPTION (FUTURE)

- Three.js scene with planet positions
- Camera orbits between planets on activation
- Parallax depth based on threat level
- Particle density reflects signal strength
- Fog/depth of field for undiscovered territory

---

## 6. COHERENCE CHECKLIST

Every new feature must pass this checklist before merge:

- [ ] Does it read state from progression engine (never writes)?
- [ ] Does it communicate through event bus (never direct)?
- [ ] Does it use tokens/typography from design system?
- [ ] Does it respect cooldown system?
- [ ] Does it work with zero completed planets?
- [ ] Does it work with all 12 planets completed?
- [ ] Does it handle state transitions gracefully (no flicker)?
- [ ] No autoplay audio?
- [ ] No hardcoded planet behavior?
