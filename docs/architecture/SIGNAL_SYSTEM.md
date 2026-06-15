# SIGNAL SYSTEM — Progression & Detection Specification

> **Status:** FOUNDATION FREEZE
> **Version:** 1.0.0

---

## 1. CONCEPT

In the MENTE.AI universe, **Signals** are the visible/audible manifestation of progression. They replace traditional UX elements like "notifications", "badges", or "progress bars" with an in-universe metaphor.

A signal is:
- A planet becoming available → "SINAL DETECTADO"
- A mission completed → signal strength peak
- A hint generated → subtle signal pulse
- Overall system health → SignalBars in UniverseHUD

---

## 2. SIGNAL STRENGTH

| Strength | Range | Meaning | Visual |
|----------|-------|---------|--------|
| None | 0.0 | No signal — planet undiscovered | Dim, no pulse |
| Weak | 0.25 | Faint signal — planet available | 1 bar filled |
| Moderate | 0.50 | Clear signal — planet nearby | 2 bars filled |
| Strong | 0.75 | Strong signal — active planet | 3 bars filled |
| Urgent | 0.90+ | Critical signal — mission milestone | 4 bars, purple |

Signal strength maps to `SignalBars` component states:
- 0.0–0.4 → `weak`
- 0.4–0.6 → `moderate`
- 0.6–0.8 → `strong`
- 0.8+ → `urgent`
- disconnected → `lost`

---

## 3. SIGNAL EVENTS

### 3.1 SIGNAL_DETECTED

Fired when a planet becomes available.

```typescript
{
  type: "SIGNAL_DETECTED";
  planetId: PlanetId;
  strength: number;  // 0.5 (moderate) for newly unlocked
}
```

**Triggers:**
- Planet completion → children become available
- (Future) Narrative event reveals a hidden planet

**Consumers:**
- MissionOrbit — animates dashed line
- PlanetNode — shows "SINAL DETECTADO" label
- UniverseHUD — increments "Sinais ativos" counter

### 3.2 MISSION_COMPLETED

Fired when a planet mission is completed.

```typescript
{
  type: "MISSION_COMPLETED";
  planetId: PlanetId;
}
```

**Triggers:**
- User finishes a planet's cognitive mission
- Planet transitions to "completed" state

**Consumers:**
- PlanetNode — transitions to "completed" visual
- MissionOrbit — solidifies orbital line
- AudioManager — crossfades to next active planet signature

### 3.3 HINT_GENERATED

Fired when the system provides a hint.

```typescript
{
  type: "HINT_GENERATED";
  planetId: PlanetId;
  hint: string;
}
```

**Triggers:**
- User stuck on a planet (detected by progression engine)
- User explicitly requests hint

**Consumers:**
- UniverseHUD — displays hint in notification area
- PlanetNode — subtle pulse around the planet

---

## 4. SIGNAL FLOW

```
User completes NEXUS mission
  → Progression Engine: completePlanet("nexus")
    → Validates prerequisites
    → Calculates unlocks: ["kaos", "lyra"]
    → Emits: PLANET_COMPLETED("nexus")
    → Emits: PLANET_UNLOCKED("kaos", source="nexus")
    → Emits: SIGNAL_DETECTED("kaos", strength=0.5)
    → Emits: PLANET_UNLOCKED("lyra", source="nexus")
    → Emits: SIGNAL_DETECTED("lyra", strength=0.5)

UI Layer (reads new state):
  → KAOS PlanetNode: state changes from "undiscovered" to "available"
    → Shows "SINAL DETECTADO"
    → Subtle pulse animation (3s)
  → LYRA PlanetNode: same
  → MissionOrbit: NEXUS→KAOS line becomes dashed (undiscovered connection)
  → NEXUS PlanetNode: state changes from "active" to "completed"
    → Shows "DOMINADO" tag
    → Gold glow

Audio Layer:
  → NEXUS audio signature fades out (2s crossfade)
  → KAOS and LYRA signatures begin subtle ambient presence
```

---

## 5. UNIVERSE HUD — SIGNAL DISPLAY

The UniverseHUD shows real-time signal information:

```
┌──────────────────────────────────────────────┐
│  [ScannerRing]  SISTEMA OPERACIONAL           │
│                                               │
│                    [SignalBars]                │
│                    Completos: 3/12             │
│                                               │
│  Territórios: 5/12 | Sinais ativos: 2 |       │
│  Camada: PROFUNDO                             │
└──────────────────────────────────────────────┘
```

**Metrics:**
- **Territórios:** planets in `available` + `active` + `completed`
- **Sinais ativos:** count of `active` planets + active hints
- **Camada:** highest clearance level among completed planets

---

## 6. COOLDOWN SYSTEM

To prevent signal spam and maintain the perception of weight:

- Minimum 2 seconds between progression changes
- Max 2 hints active simultaneously
- Signal strength changes animate over 400ms (not instant)
- Planet unlock animations stagger by 300ms each when multiple unlock

---

## 7. FUTURE EXTENSIONS

- **Signal interference:** When two planets with conflicting themes are available
- **Signal echoes:** Completed planets occasionally emit faint signal reminders
- **Emergency signals:** Critical threat planets pulse urgently
- **Signal triangulation:** User position in universe calculated from active signals
