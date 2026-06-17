# Relatório Completo do Projeto — MENTE.AI

**Data**: 14/06/2026  
**Branch atual**: `main` (limpa, sem mudanças staged)  
**Commits recentes**: `ca72e7b` — feat: add Universos to nav, fix Bell/Compass links, add Perfil to account dropdown

---

## 1. Status de Build e Qualidade

| Item | Status | Detalhes |
|------|--------|----------|
| Build | ✅ | `Compiled successfully` — Turbopack, ~30s, 114 páginas |
| TypeScript (`npx tsc --noEmit`) | ✅ | Zero erros |
| Testes (`npx jest`) | ✅ | 24 suites, 460 testes — todos passam |
| ESLint | ⚠️ | 54 erros restantes (22 são `no-explicit-any` — deliberadamente ignorados por decisão do usuário; 32 outros) |
| Auditoria (`npm audit`) | ⚠️ | 2 moderados: `postcss` (via next, XSS) e `uuid` (via @langchain/langgraph, buffer bounds) — ambos não bloqueantes |

---

## 2. Código Fonte

- **526** arquivos TypeScript (`.tsx` + `.ts`)
- **23** diretórios de componentes
- **60+** rotas de página
- **~60** endpoints de API

### Páginas Principais

```
/ (home)           /explorar          /agentes           /agentes/[id]
/aulas             /lab               /lab/experiment     /player
/series            /series/[agentId]  /series/[...season] /universo
/universo/nexus    /universo/volt     /universo/aurora    (todos os 12 planetas)
/login             /cadastro          /planos             /perfil
/conta             /conta/assinatura  /conta/configuracoes /conta/pagamento
/blog              /blog/[slug]       /onboarding         /avatar
/certificado       /logos             /sucesso            /sentinel
/admin/dashboard
```

### APIs por Grupo

| Grupo | Endpoints |
|-------|-----------|
| Auth | login, logout, register, session |
| Chat/LLM | chat, agentes, agents/chat |
| Lab | start, status, board, agent, rollback, transformer |
| Universe | chat, progression, presence |
| Series | content |
| XP/Ranking | award, events, level-up |
| Voice/Audio | speak, converse, emotion, transcribe |
| Logos | evaluate, generate, question, tts, validate |
| Health | system, anthropic, governance |
| Payments | webhooks/stripe, checkout |
| Outros | narrative, visuals, dashboard, badges, blog, etc. |

---

## 3. Stack Tecnológica

### Core
- **Next.js 16.2.6** + TypeScript 5.9.3 + React 19.2.4
- **Tailwind CSS 4** + PostCSS 4

### Database
- **Drizzle ORM 0.45.1** — 37 tabelas no schema (`src/lib/db/schema.ts`)
- **TiDB Cloud** (MySQL-compatible)
- **mysql2** como driver

### Autenticação
- **JWT** via `jose 6.2.2`
- Cookie: `mente_ai_token`
- Middleware: `src/middleware.ts` (legado — Next.js 16 recomenda `proxy`)

### IA
- **Anthropic Claude** + **OpenAI** (fallback)
- **LangChain** (core + openai)
- **ElevenLabs** (TTS)

### Animações e 3D
- Framer Motion 11.18.2
- React Three Fiber 9.5.0 + Three.js 0.183.2
- D3.js (MemoryGalaxy)
- tsparticles

### Pagamentos
- Stripe 20.4.1

### Build
- **Turbopack** (padrão Next.js 16)
- `next.config.mjs` com `serverExternalPackages: ['mysql2', 'drizzle-orm/mysql2']`

---

## 4. Banco de Dados — 37 Tabelas (Drizzle)

| Tabela | Finalidade |
|--------|------------|
| `users` | Usuários |
| `profiles` | Perfis por usuário |
| `userPreferences` | Preferências |
| `series` | Séries de conteúdo |
| `episodes` | Episódios |
| `interactiveDecisions` | Decisões interativas |
| `watchProgress` | Progresso de vídeo |
| `userXp` | XP dos usuários |
| `userAgentProgress` | Progresso por agente |
| `chatHistory` | Histórico de chat |
| `explorers` | Exploradores |
| `explorerProgress` | Progresso de exploração |
| `explorerDecisions` | Decisões de exploração |
| `agentCombinations` | Combinações de agentes |
| `userCombinations` | Combinações do usuário |
| `agentMemories` | Memórias de agente |
| `agentMetadata` | Metadados de agente |
| `agentNotes` | Notas de agente |
| `logoAttempts` | Tentativas de logos |
| `knowledgeUnit` | Unidades de conhecimento |
| `knowledgeAsset` | Assets de conhecimento |
| `knowledgeGraphEdge` | Arestas do grafo |
| `universePresence` | Presença no universo |
| `universeProgression` | Progressão no universo |
| `favorites` | Favoritos |
| `watchProgress` | Watch progress |
| `userCombinations` | Combinações do usuário |
| + tabelas de enum/tipo (AGE_GROUPS, CATEGORIAS_AGENTE, COGNITIVE_LEVELS, etc.) |

---

## 5. Estrutura de Diretórios (Componentes)

```
src/components/
├── agents/          — Cards, heróis, agente runner
├── biblioteca/      — LivingBook, BookModal
├── blog/            — Blog components
├── combinacao/      — Combinação de agentes
├── explorar/        — Catálogo/exploração
├── features/
│   ├── aula-viva/   — AnimatedVisualizer
│   └── layout/      — Navigation, Footer, etc.
├── gamification/    — XP, badges, rankings
├── home/            — Homepage (AgentCard, hero sections)
├── hud/             — HUD, health bar
├── info/            — Informações
├── journey/         — Journey hub
├── lab/             — Laboratório (Board, experimentos)
├── logos/           — Logos Oracle
├── motion/          — Animações (grelha, partículas)
├── netflix/         — Netflix-style (ProfileGate)
├── onboarding/      — Onboarding flow
├── scenes/          — Cenas
├── simulador/       — Simulador
├── ui/              — UI primitives (shadcn/ui)
├── universe/        — MemoryGalaxy, orbit maps
├── universo/        — Planet pages
├── visuals/         — VisualStoryPlayer
└── zones/           — Zona components
```

---

## 6. Serviços e Stores

### Services (`src/services/`)
| Serviço | Função |
|---------|--------|
| `agent.service.ts` | Lógica de agentes |
| `chat.service.ts` | Lógica de chat |
| `explorar.service.ts` | Exploração |
| `topic.service.ts` | Tópicos |
| `agent-combination.ts` | Combinações |

### Providers (`src/providers/`)
| Provider | Função |
|----------|--------|
| `JourneyProvider.tsx` | Contexto de jornada |
| `OasisProvider.tsx` | Contexto Oasis |
| `SessionProvider.tsx` | Contexto de sessão |

### Stores (Zustand)
- `store/useLabStore.ts` — Estado do laboratório

### Hooks
- `hooks/useChatHistory.ts` — Histórico de chat
- `hooks/useXPStream.ts` — Stream de XP

---

## 7. Configurações e Constantes

| Arquivo | Conteúdo |
|---------|----------|
| `src/config/seasons.ts` | Config de temporadas |
| `src/constants/catalog.ts` | Catálogo de agentes |
| `src/lib/db/index.ts` | Conexão com banco (Drizzle) |
| `src/lib/db/schema.ts` | Schema completo (37 tabelas) |
| `eslint.config.mjs` | ESLint flat config |
| `next.config.mjs` | Next.js config (Turbopack + serverExternalPackages) |
| `jest.config.ts` | Jest config |
| `tsconfig.json` | TypeScript config (@/ → src/) |

---

## 8. Branches

- **50+** branches locais
- **60+** branches remotas
- Branch ativa: `main`
- Branches de destaque: `feat/redesign-home-v2`, `feat/lab-redesign`, `feat/galaxy-float-animation`, `feat/navigation-links`
- 4 branches temporárias do OpenCode: `opencode/gentle-river`, `opencode/misty-island`, `opencode/playful-engine`, `opencode/proud-forest`

---

## 9. Correções Realizadas (Sessão Atual)

| Etapa | Correção | Status |
|-------|----------|--------|
| ETAPA 1-D | 6 erros estruturais ESLint (regex, escape, const-expr, etc.) | ✅ Merged |
| ETAPA 2-C | 14 comentários `//` em JSX → `{/* */}` | ✅ Merged |
| ETAPA 3-B | 22 `require()` → `import` em 6 contract tests | ✅ Merged (238/238 testes) |
| ETAPA 4-A | 22 `no-explicit-any` — usuário optou por ignorar | ⏭️ Skipped |
| next.config.mjs | Criado com serverExternalPackages | ✅ Main |
| 9 className dinâmicas | Convertidas para inline `style` (Turbopack compat) | ✅ Main |
| MemoryGalaxy Float | floatX/floatY + @keyframes CSS | ✅ `feat/galaxy-float-animation` |
| Navigation Links | /universo, Bell→/notificacoes, Compass→/universo, /perfil | ✅ `feat/navigation-links` |

---

## 10. Pendências e Observações

### Pendências Técnicas
1. **ESLint**: 32 erros residuais (não categorizados) além dos 22 ignorados
2. **Vulnerabilidades**: 2 moderadas (postcss via Next.js — requer upgrade do Next; uuid via langchain)
3. **Middleware legado**: `src/middleware.ts` usa API antiga — Next.js 16 recomenda `proxy`
4. **Arquivos não rastreados**: `eslint.config.mjs`, `jest.config.ts`, `next.config.mjs`, `coverage/`, `docs/` — decidir se entram no repositório
5. **Health Audit**: `docs/health-audit-2026-06-11.md` (3 dias, possivelmente desatualizado)

### Observações
- Build com Turbopack produz avisos de `no anonymous default export` (comportamento normal do Turbopack)
- CalibrationModal ainda importado e renderizado mesmo sem ser alvo de navegação
- Duas branches remotas sem contraparte local: `feat/galaxy-float-animation`, `feat/navigation-links`
- Packages alvo de migração futura: `@react-three/drei` (requer @react-three/fiber canary on Next.js 16)

---

## 11. Comandos Úteis

```powershell
npm run dev -- --webpack       # Dev server (webpack stable)
npm run build                  # Build de produção
npm run test                   # Jest (24 suites, 460 testes)
npx tsc --noEmit               # Type check
npx eslint src                 # ESLint scan
npm run quality                # Lint + typecheck + test
Remove-Item -Recurse -Force .next  # Limpar cache
```
