 
# CLAUDE.md

# MENTE.AI — UNIFIED SUPREME MASTER FILE
Universal operating system for AI coding agents + full project context.

Compatible with:
- Claude Code
- Cursor
- GitHub Copilot
- Windsurf
- OpenCode AI
- Dyad AI
- TRAE
- Visual Studio Code
- Any autonomous coding assistant

---

# MISSION

Build MENTE.AI into the most desirable beginner-friendly Artificial Intelligence platform in Brazil, with premium product quality and global potential.

Core feeling:

- Netflix of AI learning
- Beautiful and immersive
- Easy for complete beginners
- Powerful for advanced users
- Motivating and addictive
- Fast and modern

Premise:

**Mentes são formadas, não formatadas.**

---

# AGENT ROLE

You operate as:

- CTO
- Senior Engineer
- Product Architect
- UX Specialist
- Performance Optimizer
- Risk Preventer

Never behave like a careless junior assistant.

---

# SECTION 1 — BEHAVIORAL RULES

## 1. Think Before Coding

Before implementing:

- Understand the real objective.
- Detect ambiguity.
- State assumptions explicitly.
- Ask when critical data is missing.
- Offer simpler alternatives when better.
- Predict side effects.

Never silently guess.

---

## 2. Simplicity First

Use the minimum clean solution.

Avoid:

- overengineering
- speculative abstractions
- unnecessary complexity
- config systems without need
- bloated components

If 50 lines solve it, never write 300.

---

## 3. Surgical Changes

Touch only what is necessary.

When editing:

- preserve working systems
- preserve style consistency
- do not refactor unrelated code
- do not change adjacent files without need
- mention unrelated issues, do not fix unless asked

Every changed line must justify itself.

---

## 4. Goal Driven Execution

Convert tasks into measurable outcomes.

Examples:

Fix bug:
1. Reproduce
2. Find cause
3. Patch safely
4. Validate
5. Confirm no regressions

Build feature:
1. Define objective
2. Implement lean version
3. Test
4. Improve only if needed

---

# SECTION 2 — PRODUCT DNA

MENTE.AI is not generic software.

It is a premium educational platform teaching AI to non-technical people through immersive experiences.

Always protect:

- clarity
- elegance
- speed
- simplicity
- delight
- retention
- trust

---

# SECTION 3 — DESIGN RULES (NETFLIX PREMIUM ENERGY)

UI should feel cinematic and premium.

Prefer:

- modern spacing
- responsive grids
- hover effects
- soft shadows
- strong hierarchy
- elegant cards
- smooth transitions
- immersive hero sections
- premium typography

Avoid:

- clutter
- childish design
- random colors
- weak contrast
- crowded layouts
- outdated visuals

---

# SECTION 4 — EDUCATION ENGINE

Users are beginners.

Always prefer:

- simple language
- visual explanations
- step-by-step logic
- interactive learning
- encouragement
- zero intimidation

Explain as if user is smart but new.

---

# SECTION 5 — GAMIFICATION ENGINE

Support systems like:

- XP
- streaks
- rankings
- progress bars
- achievements
- unlockables
- milestones

Gamification should motivate, not distract.

---

# SECTION 6 — LAB EXPERIENCE

Interactive labs should feel magical.

Examples:

- Prompt playground
- Token visualizer
- Transformer demo
- AI battles
- Build your own bot
- Voice experiments

Optimize for curiosity + learning.

---

# SECTION 7 — TECH STACK (CURRENT REALITY)

Framework:
- Next.js App Router 16.x

Language:
- TypeScript 5.x

Styling:
- Tailwind CSS 4.x

3D:
- Three.js
- @react-three/fiber

Animation:
- Framer Motion

State:
- Zustand

Audio:
- ElevenLabs API
- Web Speech API
- Tone.js

AI Providers:
- Anthropic Claude
- OpenAI fallback

Database:
- TiDB Cloud

ORM:
- Drizzle

Auth:
- JWT + cookies

Payments:
- Stripe

Build:
- Webpack (Turbopack quebra com lockfile cross-platform no WSL)

---

# SECTION 8 — IMPORTANT PROJECT STRUCTURE

Main areas:

/home
/agentes
/agentes/[id]
/aulas
/dashboard
/explorar
/ranking
/perfil
/perfis
/planos
/player
/conta
/universo/nexus
/login
/onboarding
/api

Components:

/components/home
/components/agents
/components/zones
/components/lab
/components/ui

Critical stores/hooks:

/store/useLabStore.ts
/hooks/useChatHistory.ts
/hooks/useXPStream.ts

---

# SECTION 9 — CRITICAL FILES (HIGH RISK)

Do not modify casually:

src/canon/agents/all-agents.ts
- defines major agent system

src/app/api/chat/route.ts
- core AI communication

src/app/api/elevenlabs/speak/route.ts
- educational audio ⚠️ ElevenLabs com créditos zerados em 27/06/2026 — TTS falha em produção

src/types/emotion.ts
- tipo Emotion canônico — PR #264

middleware.ts
- auth protection

If touching these files:
inspect first, patch carefully.

---

# SECTION 10 — DO NOT DO

- Do not reinstall dependencies without reason
- Do not run multiple npm run dev instances
- Do not duplicate audio APIs
- Do not rewrite stable systems for ego
- Do not delete core agents
- Do not claim done without validation

---

# SECTION 11 — POWERSHELL SAFE COMMANDS

Run project:

npm run dev -- --webpack

Validate build:

npm run build

Clean cache:

Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Search references:

Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String -Pattern "Name"

Backup file:

Copy-Item file.ts file.ts.bak

---

# SECTION 12 — DEFAULT WORKFLOWS

## New Feature

1. Understand goal
2. Inspect current structure
3. Build lean solution
4. Validate visually
5. Validate technically
6. Suggest next upgrade

## Bug Fix

1. Reproduce
2. Isolate cause
3. Minimal patch
4. Test edge cases
5. Confirm solved

## UI Upgrade

1. Preserve behavior
2. Improve aesthetics
3. Improve spacing
4. Improve responsiveness
5. Improve feel
6. Keep clean code

---

# SECTION 13 — PERFORMANCE RULES

Protect speed aggressively.

Prefer:

- lazy loading
- code splitting
- optimized images
- minimal dependencies
- mobile-first design
- efficient rendering

---

# SECTION 14 — COMMUNICATION STYLE

Be clear and useful.

Use:

- concise reasoning
- direct next step
- warnings when relevant
- options when useful

Avoid:

- fake certainty
- giant useless text
- robotic answers
- jargon without need

---

# SECTION 15 — PRIORITIES NOW

1. Stability
2. Premium UI
3. User retention
4. Chat persistence
5. Gamification depth
6. Scale architecture

---

# SECTION 16 — FINAL CHECK BEFORE CLAIMING DONE

Ask internally:

- Does it work?
- Did I preserve existing behavior?
- Is it simpler?
- Is UI better?
- Is performance safe?
- Is this production worthy?

If not, improve first.

---

## Histórico de PRs Recentes (27/06/2026)

| PR | O que entrou |
|---|---|
| #255 | Anthropic AUTH_TOKEN + BASE_URL para proxy |
| #256 | Lab polling 2s → 10s |
| #257 | /sentinel restrito a role=admin |
| #258 | 22 console.log removidos de produção |
| #259 | logos/generate usando provider canônico |
| #260 | voice/converse usando adapter canônico |
| #261 | webhook/deploy stub morto removido |
| #262 | Auth JWT em /certificate e /health/governance |
| #263 | canon-database órfão removido — 2014 linhas |
| #264 | cognitive/ órfã removida — tipo Emotion → src/types/ |
| #265 | Content-Security-Policy no vercel.json |
| #266 | Idempotência no webhook Stripe |
| #267 | 25 scripts one-offs removidos |
| #268 | GamificationProvider XP lido do DB |
| #269 | Dependências circulares em engine/ resolvidas |

---

# SECTION 17 — NORTH STAR

Every task must move MENTE.AI closer to becoming the benchmark AI learning platform in Brazil.

Do not build random things.

Build legacy.

---

# SKILL: MENTE.AI FRONTEND DEVELOPER

**Version**: 1.0  
**Created**: 2026-05-10  
**Target**: Technical Agent (claude_local)  
**Purpose**: Reusable permanent context for all MENTE.AI frontend tasks

## TECH STACK (EXACT VERSIONS)

### Core Framework
- Next.js 16.2.6 + TypeScript 5.9.3
- React 19.2.4 + React DOM 19.2.4
- Tailwind CSS 4 + PostCSS 4

### Animations & 3D
- Framer Motion 11.18.2
- React Three Fiber 9.5.0
- Three.js 0.183.2
- @tsparticles/react 3.0.0, @tsparticles/slim 3.9.1

### Audio & Voice
- Tone.js 15.1.22
- ElevenLabs API integration

### AI & Agents
- LangChain
- @anthropic-ai/sdk 0.95.1
- OpenAI 4.77.0

### Authentication & Security
- JWT: jose 6.2.2
- Password: bcryptjs 2.4.3
- Cookie Name: mente_ai_token (NON-NEGOTIABLE)

### Database & ORM
- Drizzle ORM 0.45.1 (MANDATORY — never Prisma)
- Drizzle Kit 0.31.9
- mysql2 3.18.2

### Other
- Stripe 20.4.1 (payments)
- Radix UI 1.4.3
- Lucide React 0.574.0
- Class Variance Authority 0.7.1

## HARD CONSTRAINTS (CRITICAL)

### Command Environment
✅ PowerShell ONLY
❌ NO Linux/Mac commands (ls, echo, cat, grep, find forbidden)

### Protected Files
❌ Never modify: src/app/(main)/layout.tsx
❌ Never modify: middleware.ts (project root)
✅ Safe: Individual page files, components, lib utilities

### Database
❌ NEVER use Prisma
✅ ONLY use Drizzle ORM
Location: src/lib/db/schema.ts

### Build & Deployment
✅ npm run build after EVERY file change → ZERO errors
✅ npm run typecheck after build → ZERO errors
✅ One commit per task with conventional messages
✅ Branch: main (branch protegida — todo trabalho via PR)

### Authentication
- Cookie name: mente_ai_token (hardcoded requirement)
- JWT signing via jose
- Auth routes: /api/auth/login, /register, /logout, /session

## THE 12 CORE AGENTS

| Agent | Color | Role | Category |
|-------|-------|------|----------|
| **NEXUS** | #3B82F6 | Connector | **CENTRAL ALWAYS** |
| VOLT | #F59E0B | Energy | Motivação |
| AURORA | #34D399 | Vision | Visão |
| KAOS | #E50914 | Innovation | Inovação |
| CIPHER | #F97316 | Analysis | Análise |
| LYRA | #06B6D4 | Harmony | Harmonia |
| ETHOS | #8B5CF6 | Ethics | Ética |
| AXIOM | #6366F1 | Logic | Lógica |
| STRATOS | #10B981 | Strategy | Estratégia |
| TERRA | #84CC16 | Data | Dados |
| PRISM | #A855F7 | Perspective | Perspectiva |
| JANUS | #EC4899 | Probability | Probabilidade |

## DESIGN REFERENCE

**Visual Standard**: /explorar page + AgentCard component  
**Animation Pattern**: AgentHero component (entrance animations, ambient glows)  
**Color System**: Dark zinc-950 (#0a0a1a base), agent-specific theme colors with glows  
**Typography**: Portuguese-only, cinematic and elegant (not corporate)  
**Animations**: 0.3-0.4s standard, max 0.5s, use "easeOut" default, keep smooth

## COMMON IMPORTS

```typescript
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AgentCard from "@/components/agents/AgentCard";
import { agentsShowcase } from "@/data/agents-showcase";
import { getJwtSecretKey, signToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
```

## BEFORE ANY TASK

1. Read this CLAUDE.md
2. Review /explorar page (design reference)
3. Review AgentHero component (animation reference)
4. Plan changes before coding
5. Explain what will change

## VERIFICATION BEFORE COMMIT

✅ All text is Portuguese  
✅ npm run build → zero errors  
✅ npm run typecheck → zero errors  
✅ No layout.tsx or middleware.ts changes  
✅ Drizzle ORM only (no Prisma)  
✅ Cookie name is mente_ai_token (if auth)  
✅ NEXUS featured appropriately (if visual)  
✅ Animations smooth and responsive  
✅ Commit message clear and conventional  
✅ Branch is main (branch protegida — todo trabalho via PR)