# MENTE.AI · Cinematic Redesign

> Arquiteto: HERMES | Sistema: MENTE.AI v3.0
> Fase 1: CONCLUÍDA | Fase 2: CONCLUÍDA | Fase 3: CONCLUÍDA | Fase 4: CONCLUÍDA

---

## Phase 1 — Cognitive Navigation Architecture

**Status: SEALED. Typecheck: 0 errors. 6/6 test suites pass.**

### Files
- `src/lib/navigation-hints/types.ts` — Zod schemas + TypeScript types
- `src/lib/navigation-hints/extractor.ts` — [NAV:section:reason:priority] parser + NL fallback
- `src/lib/navigation-hints/router.ts` — 5x5 connectivity matrix + 8 trigger rules
- `src/lib/navigation-hints/mission-store.ts` — Mission continuity (cache + localStorage)
- `src/lib/navigation-hints/beacon-factory.ts` — BeaconUIObject generator (zero emojis)
- `src/lib/navigation-hints/lab-state-machine.ts` — 6-state LAB machine
- `src/lib/navigation-hints/cross-section-handoff.ts` — Handoff protocol
- `src/lib/navigation-hints/index.ts` — Barrel export
- `src/store/useNavigationStore.ts` — Zustand store (beacons, mission, lab, handoff)
- `src/app/api/chat/route.ts` — Patched (NAV injection, hint extraction, response enrichment)

### Integration Chain
```
AI Response -> extractNavigationHints() -> NavigationHintBundle
  -> generateBeacons() -> BeaconUIObject[]
  -> useNavigationStore.processHints() -> HUD rendering
  -> trigger rules evaluate -> action -> beacon
  -> cross-section handoff -> context survives navigation
```

---

## Phase 2 — Design System Foundation

**Status: COMPLETE. 6 components + 6 contract test suites.**

### Semantic Token Map

| Token Group | Key | Value | Cognitive Meaning |
|---|---|---|---|
| `color.system` | idle | `#0a0a1a` | Vacuo, espera |
| `color.system` | scanning | `#0f0f2d` | Analise em curso |
| `color.system` | processing | `#141432` | Pipeline ativo |
| `color.system` | synthesis | `#1a1a3e` | Consolidando dados |
| `color.system` | complete | `#162440` | Missao concluida |
| `color.system` | error | `#1a0f14` | Falha detectada |
| `color.discovery` | tier1 | `#a855f7` | Descoberta comum |
| `color.discovery` | tier2 | `#7c3aed` | Descoberta intermediaria |
| `color.discovery` | tier3 | `#6d28d9` | Descoberta rara |
| `color.access` | surface | `#94a3b8` | Acesso publico |
| `color.access` | deep | `#00f0ff` | Acesso intermediario |
| `color.access` | core | `#a855f7` | Acesso avancado |
| `color.access` | restricted | `#ef4444` | Acesso restrito |
| `color.danger` | low | `#f59e0b` | Alerta baixo |
| `color.danger` | elevated | `#f97316` | Alerta elevado |
| `color.danger` | critical | `#ef4444` | Alerta critico |
| `color.signal` | weak | `rgba(0,240,255,0.25)` | Sinal fraco |
| `color.signal` | moderate | `rgba(0,240,255,0.50)` | Sinal moderado |
| `color.signal` | strong | `rgba(0,240,255,0.75)` | Sinal forte |
| `color.signal` | urgent | `rgba(168,85,247,0.85)` | Sinal urgente |

### Typography Clearance Hierarchy

| Level | Clearance | Density | Font | Size | Usage |
|---|---|---|---|---|---|
| `broadcast` | SUPERFICIE | baixa | Display | clamp(1.5rem,4vw,2.5rem) | Titulos, headers |
| `operational` | OPERACIONAL | media | Body | 1rem | Corpo de texto |
| `operationalMono` | OPERACIONAL | media | Mono | 0.875rem | Logs, dados |
| `classified` | PROFUNDO | alta | Display | 0.9375rem | Rotulos, sub-headers |
| `classifiedLabel` | PROFUNDO | alta | Mono | 0.75rem | Labels HUD, timestamps |
| `restricted` | RESTRITO | critica | Mono | 0.6875rem | Alertas, erros |
| `signal` | SINAL | alta | Mono | 0.8125rem | Estados do sistema |
| `micro` | SUPERFICIE | alta | Mono | 0.625rem | Metadados |

### HUD Component Inventory

| Component | States | Color Token Group | Phase 1 Store Binding |
|---|---|---|---|
| `ScannerRing` | idle, scanning, complete, error | `color.system` | `useNavigationStore().labState` |
| `ActionNode` | locked, unlocked, active, completed | `color.signal` + custom | `useNavigationStore().mission.unlockedNodes` |
| `ClassificationTag` | default, highlighted, archived | `color.access` | `useNavigationStore().mission.currentLayer` |
| `GridOverlay` | idle, active, scanning | CSS opacity | `useNavigationStore().labState` |
| `SignalBars` | weak, moderate, strong, urgent, lost | `color.signal` | `useNavigationStore().beacons` priority |
| `PulseBeacon` | subtle, moderate, urgent, hidden | `color.signal` + `color.discovery` | `useNavigationStore().beacons` |

### State Transition Matrix

| Component | Invalid Transitions Blocked |
|---|---|
| ScannerRing | idle->complete, idle->error, complete->error |
| ActionNode | locked->active, locked->completed, completed->active |
| ClassificationTag | No hard blocks (all 3 states inter-reachable) |
| GridOverlay | All 3 states inter-reachable |
| SignalBars | All 5 states inter-reachable (ordered preference) |
| PulseBeacon | All 4 states inter-reachable |

### Contract Tests

6 test files in `src/components/hud/__tests__/`:
- `ScannerRing.contract.test.ts` -- 14 tests
- `ActionNode.contract.test.ts` -- 13 tests
- `ClassificationTag.contract.test.ts` -- 12 tests
- `GridOverlay.contract.test.ts` -- 10 tests
- `SignalBars.contract.test.ts` -- 12 tests
- `PulseBeacon.contract.test.ts` -- 14 tests

**Total: 75 contract tests across 6 components.**

---

## Phase 3 -- LAB System States

**Status: COMPLETE. 1 hook + 1 page patch + 66 contract tests.**

Phase 3 consumes Phase 1 (labState machine + beacons + mission from `useNavigationStore`)
and wears Phase 2 (HUD components: ScannerRing, SignalBars, GridOverlay, PulseBeacon).
No new state logic introduced. Pure mapping layer.

### Files
- `src/components/lab/useLabInterface.ts` -- Orchestrator hook (Phase 1 + Phase 2 bridge)
- `src/app/(main)/lab/page.tsx` -- Patched with HUD overlay layer
- `src/components/lab/__tests__/useLabInterface.contract.test.ts` -- 66 contract tests

### labState -> Status Text (Portuguese)

| State | Status Text |
|---|---|
| idle | SISTEMA PRONTO |
| scanning | ANALISANDO ENTRADA... |
| processing | PROCESSANDO COGNITIVAMENTE... |
| synthesis | SINTETIZANDO RESPOSTA... |
| complete | TRANSMISSAO COMPLETA |
| error | FALHA NO SINAL |

### labState -> HUD Components Active

| State | ScannerRing | GridOverlay | SignalBars | PulseBeacon |
|---|---|---|---|---|
| idle | idle | idle | -- | -- |
| scanning | scanning | scanning | -- | -- |
| processing | scanning | -- | moderate | -- |
| synthesis | scanning | -- | strong | -- |
| complete | complete | -- | -- | moderate |
| error | error | -- | lost | -- |

### Integration Notes

- **ScannerRing** reads `useNavigationStore().labState.state` -> maps to ScannerRingState
- **SignalBars** shows pipeline signal strength during processing/synthesis
- **GridOverlay** shows scanner grid during idle/scanning
- **PulseBeacon** reads `useNavigationStore().beacons` via `getActiveBeacons()`
- **Mission info bar** reads `useNavigationStore().mission` for bottom panel
- **Cross-section handoff**: `onNavigate` calls `pushHandoff(destination)` before `router.push()`
- Phase 3 creates ZERO new Zustand slices, ZERO new state machines, ZERO new transitions

---

## Phase 4 -- Motion System

**Status: COMPLETE. 5 motion components + 1 orchestrator + 6 contract test suites + 1 motion token system.**

Phase 4 consumes Phase 1 (trigger signals from `useNavigationStore`: handoffPayload, labState, beacons, mission.lastDiscovery) and Phase 3 (labState labels via `useLabInterface`). All motion is reactive to cognitive triggers -- zero decorative-only animations.

### Motion Token System (`src/design-system/motion.ts`)

Every duration, easing, and delay maps to a COGNITIVE PURPOSE:

| Duration Token | Value | Cognitive Meaning |
|---|---|---|
| `motion.instant` | 0ms | State corrections, error flags |
| `motion.scan` | 800ms | Information retrieval, scanning |
| `motion.synthesis` | 1200ms | Complex processing completion |
| `motion.leap` | 600ms | Section transitions, mission jumps |
| `motion.pulse` | 2000ms | Beacon signaling, discovery |
| `motion.echo` | 400ms | Memory callbacks, contextual reminders |

| Easing Token | Shape | Cognitive Behavior |
|---|---|---|
| `instant` | step-end | Corrective -- no acceleration |
| `scan` | linear | Analytical -- constant speed |
| `synthesis` | cubic-bezier(0.17, 0.67, 0.12, 0.99) | Synthetic -- slow start, rapid middle, soft land |
| `leap` | cubic-bezier(0.58, 0, 0.08, 1) | Transit -- fast acceleration, gentle deceleration |
| `pulse` | ease-in-out | Signal -- rhythmic oscillation |
| `echo` | cubic-bezier(0.25, 0.1, 0.1, 0.85) | Recall -- quick in, slow fade |

**Reduced-motion overrides**: All durations collapse to 0ms, all easings become step-end. The user still sees state changes (no hidden content) but zero animation cost.

### Motion Component Inventory

| Component | Cognitive Trigger | Source Signal | Duration | Visual |
|---|---|---|---|---|
| `QuantumLeap` | Cross-section handoff initiated | `handoffPayload !== null` | `motion.leap` | content blur-out → radial wipe → blur-in |
| `DeepScan` | LAB scanning/processing | `labState === 'scanning' \|\| 'processing'` | `motion.scan` | horizontal scanline + desaturation overlay |
| `SignalAcquisition` | Discovery moment | `beacon.priority >= 0.8 \|\| node unlocked` | `motion.pulse` | hexagon/diamond geometric flash + glow expansion |
| `EchoPulse` | New hint while away | beacon count increased since last check | `motion.echo` | edge light pulse + typography shift (dismissible) |
| `MemoryEcho` | Revisiting unlocked node | `mission.lastDiscovery !== null` | `motion.echo` | chromatic aberration + Portuguese label fade-in |

### Cognitive Trigger Hierarchy (Priority)

| Priority | Event | Motion | Description |
|---|---|---|---|
| 5 | `cross_section_handoff_initiated` | QuantumLeap | Navigational -- highest precedence |
| 4 | `lab_scanning_or_processing` | DeepScan | Active processing |
| 3 | `discovery_moment` | SignalAcquisition | Content discovery |
| 2 | `new_hint_while_away` | EchoPulse | Ambient notification |
| 1 | `revisiting_unlocked_node` | MemoryEcho | Passive recall |

### HUD Motion Wrapper

`HudMotionWrapper.tsx` wraps Phase 2 HUD components without modifying internals:
- **ScannerRing**: rotate-in on mount, pulse on state change
- **ActionNode**: scale-in when unlocked, lock-shake on denied activation
- **ClassificationTag**: slide-in from edge when highlighted
- **SignalBars**: staggered height animation on state change
- **PulseBeacon**: rhythmic pulse intensity mapped to priority
- **GridOverlay**: perspective shift on active state

Uses CSS animations + Web Animations API. No external animation libraries.

### Lab Motion Controller (`LabMotionController.tsx`)

Wires Phase 4 motion components as an overlay layer on the LAB page:
- Mounts inside `src/app/(main)/lab/page.tsx` as `<LabMotionController />`
- Reads Phase 1 store + Phase 3 lab interface
- Derives signals: handoffPending, isScanningOrProcessing, isCompleteWithBeacons, newHintWhileAway, revisitingNode
- Schedules motions respecting the 2-simultaneous cap and reduced-motion preference
- ZERO new store slices, ZERO new state machines, ZERO new transitions

### Performance Rules

| Rule | Value |
|---|---|
| Max simultaneous motions | 2 |
| Debounce window | 250ms |
| Cooldown per motion type | 1500ms |
| Reduced-motion disables all | true |

Excess motions are queued by priority; lower-priority motions are silently suppressed when the cap is reached.

### Files Created

- `src/design-system/motion.ts` -- Motion token system + resolution helpers
- `src/components/motion/_motionContracts.ts` -- Zod schemas, trigger guards, performance rules
- `src/components/motion/QuantumLeap.tsx` -- Cross-section handoff motion
- `src/components/motion/DeepScan.tsx` -- Information retrieval scan overlay
- `src/components/motion/SignalAcquisition.tsx` -- Discovery moment geometric flash
- `src/components/motion/EchoPulse.tsx` -- System notification edge pulse
- `src/components/motion/MemoryEcho.tsx` -- Contextual callback with Portuguese label
- `src/components/motion/HudMotionWrapper.tsx` -- HUD component entry/exit motion wrappers
- `src/components/motion/LabMotionController.tsx` -- Motion orchestrator for LAB page
- `src/components/motion/index.ts` -- Barrel export
- `src/components/motion/__tests__/QuantumLeap.contract.test.ts` -- 20 tests
- `src/components/motion/__tests__/DeepScan.contract.test.ts` -- 18 tests
- `src/components/motion/__tests__/SignalAcquisition.contract.test.ts` -- 19 tests
- `src/components/motion/__tests__/EchoPulse.contract.test.ts` -- 19 tests
- `src/components/motion/__tests__/MemoryEcho.contract.test.ts` -- 20 tests
- `src/components/motion/__tests__/motionContracts.test.ts` -- 26 cross-cutting tests

### File Modified

- `src/app/(main)/lab/page.tsx` -- Added Phase 4 import + `<LabMotionController />` overlay (3 lines)

**No Phase 1/2/3 files modified. No Zustand store changes. No API route changes.**

### Contract Tests Total: 122 tests across 6 test suites

All tests are logic-only (state contracts, trigger guards, performance rules, token mappings). No pixel positions, no keyframe values, no rendered snapshots.
