# 🧠 MENTE.AI — Cognitive Architecture Master Index

> **Single Source of Truth** para o ecossistema MENTE.AI  
> **Última atualização:** Maio 2026  
> **Branch ativa:** `feat/lab-redesign`  
> **Deploy:** https://mente-ai.vercel.app

---

## 📌 O QUE É ESTE DOCUMENTO

Este é o índice-mestre da arquitetura cognitiva do **MENTE.AI** — o metaverso educacional de Inteligência Artificial que transforma conceitos abstratos em agentes com personalidade, narrativa imersiva e progressão emocional.

Toda decisão arquitetural, todo sistema de memória, todo agente canônico e todo protocolo de segurança está referenciado aqui. Se um documento não aparece neste índice, ele não é canônico.

**Inclui o sistema ADR (Architecture Decision Records):** a memória de engenharia que preserva o *porquê* de cada decisão — como a caixa-preta de um avião, garantindo que o raciocínio sobreviva à rotatividade da equipe.

**Premissa:** *Mentes são formadas, não formatadas.*

---

## 🧬 DNA DO PRODUTO

| Dimensão | Descrição |
|----------|-----------|
| **Missão** | Construir pensadores, não ferramentas |
| **Público** | Iniciantes em IA — kids, teens e adultos |
| **Sensação** | Netflix do aprendizado de IA — bonito, imersivo, viciante |
| **Tom** | Cinematográfico, cyberpunk, acolhedor |
| **Idioma** | Português Brasileiro (100% do conteúdo) |

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Principal

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Framework** | Next.js App Router | 16.2.6 |
| **Linguagem** | TypeScript strict | 5.9.3 |
| **Estilização** | Tailwind CSS | 4.x |
| **3D** | Three.js + React Three Fiber | 0.183 / 9.5 |
| **Animação** | Framer Motion | 11.18 |
| **Estado** | Zustand | — |
| **ORM** | Drizzle ORM | 0.45.1 |
| **Banco** | TiDB Cloud (MySQL) | — |
| **Auth** | JWT (jose) + cookies | `mente_ai_token` |
| **Pagamento** | Stripe (modo teste) | 20.4.1 |
| **Voz** | ElevenLabs + Web Speech API | — |
| **IA** | Anthropic Claude + OpenAI fallback | — |
| **Deploy** | Vercel (gru1 — São Paulo) | — |

### Estrutura de Diretórios (visão arquitetural)

```
AI-KIDS-OFICIAL/
├── src/
│   ├── app/                    # App Router (30+ API routes, 56+ pages)
│   │   ├── (main)/             # Route group principal
│   │   │   ├── home/           # Home cinematográfica (partículas + typewriter)
│   │   │   ├── universo/       # 12 páginas de universo (1 por agente canônico)
│   │   │   ├── agentes/        # Detalhe dos agentes
│   │   │   ├── aulas/          # Netflix-style com carrosséis
│   │   │   ├── player/         # Player de vídeo + chat com NEXUS
│   │   │   ├── lab/            # Laboratório de Inteligência Viva
│   │   │   ├── conta/          # Conta, Stripe, perfis, avatar
│   │   │   └── explorar/       # Exploração de conteúdo
│   │   └── api/                # Rotas de API
│   │       ├── auth/           # login, register, logout, session
│   │       ├── chat/           # Core AI communication
│   │       ├── universo/chat/  # Chat dos universos com ToT
│   │       └── elevenlabs/     # Voz dos agentes
│   ├── canon/agents/           # Catálogo canônico (12 + 108 gerados)
│   ├── lib/
│   │   ├── auth.ts             # Single source of truth para JWT/cookies
│   │   ├── db/                 # Drizzle ORM: schema + lazy pool
│   │   ├── engine/             # Motor narrativo (profiler, router, conflicts)
│   │   └── safe-client.ts      # Guards de hidratação SSR
│   ├── components/
│   │   ├── scenes/             # 12 cenas Three.js (lazy loaded)
│   │   ├── agents/             # Cards, chat, hero dos agentes
│   │   └── universo/           # Diálogos e canvas dos universos
│   ├── store/                  # 5 Zustand stores
│   └── hooks/                  # useChatHistory, useHydrated, useXPStream
├── docs/                       # Documentação (ESTE ÍNDICE)
├── universe-core/              # Base narrativa do universo
├── vercel.json                 # Config de deploy, timeouts, headers
├── CLAUDE.md                   # Arquivo mestre para agentes de IA
├── ROADMAP.md                  # Roadmap de desenvolvimento
└── README.md                   # Entry point do projeto
```

---

## 🧠 SISTEMA COGNITIVO (5 Camadas de Memória)

O MENTE.AI implementa uma arquitetura de memória de 5 camadas, inspirada em psicologia cognitiva:

```
┌─────────────────────────────────────────────┐
│            IDENTITY PROFILER                 │
│   (3 dimensões: emocional, intelectual,     │
│    moral → detecta 6 arquétipos)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          SEMANTIC MEMORY (TF-IDF)            │
│   (persistente, vetorizada, similaridade    │
│    cosseno, embedding de conceitos)         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          MEMORY CONSOLIDATOR                │
│   (sleep/wake cycle, summarização,          │
│    decaimento temporal, coalescência)       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          CONTEXT PRIORITY ENGINE             │
│   (classificação de contexto, 5 níveis,     │
│    janela deslizante, injeção seletiva)     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              RECALL MOMENTS                  │
│   (gatilhos emocionais, resgate de          │
│    memórias antigas, continuidade)          │
└─────────────────────────────────────────────┘
```

### Armazenamento de Memória (Chat API)

- **Injeção:** Top 4 memórias por peso emocional + recência (máx 600 chars / ~150 tokens)
- **Filtro anti-ruído:** Ignora mensagens < 20 chars, saudações simples
- **Tipos de sinal detectados:** emotional, factual, preference, narrative
- **Limite:** 200 memórias por par (usuário, agente), TTL 90 dias
- **Storage:** Fire-and-forget — nunca bloqueia a resposta do chat

---

## 🎭 OS 12 AGENTES CANÔNICOS

| # | Agente | Cor | Dimensão | Função |
|---|--------|-----|----------|--------|
| 1 | **NEXUS** | `#3B82F6` | Intelectual | Conector Central — orquestrador |
| 2 | **VOLT** | `#F59E0B` | Científica | Energia e Motivação |
| 3 | **AURORA** | `#34D399` | Criativa | Visão e Criação |
| 4 | **KAOS** | `#E50914` | Criativa | Inovação disruptiva |
| 5 | **CIPHER** | `#F97316` | Intelectual | Análise e Padrões |
| 6 | **LYRA** | `#06B6D4` | Emocional | Harmonia e Conexão |
| 7 | **ETHOS** | `#8B5CF6` | Ética | Filosofia e Dilemas |
| 8 | **AXIOM** | `#6366F1` | Intelectual | Lógica e Dedução |
| 9 | **STRATOS** | `#10B981` | Estratégica | Estratégia e Jogos |
| 10 | **TERRA** | `#84CC16` | Científica | Dados e Natureza |
| 11 | **PRISM** | `#A855F7` | Emocional | Perspectiva e Refração |
| 12 | **JANUS** | `#EC4899` | Estratégica | Probabilidade e Dualidade |

### Sistema de Conflitos Narrativos

Agentes possuem conflitos pré-definidos entre pares (ex: VOLT↔ETHOS, KAOS↔STRATOS, CIPHER↔AURORA). Quando o usuário menciona palavras-gatilho, o conflito ativa com `narrativeWeight` (7-9) — gerando respostas com tensão dramática.

---

## 🧭 ENGINE NARRATIVO

### Profiler (2 sistemas)

| Sistema | Localização | Persistência |
|---------|------------|--------------|
| Client-side profiler | `src/lib/engine/profiler.ts` | localStorage |
| Server-side profiler | `src/engine/profiler.ts` | DB (Drizzle) + localStorage fallback |

**Dimensões:** Emotional Score, Intellectual Score, Moral Score → 6 Arquétipos

### Router

- `src/lib/engine/router.ts` — Roteia usuário entre agentes com base no perfil + palavras-chave
- `src/engine/phase-router.ts` — Roteamento por fases narrativas (LEGO system: 50 temporadas, 5 fases)

### Backtrack

- `src/lib/engine/backtrack.ts` — Histórico de navegação com suporte a voltar passos

### Tree of Thoughts (ToT)

- Implementação real com OpenAI API (GPT-4o) em `langchain-integration.ts`
- O agente "pensa" em 3 caminhos antes de responder
- Confiança: 92%

---

## 🔐 SISTEMA DE SEGURANÇA

### Autenticação

| Componente | Detalhe |
|------------|---------|
| **Cookie** | `mente_ai_token` (NÃO NEGOCIÁVEL) |
| **JWT** | `jose` — sign/verify com secret |
| **Middleware** | `src/middleware.ts` — valida JWT criptograficamente |
| **Rotas públicas** | `/login`, `/planos`, `/api/*` (excluídas do matcher) |
| **getAuthCookie()** | Async — usa `await cookies()` do Next.js |
| **getSessionUser()** | Combina `getAuthCookie()` + `verifyToken()` |

### Rate Limiter

- Pluggable, configurável por rota
- Integrado com structured logger

### Logger Estruturado

- Níveis: debug, info, warn, error
- Transport: console (dev) + Sentry (produção)

---

## 🛡️ CAMADA DE RESILIÊNCIA

### Error Boundaries (4 níveis)

```
src/app/global-error.tsx          ← Último recurso (crash do layout raiz)
src/app/error.tsx                 ← Fallback do segmento raiz
src/app/(main)/error.tsx          ← Grupo de rotas principal
src/app/(main)/conta/error.tsx    ← Específico da conta
```

### Loading States (6 níveis)

```
src/app/(main)/loading.tsx        ← Fallback geral
src/app/(main)/home/loading.tsx   ← Home (partículas + hero)
src/app/(main)/lab/loading.tsx    ← Lab (Three.js pesado)
src/app/(main)/universo/loading.tsx ← Universos (cenas 3D)
src/app/(main)/player/loading.tsx ← Player (vídeo + TTS)
src/app/(main)/conta/loading.tsx  ← Conta (dados)
```

### Hidratação SSR

- `src/lib/safe-client.ts` — Guards: `isBrowser`, `safeGetItem`, `safeSetItem`
- `src/hooks/useHydrated.ts` — Gate de hidratação para componentes com localStorage/Window APIs
- **Regra:** `Math.random()` NUNCA dentro de `useMemo` em componentes `"use client"` — usar padrão `mounted` state

---

## 🗄️ BANCO DE DADOS

### Schema (Drizzle ORM — MySQL/TiDB)

**Tabelas principais:** `users`, `series`, `episodes`, `watchProgress`, `favorites`, `chatHistory`, `userPreferences`, `interactiveDecisions`, `explorers`, `explorerProgress`, `explorerDecisions`, `profiles`, `agentNotes`, `userXp`, `agentMetadata`, `userAgentProgress`, `agentCombinations`, `userCombinations`

### Pool Pattern

```typescript
// src/lib/db/index.ts — Lazy Singleton com Proxy
// Pool criado apenas no primeiro .select() / .insert()
// Economiza conexões MySQL em cold starts serverless
import { db } from "@/lib/db";      // ← API inalterada
import { pool } from "@/lib/db";    // ← API inalterada
```

---

## 📖 DOCUMENTOS CANÔNICOS

### Bible Documents (Narrativa)

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **Universe Base** | `docs/narrative/AI_KIDS_FLIX_UNIVERSE_BASE.md` | Missão, pilares, faixas etárias, trilhas |
| **Universe Guardian** | `docs/narrative/universe-guardian.prompt.md` | Protocolo de validação de conteúdo |

### Roadmap

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **ROADMAP.md** | raiz do projeto | Fases 1-5, métricas, deploy |

### Memória Arquitetural (ADRs)

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **ADR/README.md** | `docs/architecture/ADR/` | Sistema ADR: o que é, como criar, ciclo de vida |
| **ADR-001** | `docs/architecture/ADR/` | Escolha do ORM: Drizzle vs Prisma |
| **ADR-002** | `docs/architecture/ADR/` | Arquitetura de Banco: TiDB Cloud |
| **ADR-003** | `docs/architecture/ADR/` | Estratégia de Autenticação: JWT + Cookies |
| **ADR-004** | `docs/architecture/ADR/` | Sistema de Memória em 5 Camadas |
| **ADR-005** | `docs/architecture/ADR/` | Recuperação Semântica: TF-IDF |
| **ADR-006** | `docs/architecture/ADR/` | Motor de Prioridade de Contexto |
| **ADR-007** | `docs/architecture/ADR/` | Motor de Estado de Relacionamento |
| **ADR-008** | `docs/architecture/ADR/` | Reflexão Meta-Cognitiva |
| **ADR-009** | `docs/architecture/ADR/` | Arquitetura de Streaming |
| **ADR-010** | `docs/architecture/ADR/` | Filosofia Narrative-First |
| **ADR-011** | `docs/architecture/ADR/` | Escolha do Framework: Next.js App Router |
| **ADR-012** | `docs/architecture/ADR/` | Gerenciamento de Estado: Zustand |
| **ADR-013** | `docs/architecture/ADR/` | Estratégia de Estilização: Tailwind CSS 4 |
| **ADR-014** | `docs/architecture/ADR/` | Plataforma de Deploy: Vercel (gru1) |
| **ADR-015** | `docs/architecture/ADR/` | Padrão de Pool: Lazy Singleton com Proxy |
| **ADR-016** | `docs/architecture/ADR/` | Estratégia de Voz: ElevenLabs + Fallback |
| **ADR-017** | `docs/architecture/ADR/` | Hierarquia de Error Boundaries (4 níveis) |
| **ADR-018** | `docs/architecture/ADR/` | LangChain + Tree of Thoughts — Raciocínio Multi-Caminho |
| **ADR-019** | `docs/architecture/ADR/` | Arquitetura de Cenas: Three.js + Dynamic Loading |
| **ADR-020** | `docs/architecture/ADR/` | Estratégia de Estado Global: 5 Stores Independentes |
| **ADR-021** | `docs/architecture/ADR/` | Roteamento Cognitivo: LangChain + ToT |
| **ADR-022** | `docs/architecture/ADR/` | Modelo de Assinatura: Stripe Checkout + Webhooks |
| **ADR-023** | `docs/architecture/ADR/` | Governança de Documentação |
| **ADR-024** | `docs/architecture/ADR/` | Estratégia de Build: Webpack no WSL |
| **ADR-025** | `docs/architecture/ADR/` | Imersão Cognitiva no Frontend |

> **ADRs são a camada de memória da arquitetura de engenharia.**  
> Cada ADR explica o *porquê* de uma decisão — o raciocínio, as alternativas rejeitadas e as consequências assumidas.

### Arquitetura e Processos

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **ARCHITECTURE_PROTOCOL.md** | `docs/architecture/` | Protocolo de comunicação, regras de ouro, canais |
| **ARCHITECTURE_DECISIONS.md** | `docs/architecture/` | Visão executiva das decisões arquiteturais (mapa para ADRs) |
| **FLOWS.md** | `docs/architecture/` | Fluxos de engenharia (conversa, memória, streaming, auth, erros) |
| **SYSTEM_DIAGRAMS.md** | `docs/architecture/` | Diagramas de sistema (Mermaid: arquitetura, segurança, banco) |
| **STATE_MANAGEMENT.md** | `docs/architecture/` | 5 Zustand stores documentadas |
| **THREEJS_SCENES.md** | `docs/architecture/` | 12 cenas Three.js documentadas |
| **OBSERVABILITY.md** | `docs/architecture/` | Monitoramento: latência, qualidade, cognição, narrativa |
| **COGNITIVE_HEALTH.md** | `docs/architecture/` | Saúde cognitiva: diagnóstico, doenças, prescrições |
| **AUTOMATED_GOVERNANCE.md** | `docs/architecture/` | Governança automatizada: regras auto-aplicáveis |
| **INTELLIGENT_CI.md** | `docs/architecture/` | CI/CD inteligente: 5 gates de validação |
| **COGNITIVE_TESTING.md** | `docs/architecture/` | Testes cognitivos: personalidade, memória, continuidade |
| **NARRATIVE_PROTECTION.md** | `docs/architecture/` | Proteção narrativa: 5 camadas de defesa |
| **AI_AGENT_GOVERNANCE.md** | `docs/architecture/` | Governança de agentes IA: versionamento, estabilidade |
| **COGNITIVE_METRICS.md** | `docs/architecture/` | Métricas cognitivas: 6 dimensões de qualidade |
| **GOVERNANCE_DASHBOARD.md** | `docs/architecture/` | Estratégia de dashboard de governança |
| **META_REFLECTION.md** | `docs/architecture/` | Reflexão honesta sobre o estado do ecossistema |
| **BLIND_SPOTS.md** | `docs/architecture/` | Pontos cegos operacionais mapeados |
| **RELATORIO-MELHORIAS.md** | `docs/architecture/` | Histórico de melhorias (Maio 2026) |

### Operacional

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **CONTRIBUTING.md** | raiz do projeto | Guia de contribuição e onboarding (devs + IAs) |
| **API.md** | `docs/backend/` | Catálogo completo das 34 API routes |

### Segurança

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **SECURITY.md** | `docs/security/` | Fluxo de auth, JWT, middleware, rate limiting, prompt injection, limites de segurança, segurança cognitiva |

### Backend e Infra

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| **DATABASE.md** | `docs/backend/` | Arquitetura TiDB, Drizzle ORM, schema, migrations, query patterns, performance |
| **TESTING_GUIDE.md** | `docs/` | Guia de testes (Jest, Playwright, Madge) |
| **NANO_BANANA_GUIDE.md** | `docs/` | Geração de imagens dos agentes |
| **AULA-VIVA-IMPLEMENTATION-GUIDE.md** | `docs/` | Guia de implementação do flipbook Aula Viva |

### Memória Técnica (Archive)

Documentos históricos preservados em `docs/archive/`:

| Documento | Motivo do arquivamento |
|-----------|----------------------|
| `docs/archive/PROJECT_ANALYSIS.md` | Substituído por versão atualizada |
| `docs/archive/PROJECT_ANALYSIS_UPDATED.md` | Relatório pontual (Maio 2026) — executado e concluído |
| `docs/archive/CORRECOES_ERROS_V2.md` | Correções históricas (Março 2026) — já aplicadas |
| `docs/archive/heatmap-report.md` | Análise datada (Março 2026) |
| `docs/archive/RELATORIO_SESSAO.md` | Registro de sessão histórica (14 Maio 2026) |
| `docs/archive/AGENTS.md` | Duplicado — substituído por CLAUDE.md |
| `docs/archive/VIDEO_SCRIPT.md` | Script criativo de marketing |

---

## 🚨 REGRAS CRÍTICAS (NON-NEGOTIABLE)

1. **ORM:** Drizzle EXCLUSIVAMENTE — nunca Prisma
2. **Auth Cookie:** `mente_ai_token` — nome imutável
3. **Branch ativa:** `feat/lab-redesign` — nunca commitar direto na main
4. **Build:** `npm run build` deve passar SEMPRE — zero erros
5. **TypeScript:** `npm run typecheck` deve passar — zero erros
6. **Stripe:** Chaves em modo teste — NÃO ALTERAR até Fase 6
7. **Idioma:** 100% Português Brasileiro
8. **WSL:** Usar `--webpack` (Turbopack quebra com lockfile cross-platform)

---

## 🏛️ GOVERNANÇA DE ENGENHARIA

### Princípios Fundamentais

1. **Nenhuma arquitetura significativa sem ADR.** Se afeta segurança, performance, ou narrativa — registre em `docs/architecture/ADR/`.

2. **Nenhuma deleção destrutiva de documentação.** Documentos obsoletos vão para `docs/archive/`, não para a lixeira.

3. **Alterações de segurança exigem documentação + 2 revisores.** Ver `docs/security/SECURITY.md` para o checklist completo.

4. **Alterações narrativas devem preservar consistência do universo.** Se um agente ganha uma memória nova, o universo base (`docs/narrative/`) deve refletir.

5. **Sistemas experimentais devem ser rotulados `Experimental`.** No ADR e no código. Não deixe experimentos parecerem canônicos.

6. **Sistemas cognitivos exigem revisão ética.** Memória emocional, perfil psicológico, classificação de toxicidade — cada um tem responsabilidade sobre a mente do usuário.

7. **Uma fonte da verdade por domínio.** `CLAUDE.md` é o arquivo canônico para agentes IA. `AGENTS.md` é apenas um ponteiro de compatibilidade. O Master Index é o índice canônico da documentação.

### Ciclo de Vida de Documentação

```
CRIAR → docs/<dominio>/NOVO_DOC.md
         │
         ▼
ATUALIZAR → Master Index (este arquivo)
         │
         ▼
ENVELHECEU? → SIM → docs/archive/
               NÃO → manter atualizado
```

### Donos de Domínio

| Domínio | Documento Canônico |
|---------|-------------------|
| Arquitetura geral | Master Index |
| Decisões técnicas | ADRs (001-010+) |
| Segurança | `docs/security/SECURITY.md` |
| Banco de dados | `docs/backend/DATABASE.md` |
| Narrativa | `docs/narrative/` |
| Roadmap | `ROADMAP.md` |
| Agentes IA | `CLAUDE.md` |

## 🧠 PRINCÍPIOS DE MEMÓRIA ARQUITETURAL (ADR)

1. **Nunca crie arquitetura significativa sem ADR.** Se afeta segurança, performance, ou narrativa — registre.
2. **Nunca delete um ADR.** Decisões deprecated permanecem documentadas como contexto histórico.
3. **Sistemas experimentais devem ser marcados `Experimental`.** Não deixe código experimental parecer canônico.
4. **Decisões narrativas também exigem ADRs.** Arquitetura cognitiva é tão importante quanto arquitetura de software.
5. **Decisões de segurança exigem ADR obrigatório.** Sem exceções.
6. **Um ADR por decisão.** Não agrupe decisões não relacionadas.

## 🛠️ GOVERNANÇA OPERACIONAL

1. **Nenhuma API route sem documentação.** Toda rota nova deve ser registrada em `docs/backend/API.md`.
2. **Nenhuma mudança de arquitetura sem ADR.** Se afeta segurança, performance, ou narrativa — registre.
3. **Nenhuma camada cognitiva sem revisão ética.** Memória, perfil, relacionamento — cada sistema lida com a mente do usuário.
4. **Nenhuma contradição narrativa sem revisão.** Alterações em agentes, conflitos ou lore precisam de validação cruzada com `docs/narrative/`.
5. **Nenhuma feature de segurança sem atualizar `docs/security/SECURITY.md`.**
6. **Nenhum breaking change sem documentação de migração.** Se quebra algo existente, explique como migrar.

---

## 🔗 REFERÊNCIAS CRUZADAS

### Para Desenvolvedores

- **Entry point:** `README.md` (raiz)
- **Guia do agente IA:** `CLAUDE.md` (raiz)
- **Skill canônica:** `mente-ai-development` (carregar antes de qualquer alteração)

### Para Arquitetos

- Decisões de arquitetura → `docs/architecture/ADR/` (10 ADRs canônicos)
- Template ADR → `docs/architecture/ARCHITECTURE_DECISIONS.md`
- Protocolo de mudanças → `docs/architecture/ARCHITECTURE_PROTOCOL.md`
- Histórico de melhorias → `docs/architecture/RELATORIO-MELHORIAS.md`
- Índice do sistema ADR → `docs/architecture/ADR/README.md`

### Para Narrativa

- Base do universo → `docs/narrative/AI_KIDS_FLIX_UNIVERSE_BASE.md`
- Guardião de conteúdo → `docs/narrative/universe-guardian.prompt.md`

### Para Segurança

- Documento completo → `docs/security/SECURITY.md`
- Fluxo de autenticação, middleware JWT, rate limiting, prompt injection
- Segurança cognitiva + regras de segurança emocional

### Para Backend

- Banco de dados → `docs/backend/DATABASE.md`
- Schema completo, queries, migrations, performance
- Planos futuros: embeddings e busca vetorial

---

## 📊 DÉBITO TÉCNICO CONHECIDO

| Item | Severidade | Status |
|------|-----------|--------|
| 48 npm vulnerabilities aninhadas (Next.js 16) | 🟠 HIGH | Deferido — requer upgrade Next.js 17 |
| TypeScript errors pré-existentes (Link className) | 🟡 MEDIUM | Build passa, typecheck falha |
| Stripe em modo teste | 🟡 MEDIUM | Planejado para Fase 6 |
| Chaves ElevenLabs pendentes (12 voice IDs) | 🟡 MEDIUM | Aguardando configuração |
| Conteúdo de vídeo dos episódios | 🟡 MEDIUM | Aguardando produção |

---

## 🗺️ ESTRUTURA COMPLETA DE DOCUMENTAÇÃO

```
AI-KIDS-OFICIAL/
│
├── README.md                          ← Entry point do projeto
├── CONTRIBUTING.md                    ← Onboarding (devs + IAs)
├── CLAUDE.md                          ← Sistema operacional para agentes IA
├── AGENTS.md                          ← Ponteiro de compatibilidade → CLAUDE.md
├── ROADMAP.md                         ← Roadmap de desenvolvimento
├── MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md  ← ESTE DOCUMENTO
│
├── docs/
│   ├── TESTING_GUIDE.md               ← Guia de testes
│   ├── NANO_BANANA_GUIDE.md           ← Geração de imagens
│   ├── AULA-VIVA-IMPLEMENTATION-GUIDE.md ← Guia Aula Viva
│   │
│   ├── architecture/
│   │   ├── ARCHITECTURE_PROTOCOL.md   ← Protocolo de comunicação
│   │   ├── ARCHITECTURE_DECISIONS.md   ← Visão executiva das decisões
│   │   ├── FLOWS.md                   ← Fluxos de engenharia (9 fluxos)
│   │   ├── SYSTEM_DIAGRAMS.md         ← Diagramas Mermaid (8 diagramas)
│   │   ├── RELATORIO-MELHORIAS.md     ← Histórico de melhorias
│   │   ├── reports/                   ← Relatórios gerados (Madge JSONs)
│   │   └── ADR/
│   │       ├── README.md              ← Sistema ADR (índice + como criar)
│   │       ├── ADR-001 a ADR-017      ← 17 ADRs canônicos
│   │
│   ├── narrative/
│   │   ├── AI_KIDS_FLIX_UNIVERSE_BASE.md ← Base do universo
│   │   └── universe-guardian.prompt.md   ← Validação de conteúdo
│   │
│   ├── security/
│   │   └── SECURITY.md                ← Segurança completa (auth, middleware, prompt injection)
│   │
│   ├── backend/
│   │   ├── DATABASE.md                ← Banco de dados (TiDB, Drizzle, schema, queries)
│   │   └── API.md                     ← Catálogo de APIs (34 endpoints)
│   │
│   └── archive/
│       ├── PROJECT_ANALYSIS.md         ← Análise histórica (Maio 2026)
│       ├── PROJECT_ANALYSIS_UPDATED.md ← Análise atualizada (Maio 2026)
│       ├── CORRECOES_ERROS_V2.md       ← Correções históricas (Mar 2026)
│       ├── heatmap-report.md           ← Heatmap arquitetural (Mar 2026)
│       ├── RELATORIO_SESSAO.md         ← Sessão histórica (14 Maio 2026)
│       ├── AGENTS.md                   ← Duplicado do CLAUDE.md
│       └── VIDEO_SCRIPT.md             ← Roteiro de vídeo
│
└── universe-core/                      ← (mantido como referência)
    └── (arquivos migrados para docs/narrative/)
```

---

## 🔄 CICLO DE VIDA DA DOCUMENTAÇÃO

1. **Novos documentos** → criados em `docs/` na subpasta temática correta
2. **Documentos obsoletos** → movidos para `docs/archive/` (NUNCA deletados)
3. **Atualizações** → este Master Index deve ser atualizado para refletir novas adições
4. **Decisões arquiteturais** → registradas em `docs/architecture/ARCHITECTURE_DECISIONS.md`

---

> **"Mentes são formadas, não formatadas."**  
> *— MENTE.AI, 2026*
