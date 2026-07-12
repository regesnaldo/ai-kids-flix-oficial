# HOME RENDER TREE — Rota "/"

## Árvore textual

```
app/page.tsx (RootPage)
  └── redirect('/home')

app/layout.tsx (RootLayout) [SERVER]
  └── GamificationWrapper

app/(main)/layout.tsx (MainLayout) [CLIENT]
  ├── Navigation
  ├── CognitiveGPS
  ├── LogosOracle
  ├── OasisProvider
  │   ├── SessionProvider
  │   │   └── JourneyProvider
  │   │       └── HomePage
  │   │           ├── HomeErrorBoundary [WRAPPER]
  │   │           │   ├── UtcClock
  │   │           │   ├── FooterHud
  │   │           │   ├── CognitiveHero (3D Canvas)
  │   │           │   ├── CognitivePipelineDemo
  │   │           │   │   ├── StateNode ×7
  │   │           │   │   └── CostBadge
  │   │           │   ├── HeroPortal
  │   │           │   │   └── HeroAgent ×4
  │   │           │   ├── StatsPanel
  │   │           │   │   └── (buildHomeStats → 4 cards com Link + Image)
  │   │           │   ├── ArchetypeCard
  │   │           │   ├── HudBar
  │   │           │   ├── JourneyHub
  │   │           │   ├── NarrativeSuggestionCard (condicional)
  │   │           │   └── Agent Cards Grid (12× motion.div)
  │   │           └── PresenceIndicator
  │   └── (children)
  └── (rest of layout)
```

## Grafo Mermaid

```mermaid
graph TD
  A[RootPage<br/>app/page.tsx] -->|redirect| B[RootLayout<br/>app/layout.tsx]
  B --> C[GamificationWrapper]
  B --> D[MainLayout<br/>app/(main)/layout.tsx]
  D --> E[Navigation]
  D --> F[CognitiveGPS]
  D --> G[LogosOracle]
  D --> H[OasisProvider]
  H --> I[SessionProvider]
  I --> J[JourneyProvider]
  J --> K[HomePage<br/>app/(main)/home/page.tsx]
  K --> L[HomeErrorBoundary<br/>WRAPPER]
  L --> M[UtcClock]
  L --> N[FooterHud]
  L --> O[CognitiveHero 3D<br/>Canvas+EffectComposer]
  L --> P[CognitivePipelineDemo]
  P --> Q[StateNode x7]
  P --> R[CostBadge]
  L --> S[HeroPortal]
  S --> T[HeroAgent x4]
  L --> U[StatsPanel]
  U --> V[4 cards<br/>Link+Image+texto]
  L --> W[ArchetypeCard]
  L --> X[HudBar]
  L --> Y[JourneyHub]
  L --> Z[NarrativeSuggestionCard<br/>condicional]
  L --> AA[Agent Cards Grid<br/>12x motion.div]
  L --> AB[PresenceIndicator]

  style A fill:#555,color:#fff
  style B fill:#1a1a2e,color:#0ff
  style D fill:#1a1a2e,color:#0ff
  style L fill:#16213e,color:#0f0
  style K fill:#0f3460,color:#fff
  style O fill:#533483,color:#fff
  style P fill:#533483,color:#fff
  style S fill:#533483,color:#fff
```
