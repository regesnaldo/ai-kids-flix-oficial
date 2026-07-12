# HOME IMPORT TREE — Rota "/"

```
app/page.tsx
  └─ redirect('/home')

app/layout.tsx  [ROOT LAYOUT]
  ├─ ./globals.css
  ├─ next/font/google → Orbitron, Space_Grotesk
  └─ @/components/gamification/GamificationWrapper

app/(main)/layout.tsx  [GROUP LAYOUT]
  ├─ next/navigation → usePathname, useRouter
  ├─ react → useEffect
  ├─ @/components/Navigation
  ├─ @/components/journey/CognitiveGPS
  ├─ @/components/logos/LogosOracle
  ├─ @/lib/onboarding/types → shouldShowOnboarding
  ├─ @/providers/OasisProvider
  ├─ @/providers/SessionProvider
  └─ @/providers/JourneyProvider

app/(main)/home/page.tsx  [HOME PAGE]
  ├─ react → useState, useEffect, useMemo
  ├─ next/link → Link
  ├─ next/image → Image
  ├─ next/navigation → useRouter
  ├─ framer-motion → motion
  ├─ @/providers/OasisProvider → useOasis
  ├─ @/providers/SessionProvider → useSession
  ├─ @/design-system/colorEngine → createEmotionStyleElement, getPaletteFromEmotionalState, emotionPaletteToStyle
  ├─ @/components/journey/JourneyHub
  ├─ @/components/home/HomeErrorBoundary
  ├─ @/components/universe/NarrativeSuggestionCard
  ├─ @/components/PresenceIndicator
  ├─ @/lib/navigation-hints/beacon-factory → presenceToBeacon
  ├─ @/store/useNavigationStore
  ├─ @/engine/narrative-transitions (type only)
  ├─ @/components/home/ArchetypeCard
  ├─ @/canon/agents/presence → getAgentColor
  ├─ @/components/hero/CognitiveHero    [3D Canvas]
  ├─ @/components/CognitiveHero → CognitivePipelineDemo
  ├─ @/components/home/HeroPortal
  └─ @/config/homeStats → buildHomeStats

HeroPortal
  ├─ next/link → Link
  ├─ ./HeroAgent
  └─ @/config/heroAgents

HeroAgent
  ├─ next/image → Image
  ├─ framer-motion → motion
  ├─ @/lib/getAgentImage → AGENT_IMAGE_FALLBACK
  └─ @/config/heroAgents (type only)

CognitivePipelineDemo  [= CognitiveHero/index.tsx CognitivePipeline export]
  ├─ react → useState, useEffect, useCallback
  ├─ framer-motion → motion, AnimatePresence
  ├─ ./StateNode
  └─ ./CostBadge

StateNode
  ├─ framer-motion → motion
  └─ lucide-react → Pause, Zap, ScanSearch, GitBranch, CheckCircle, XCircle, AlertTriangle

CostBadge
  └─ framer-motion → motion

JourneyHub
  ├─ react
  ├─ next/link → Link
  ├─ @/providers/JourneyProvider → useJourney, getArchetypeLabel, getRecommendationReason, AGENT_FACTION, AGENT_COLORS
  ├─ @/providers/OasisProvider → useOasis
  ├─ @/providers/SessionProvider → useSession
  └─ next/navigation → usePathname

ArchetypeCard
  ├─ react → useState, useEffect
  └─ lucide-react → Sparkles

NarrativeSuggestionCard
  ├─ react → useState
  └─ @/engine/adaptive-router (type only)

HomeErrorBoundary
  └─ react → Component, ErrorInfo (class component)

CognitiveHero (3D)
  ├─ react → Suspense
  ├─ @react-three/fiber → Canvas
  ├─ @react-three/drei → Stars, Text, Html
  └─ @react-three/postprocessing → EffectComposer, Bloom

PresenceIndicator
  └─ framer-motion → motion

CognitiveGPS
  └─ framer-motion → motion, AnimatePresence

Navigation
  └─ next/link → Link

GamificationWrapper
  └─ @/providers/OasisProvider → useOasis
```
