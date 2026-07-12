# HOME COMPONENT INDEX — Rota "/"

| Nível | Componente | Arquivo | Tipo | Evidência (JSX) | Server/Client | Importado por | Importa | Observações |
|-------|-----------|---------|------|-----------------|---------------|---------------|---------|-------------|
| 0 | RootPage | app/page.tsx | Route | — | Server | — | redirect | redirect('/home') |
| 1 | RootLayout | app/layout.tsx | Next Layout | — | Server | — | GamificationWrapper, fontes | — |
| 1 | MainLayout | app/(main)/layout.tsx | Next Layout | — | Client | — | Navigation, CognitiveGPS, LogosOracle, OasisProvider, SessionProvider, JourneyProvider | "use client" |
| 1 | HomePage | app/(main)/home/page.tsx | Route | — | Client | MainLayout | (ver abaixo) | "use client" |
| 2 | UtcClock | app/(main)/home/page.tsx (inline) | Content | texto literal | Client | HomePage | — | "use client" |
| 2 | FooterHud | app/(main)/home/page.tsx (inline) | Content | texto literal | Client | HomePage | — | "use client" |
| 2 | AvatarDropdown | app/(main)/home/page.tsx (inline) | Content | `<button>`, texto literal | Client | HomePage | — | "use client" |
| 2 | StatsPanel | app/(main)/home/page.tsx (inline) | Content | `<Image>`, texto literal | Client | HomePage | buildHomeStats | "use client" |
| 2 | HudBar | app/(main)/home/page.tsx (inline) | Content | texto literal, `<span>` | Client | HomePage | — | "use client" |
| 2 | HomeErrorBoundary | src/components/home/HomeErrorBoundary.tsx | Wrapper | — | Client | HomePage | — | "use client"; class component |
| 2 | CognitiveHero (3D) | src/components/hero/CognitiveHero.tsx | Content | `<Canvas>` | Client | HomePage | Three.js (Canvas, EffectComposer) | "use client" |
| 2 | CognitivePipelineDemo | src/components/CognitiveHero/index.tsx | Content | texto literal (STATUS_TEXT), `<h2>`, `<p>`, `<button>` | Client | HomePage | StateNode, CostBadge | "use client" |
| 2 | HeroPortal | src/components/home/HeroPortal.tsx | Content | texto literal (título, subtítulo, CTA) | Client | HomePage | HeroAgent | "use client" |
| 2 | JourneyHub | src/components/journey/JourneyHub.tsx | Content | `<h3>`, `<p>`, texto literal | Client | HomePage | — | "use client" |
| 2 | ArchetypeCard | src/components/home/ArchetypeCard.tsx | Content | `<h3>`, `<p>`, texto literal | Client | HomePage | lucide-react (Sparkles) | "use client" |
| 2 | NarrativeSuggestionCard | src/components/universe/NarrativeSuggestionCard.tsx | Content | `<h3>`, `<p>`, `<button>` | Client | HomePage | — | "use client" |
| 2 | PresenceIndicator | src/components/PresenceIndicator.tsx | Content | texto literal | Client | HomePage | framer-motion | "use client" |
| 2 | GamificationWrapper | src/components/gamification/GamificationWrapper.tsx | Wrapper | — | Client | RootLayout | useOasis | "use client" |
| 2 | Navigation | src/components/Navigation.tsx | Content | `<Link>`, texto literal | Client | MainLayout | — | "use client" |
| 2 | CognitiveGPS | src/components/journey/CognitiveGPS.tsx | Content | `<span>`, texto literal | Client | MainLayout | — | "use client" |
| 2 | LogosOracle | src/components/logos/LogosOracle.tsx | Content | `<h1>`, `<p>`, texto literal | Client | MainLayout | — | "use client"; renderização condicional (logosActive) |
| 3 | HeroAgent | src/components/home/HeroAgent.tsx | Content | `<Image>`, `<span>`, texto literal | Client | HeroPortal | — | "use client" |
| 3 | StateNode | src/components/CognitiveHero/StateNode.tsx | Content | `<Icon>` (lucide-react), texto literal | Client | CognitivePipelineDemo | — | "use client" |
| 3 | CostBadge | src/components/CognitiveHero/CostBadge.tsx | Content | texto literal (ITER, USD) | Client | CognitivePipelineDemo | — | "use client" |
| 1 | OasisProvider | src/providers/OasisProvider.tsx | Wrapper | — | Client | MainLayout | — | "use client"; React Context Provider |
| 1 | SessionProvider | src/providers/SessionProvider.tsx | Wrapper | — | Client | MainLayout | — | "use client"; React Context Provider |
| 1 | JourneyProvider | src/providers/JourneyProvider.tsx | Wrapper | — | Client | MainLayout | — | "use client"; React Context Provider |

**Nota sobre Providers:** MainLayout importa OasisProvider, SessionProvider e JourneyProvider como imports diretos. Não existe um componente agregador "Providers" — são 3 imports independentes, listados separadamente. A versão anterior da tabela usava "Providers" como shorthand na coluna Importa de MainLayout — corrigido para listar os 3 nomes explícitos.
