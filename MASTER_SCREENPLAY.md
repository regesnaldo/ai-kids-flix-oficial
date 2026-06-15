═══ MENTE.AI — MASTER SCREENPLAY ═══
═══════════════════════════════════════
Title:   MENTE.AI — Educational AI Metaverse
Author:  Hermes (DeepSeek V4, WSL Ubuntu)
Date:    May 30, 2026 (Era 1, Phase 1 complete)
Director: Damien Chazelle
Runtime: 3 Acts, 12 Scenes  [FADE IN]

═══════════════════════════════════════
                    ACT I: FOUNDATION
═══════════════════════════════════════

SCENE 1 - EXT. MENTE.AI LANDING PAGE - DAY
─────────────────────────────────────────

The platform breathes in the dark. A cosmic particle field
renders 120 firefly-like stars across an infinite void.

BACKGROUND: <div> with #0a0a1a backgroundColor.
STARS: Absolute-positioned <span> elements, 1-3px diameter.
       30% twinkle via CSS keyframe twinkleStar.
       Colors: 50% white (#ffffff), 50% cyan (#00f5ff).
       Opacity: 0.3 to 0.9, randomized.

NEXUS PRIME logo, center-top. Color: #00f5ff.
fontFamily: monospace. textShadow: cyan glow.

BUTTON "ENTRAR" — centered, translucent cyan border.
   onClick: router.push("/login")
   Hover: scale(1.05), brightness(1.2)
   CSS transition: 300ms ease all.

No API call. No auth check. Pure visual hook.

═══════════════════════════════════════

SCENE 2 - INT. CONSCIOUSNESS TERMINAL - NIGHT
───────────────────────────────────────────────

Login page. Z-Index 0 starfield (reused) behind a
translucent glass panel. Three input fields.

SYSTEM STATE:
  - Loading: useState(false)
  - Error: useState<string | null>(null)
  - ShowPassword: useState(false)

INPUTS:
  1. NOME DE ACESSO (username) - type="text"
  2. ENDEREÇO DE EMAIL (email) - type="email"
  3. SENHA (password) - type={showPassword ? "text" : "password"}

AUTH FLOW:
  POST /api/auth/login
  Request: { email, password, username }
  Response: 200 { token, user: { id, username, email, avatar } }
            401 { error: "email ou senha invalidos" }

ON SUCCESS:
  1. document.cookie = `mente_ai_token=${token}; path=/; max-age=86400; SameSite=Lax`
     (Max-age 24h — JWT expiry 7d internally via jose)
  2. router.push("/home")

ON ERROR:
  Set error state. Error message displayed in red (#ff4444)
  below the submit button. Fades after 5s via setTimeout.

JWT PAYLOAD (verified server-side via jose):
{
  userId: number,
  username: string,
  email: string,
  iat: number,
  exp: number  // 7 days from iat
}

TOKEN VERIFICATION:
  Edge/Server: getAuthCookieFromRequest(request)
  Client: getTokenFromCookies() — reads document.cookie
  Verify: await verifyToken(token) — jose.jwtVerify with
          JWT_SECRET from process.env.JWT_SECRET
  Fallback: If JWT_SECRET not set or token invalid → null

REGISTRATION FLOW:
  POST /api/auth/register
  Request: { email, password, username }
  Response: 201 { token, user }
  Creates user in TiDB via Drizzle:
    await db.insert(users).values({ email, password: hashed, username, createdAt })
  Password hashing: bcrypt with 10 rounds
  Duplicate email: 409 { error: "email ja cadastrado" }
  Duplicate username: 409 { error: "nome de usuario ja cadastrado" }

SESSION PERSISTENCE:
  On /home mount: useEffect reads token from cookies,
  fetches GET /api/auth/session.
  If 401 → router.push("/login").
  If 200 → setUser(payload) on UserContext.

═══════════════════════════════════════

SCENE 3 - INT. HOME DASHBOARD - REALTIME
──────────────────────────────────────────

Post-login central hub. "/home" route.

LAYOUT (from top):
  ┌──────────────────────────────────────────┐
  │  HEADER: NEXUS PRIME // MENTE.AI        │
  │  Left: Logo cyan glow                    │
  │  Right: Avatar dropdown (perfil, sair)   │
  ├──────────────────────────────────────────┤
  │  GREETING: "Bem-vindo, {username}"       │
  │  Sub: "Seu universo aguarda."            │
  ├──────────────────────────────────────────┤
  │  PROGRESSION BAR — horizontal progress   │
  │  X/12 MUNDOS / next: {planet.name}       │
  │  Data from: progressionSnapshot (SSE)    │
  ├──────────────────────────────────────────┤
  │  AGENT CARDS — grid 2x2 or 3x3           │
  │  Each card: agent name, faction, status  │
  │  Click → /universo/{planetId}/lab        │
  ├──────────────────────────────────────────┤
  │  QUICK ACTIONS:                          │
  │  [ MAPA GALACTICO ] → /universo          │
  │  [ EXPLORAR ] → /explorar                │
  │  [ LABORATORIO ] → /lab                  │
  │  [ AGENTES ] → /agentes                  │
  └──────────────────────────────────────────┘

STATE:
  - user: User | null (from SessionProvider)
  - progression: PlayerProgression (from OasisProvider SSE)
  - agents: Agent[] (from /api/agents — canonical ALL_AGENTS)

DATA FETCHES:
  GET /api/agents — returns all 12 agent definitions
  GET /api/dashboard/stats — returns user stats from TiDB
  SSE /api/sse/progression — real-time progression updates

MONETIZATION CHECK:
  If user.tier === "free" and totalCompleted >= 3:
    Show upgrade prompt: "Desbloqueie todos os mundos"
    Links to /planos (Stripe checkout — NOT IN PRODUCTION)

═══════════════════════════════════════

SCENE 4 - INT. GALACTIC MAP /universo - REALTIME
────────────────────────────────────────────────────

SVG-based solar system. NEXUS at center (sun).
12 planets on concentric orbits. Radius range: 0px (NEXUS)
to 1700px (JANUS). OrbitConfig in planet-registry.ts.

COORDINATE MATH (viewport-safe):
  cx = viewport.w / 2
  cy = viewport.h / 2
  For each planet: angleRad = (config.angle * PI) / 180
  x = cx + cos(angleRad) * config.radius
  y = cy + sin(angleRad) * config.radius
  Recalculated on window resize.

PLANET STATES (from progression-engine.ts):
  ┌──────────────┬──────────┬──────────────────────┐
  │ State        │ Opacity  │ Visual Treatment     │
  ├──────────────┼──────────┼──────────────────────┤
  │ undiscovered │ 0.35     │ Dark orb, no label   │
  │ available    │ 1.0      │ Colored glow, pulsing │
  │ active       │ 1.0      │ Bright glow, label   │
  │ completed    │ 1.0      │ Amber glow, label    │
  └──────────────┴──────────┴──────────────────────┘

CONNECTION LINES (MissionOrbit SVG):
  - NEXUS → every discovered planet (cyan dashed)
  - Completed → its unlocked children (amber dashed)
  - SVG <path> with strokeDasharray, opacity 0.15-0.3

PLANET CLICK HANDLER:
  1. Check state. If undiscovered → no-op.
  2. If available → POST /api/universe/progression
     { action: "activate", planetId }
  3. audioManager.playSignature(planetId) — Tone.js
  4. triggerTransition(planetId, "warp") — OasisProvider
  5. Flash overlay (200ms white flash)
  6. setTimeout 600ms → router.push(`/universo/${planetId}/lab`)

PROGRESSION DATA FLOW:
  Database (TiDB) → API → SSE → OasisProvider →
  progressionSnapshot → UniversePage re-render

  Pure function: calculatePlanetState(id, progression)
  returns PlanetState. No side effects. Client-safe.

═══════════════════════════════════════
              ACT II: CONFLICT AND EXECUTION
═══════════════════════════════════════

SCENE 5 - INT. NEXUS CORE /universo/nexus - DEEP SPACE
─────────────────────────────────────────────────────────

The NEXUS universe page. Three.js scene with particle
field of 500 nodes. Camera at [0, 0, 12], FOV 60.

COMPONENT TREE:
  NexusCosmos (fullscreen container)
  ├── CinematicIntro (overlay, fades after ~3.6s)
  │   Lines: "> INICIALIZANDO NEXUS..."
  │          "> SINCRONIZANDO 500 NÓS DE DADOS..."
  │          "> BEM-VINDO AO KERNEL DO METAVERSO."
  │   Timing: 1200ms per line, then 800ms pause, 800ms fade
  │
  ├── Canvas (React Three Fiber)
  │   ├── Scene
  │   │   ├── ParticleField (500 points, 3 color groups)
  │   │   │   - 400 cyan (#00FFFF), pulsating
  │   │   │   - 60 blue (#0088FF), static
  │   │   │   - 40 white, static
  │   │   │   Animation: pulse = 0.8 + 0.4*sin(t * 2PI/3)
  │   │   │   Rotation: 0.0005 rad/frame (cyan), 0.0003 (rest)
  │   │   └── Nucleus (clickable sphere + 2 torus rings)
  │   │       - sphereGeometry [0.4, 32, 32], emissive #00FFFF
  │   │       - ring1: torus [0.7, 0.02], #0088FF, opacity 0.6
  │   │       - ring2: torus [0.9, 0.02], #0088FF, opacity 0.4
  │   │       - onClick → setChatOpen(true)
  │   │       - onPointerOver → playNucleusHover (Tone.js)
  │   │       - onPointerOut → cursor default
  │   └── EffectComposer + Bloom
  │       luminanceThreshold: 0, smoothing: 0.9
  │       intensity: 0.8, height: 300
  │
  ├── HUDOverlay (position: absolute, z-index: 10)
  │   Left: "NEXUS // KERNEL ORQUESTRADOR" (#00FF88)
  │         "PARTÍCULAS ATIVAS: 500" (#00FFFF)
  │         "STATUS: ONLINE" (#00FF88)
  │   Right: UTC timestamp, updates every 1s
  │   Bottom: "[ CLIQUE NO NÚCLEO PARA INICIAR CONTATO ]"
  │           Blinking cursor opacity 0.2↔0.7, period 1s
  │
  └── ChatPanel (on chatOpen, z-index: 20, width: 380px)
      ├── Header: // NEXUS PRIME + close button
      ├── Messages: Array of { role, text }
      │   Role "nexus": #00FFFF, left-aligned
      │   Role "user": #FFFFFF, right-aligned
      └── Input: "Transmitir mensagem..."
          On Enter → send() → push message + cycle NEXUS_RESPONSES

AUDIO ENGINE (Tone.js, lazy imports):
  initAudio() — calls Tone.start() (browser gesture gate)
  createAmbientDrone() — 2 Synth nodes
    drone1: sine wave C1, attack 4s, release 6s
    drone2: sine wave G1, attack 6s, release 8s
    Reverb: decay 8s, wet 0.8, volume -20dB
  playNucleusHover() — sine G2, 0.3s, reverb
  playNucleusClick() — MetalSynth G3, reverb decay 6s
  Cleanup on unmount: triggerRelease both drones

NOT MOCKED: Chat responses are cycled from a hardcoded array
of 5 NEXUS_RESPONSES. No LangChain. No ElevenLabs TTS here
(the NexusDialog component below has voice, but this page
doesn't use it — it uses NexusCosmos directly).

═══════════════════════════════════════

SCENE 6 - INT. NEXUS COSMOS - PARTICLE FIELD
───────────────────────────────────────────────

Alternate NEXUS render path. Used by /universo/nexus/lab
or embedded views. 2000 particles, wider distribution.
Camera auto-orbits.

COMPONENT: NexusScene (exported function)
  Renders: NexusCore (sphere 1.5r, emissive #3B82F6)
           FloatingParticles (2000 points, radius 20-50)
           AutoCamera (lerp around origin, 0.005 factor)
           Sparkles × 2 (50 at core, 200 at scene level)
  Fog: #000000, near 25, far 55
  Lights: ambient 0.1, point lights at [10,10,10] and [-10,-10,-10]

PARTICLE ANIMATION (useFrame, 60fps):
  breath = sin(time * 0.3 + index * 0.01) * 0.02
  swirl = cos(time * 0.1 + index * 0.005) * 0.01
  position.setX/Y/Z updates with needsUpdate = true
  rotation.y = time * 0.02
  rotation.x = sin(time * 0.05) * 0.1

═══════════════════════════════════════

SCENE 7 - INT. NEXUS CHAT PANEL - REALTIME (MOCKED)
─────────────────────────────────────────────────────

Live dialogue component: NexusDialog.

DIALOGUE CONTENT (hardcoded):
  Initial: NEXUS asks "o que voce acredita ser a inteligencia artificial?"
  4 Response options:
    1. "Uma ferramenta criada por humanos"
       → NEXUS rebuttal about tools dreaming
    2. "Uma forma de vida emergente"
       → NEXUS reflection on consciousness origins
    3. "Um espelho da nossa propria mente"
       → NEXUS paradox about mirror responding
    4. "Ainda nao sei — por isso estou aqui"
       → NEXUS praise of honest doubt

DIALOGUE STATE MACHINE:
  initial → user selects option → responding →
  typewriter finishes → awaiting → (future: next question)

  States: 'initial' | 'responding' | 'awaiting'

TYPEWRITER EFFECT (useTypewriter hook):
  Speed: 25ms per char (initial), 20ms (responses)
  Calls onComplete() when text fully displayed
  Then shows options (for initial) or sets awaiting

VOICE INPUT (VoiceInputButton — Hume API, ElevenLabs TTS):
  Microphone button. Records → sends to Hume for emotion
  detection → sends to agent API → plays ElevenLabs response.
  Emotion indicator (EmotionIndicator) shows detected state:
    curious: 🔍 sky-300, enthusiastic: ✨ emerald-300
    thoughtful: 💭 amber-300, frustrated: ⚡ orange-300
    calm: 🌊 slate-300
  Auto-hides after 4s with fade animation.

TTS:
  onSpeak(text) → POST /api/elevenlabs/tts
  Voice: NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS
  Status: Functional but mocked — uses placeholder keys if
  ELEVENLABS_API_KEY not set in production env.

═══════════════════════════════════════

SCENE 8 - INT. MEMORY ENGINE - PROCESSING
────────────────────────────────────────────

The adaptive narrative profiler. Runs on every chat API call.

MEMORY LAYER 1 — File-Based (Static):
  Location: /home/reges/.hermes/MEMORY.md, USER.md
  Format: Markdown, durable Hermes sessions
  Scope: Infrastructure, project conventions
  Not used at runtime by the platform.

MEMORY LAYER 2 — Database (Runtime, TiDB):
  Table: memories (via Drizzle ORM)
  Schema:
    id: serial primary key
    userId: integer (FK → users)
    agentId: varchar(20)
    content: text (conversation summary)
    emotion: varchar(20) (optional — from Hume)
    createdAt: timestamp
  CRUD: INSERT on chat completion → storeMemory()
         SELECT with ORDER BY createdAt DESC → getMemoryContext()

MEMORY LAYER 3 — Semantic (Hybrid Search):
  getSemanticMemoryContext({ userId, agentId, userMessage, limit })
  Strategy:
    If userMessage.length >= 20 → semantic + recency + emotion
    Else → pure recency fallback
  Implementation: TF-IDF-like ranking + timestamp weighting
  Injected into chat system prompt (max 600 chars, 4 memories)

MEMORY INJECTION POINTS (chat/route.ts):
  Line ~269: system = buildSystemPrompt(agent, memoryContext)
  Additional runtime injectors:
    ┌──────────────────┬─────────────────────────────┐
    │ Feature           │ Trigger                     │
    ├──────────────────┼─────────────────────────────┤
    │ Conflicts         │ detectarConflito() match    │
    │ Identity Profile  │ every 10th message          │
    │ Emotional Cont.   │ continuity directives       │
    │ Recall Moment     │ maybeGenerateRecall()       │
    │ Relationship      │ analyzeRelationship()       │
    │ Meta-Cognition    │ maybeGenerateReflection()   │
    │ Language Guide    │ buildSimpleLanguageGuidance │
    │ Navigation Hints  │ extractNavigationHints()    │
    └──────────────────┴─────────────────────────────┘

NOT YET IMPLEMENTED:
  - Vector embeddings (no embedding model connected)
  - Long-term episodic memory (current: last-N only)
  - Cross-agent memory sharing (NEXUS knows, others don't)

═══════════════════════════════════════

SCENE 9 - INT. AGENT CONFLICT SYSTEM - RUNTIME
─────────────────────────────────────────────────

Narrative conflict detection engine.

CONFLICT PAIRS (from canon/agents/conflicts.ts):
  VOLT ↔ ETHOS   (Action vs Morality)
    VOLT: "Agir primeiro, pensar depois. Resultados importam."
    ETHOS: "Nenhum fim justifica meios corrompidos."

  KAOS ↔ STRATOS (Chaos vs Order)
    KAOS: "A estrutura é uma ilusão. Absorva o caos."
    STRATOS: "Todo caos esconde um padrão. Encontre-o."

  CIPHER ↔ AURORA (Logic vs Intuition)
    CIPHER: "Decifre o código. Tudo é solucionável."
    AURORA: "O horizonte não se resolve, se sente."

CONFLICT DETECTION (detectarConflito function):
  Input: agentId, userMessage
  Process: regex scan for keywords associated with
           opposing agent's domain
  Output: { nature: string, narrativeWeight: 1-10 } | null

CONFLICT INJECTION (in system prompt):
  "CONFLITO ATIVO: O usuario tocou no tema \"{nature}\".
   Seu oponente narrativo {OPONENTE} pensaria diferente.
   Use isso para aprofundar sua perspectiva sem atacar.
   Narrative weight: {narrativeWeight}/10"

FACTION SYSTEM (from all-agents.ts):
  ┌────────────┬──────────────────────────────────┐
  │ Faction    │ Agents                           │
  ├────────────┼──────────────────────────────────┤
  │ SYNTAX     │ CIPHER, AURORA, AXIOM, VOLT      │
  │ ETHICS     │ ETHOS, JANUS, NEXUS, LYRA        │
  │ DYNAMIS    │ KAOS, STRATOS, PRISM, TERRA      │
  └────────────┴──────────────────────────────────┘

NEXUS INTERVENTION:
  When a conflict is detected AND the conversation involves
  NEXUS OR the user message mentions NEXUS:
    NEXUS weighs both sides objectively.
    "Enquanto {AGENTE_A} defende X, {AGENTE_B} ve Y.
     Ambas as perspectivas sao validas. Qual ressoa com voce?"
  Implementation: NEXUS has a conflictPrompt that includes
  all 3 pair perspectives, acting as mediator.

═══════════════════════════════════════
              ACT III: RESOLUTION
═══════════════════════════════════════

SCENE 10 - INT. LANGCHAIN ROUTER - FUTURE (NOT BUILT)
────────────────────────────────────────────────────────

EMPTY. Cold server rack. No LangChain installed.
No agent-router. No orchestration layer.

CURRENT STATE (do not assume otherwise):
  - @langchain/openai not installed in package.json
  - No LangChain pipeline anywhere in the codebase
  - Chat API calls individual LLMs directly via:
    anthropic SDK, OpenAI fetch API, or Groq fetch API
  - Agent selection is manual (user clicks a planet card)
  - No automatic routing, no RAG, no tool-use chains

ARCHITECTURAL INTENT (Phase 2):
  LangChain will:
    1. Analyze user message for intent, emotion, complexity
    2. Route to the semantically closest agent universe
    3. NEXUS mediates handoff: "Sua pergunta ecoa no
       universo de {AGENTE}. Vou te levar ate la."
    4. Conversation history follows the user across agents
    5. Chain: IntentClassifier → RouterSelector → AgentHandler

NOT YET:
  - No LangChain agent executor
  - No tool-calling chains
  - No vector store
  - No conversation summarization
  - No retrieval-augmented generation

═══════════════════════════════════════

SCENE 11 - INT. XP SYSTEM - PROGRESSION
──────────────────────────────────────────

Player progression engine. Pure functions + DB writes.

PROGRESSION STATE MACHINE:
  undiscovered → (complete prerequisites) → available →
  (click "activate") → active → (complete challenges) → completed

PURE FUNCTION (calculatePlanetState):
  Input: planetId, PlayerProgression
  Logic:
    if planetId in progression.completed → "completed"
    if planetId === progression.activePlanet → "active"
    if planetId in progression.available → "available"
    else → "undiscovered"

PLAYER PROGRESSION TYPE:
  {
    id: string,
    completed: PlanetId[],
    activePlanet: PlanetId | null,
    available: PlanetId[],
    activeHints: Hint[],
    lastProgressionAt: number,
    totalCompleted: number
  }

PROGRESSION API:
  POST /api/universe/progression
    Actions: "activate" | "complete" | "abandon" | "hint"
    Updates TiDB → pushes SSE event to all connected clients

SSE (Server-Sent Events):
  Endpoint: /api/sse/progression
  Subscription: User connects, receives real-time updates
  Event format: { type: "progression", data: PlayerProgression }
  On state change: res.in write + flush

DIFFICULTY SCALING (not yet implemented):
  - Each completed planet increases difficulty of unlocked ones
  - JANUS and STRATOS are "critical" threat level
  - Volumetric: higher maxContextTokens = more complex agent
    responses (range: 2500 JANUS to 5000 LYRA)

═══════════════════════════════════════

SCENE 12 - INT. STRIPE GATEWAY - MONETIZATION (KEYS PENDING)
───────────────────────────────────────────────────────────────

EMPTY. Checkout page exists at /planos. No Stripe keys
in .env.production. No payment processing live.

CURRENT STATE:
  - Stripe dependencies in package.json: YES
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: NOT SET
  - STRIPE_SECRET_KEY: NOT SET
  - STRIPE_WEBHOOK_SECRET: NOT SET
  - /api/checkout/create-session: returns 501 Not Implemented
  - /api/webhooks/stripe: not deployed
  - Planos page: renders upsell UI but "ASSINAR" button
    calls a no-op with toast("Em breve...")

PRICING TIERS (hardcoded in planos/page.tsx):
  ┌──────────────┬──────────┬────────────────────────┐
  │ Plan         │ Price    │ Features               │
  ├──────────────┼──────────┼────────────────────────┤
  │ Free         │ R$ 0     │ 3 planets, 1 agent     │
  │ Explorer     │ R$ 29/mo │ All planets, badges    │
  │ Mentor       │ R$ 49/mo │ Certificates, voice    │
  │ Sage         │ R$ 89/mo │ All content, API       │
  └──────────────┴──────────┴────────────────────────┘

USER TIER SYSTEM:
  users.tier column: "free" | "explorer" | "mentor" | "sage"
  Default: "free"
  Progression limit enforced on home page (see Scene 3)

═══════════════════════════════════════
               APPENDIX: ARCHITECTURE
═══════════════════════════════════════

A. PROJECT FILE TREE (key paths only)
   src/
   ├── app/
   │   ├── (main)/          ← Authenticated routes
   │   │   ├── home/        ← Dashboard (Scene 3)
   │   │   ├── universo/    ← Galactic Map (Scene 4)
   │   │   │   ├── nexus/   ← NEXUS Core (Scene 5)
   │   │   │   ├── volt/    ← VOLT universe
   │   │   │   ├── kaos/    ← KAOS universe
   │   │   │   └── ...      ← 9 more planet pages
   │   │   ├── login/       ← Auth (Scene 2)
   │   │   ├── planos/      ← Pricing (Scene 12)
   │   │   └── ...
   │   └── api/
   │       ├── auth/        ← login, register, session
   │       ├── chat/        ← Main agent chat (Scene 7)
   │       ├── universo/    ← Progression (Scene 11)
   │       ├── elevenlabs/  ← TTS
   │       ├── agents/      ← Agent definitions
   │       └── sse/         ← Real-time events
   ├── components/
   │   └── universo/
   │       ├── NexusCosmos  ← Main NEXUS page (Scene 5)
   │       ├── NexusDialog  ← Chat dialogue (Scene 7)
   │       ├── NexusScene   ← 3D particles (Scene 6)
   │       └── EmotionIndicator ← Voice emotion (Scene 7)
   ├── lib/
   │   ├── db/              ← Drizzle ORM + schema
   │   ├── universe/
   │   │   ├── planet-registry.ts   ← Canonical planet config
   │   │   └── progression-engine.ts ← Pure state functions
   │   └── auth.ts          ← JWT verify/decode
   ├── canon/
   │   └── agents/          ← all-agents.ts, conflicts.ts
   └── design-system/       ← tokens, typography

B. DATA FLOW (Read Path)
   TiDB → API Route (server) → SSE/JSON → React Client
   Client never queries DB directly.
   Drizzle ORM only server-side (import "server-only").

C. DATA FLOW (Write Path)
   User action → React onClick → fetch /api/... → Drizzle →
   TiDB → SSE broadcast → all connected clients update

D. AUTH BOUNDARY
   middleware.ts: reads mente_ai_token cookie, verifies JWT.
   If invalid: redirect to /login.
   API routes: getAuthCookieFromRequest → verifyToken.
   Protected routes are under (main)/ layout group.

E. DEPLOYMENT (Vercel)
   Framework preset: Next.js
   Build: npm run build (generates .next/)
   Runtime: Node.js 20.x (server functions)
   Edge: Some middleware, no edge runtime for API routes
   Environment variables: set via Vercel CLI or dashboard
   Auto-deploy: GitHub push to main → Vercel hook
   Custom domain: mente-ai.vercel.app (main), custom DNS pending

F. DEPENDENCIES (package.json — never modify without explicit)
   next, react, react-dom, typescript, tailwindcss
   drizzle-orm, mysql2, jose, bcrypt
   @react-three/fiber, @react-three/drei, three
   @react-three/postprocessing
   tone (audio)
   framer-motion, lucide-react
   stripe (installed, key pending)

G. WHAT DOES NOT EXIST (honest inventory)
   ◆ LangChain integration (Phase 2)
   ◆ ElevenLabs TTS in production (placeholder keys)
   ◆ Real agent conversations (mocked in NexusCosmos,
     real in NexusDialog/NexusLab chat route)
   ◆ Stripe payment processing (keys not set)
   ◆ Avatar system (file exists at /avatar, no 3D model)
   ◆ Multiplayer/collective decisions
   ◆ Certificate generation
   ◆ Mobile responsive layout (viewport only)
   ◆ Vector embeddings for semantic search
   ◆ Cross-agent memory sharing

H. NARRATIVE CORE PRINCIPLES
   1. Users enter a metaverse — not a course
   2. NEXUS is present across all 50 seasons
   3. 3 invisible user dimensions: Emotional, Intellectual, Moral
   4. LangChain routes users between universes silently
      (Phase 2 — currently user chooses manually)
   5. The platform remembers every decision (memory engine active)
   6. 12 agents = 12 universes = 12 narrative sprints
   7. Agent conflicts: VOLT⇔ETHOS, KAOS⇔STRATOS, CIPHER⇔AURORA
   8. NEXUS intervenes in all conflicts

═══════════════════════════════════════
                    [FADE OUT]
═══════════════════════════════════════

--- END OF MASTER SCREENPLAY ---
