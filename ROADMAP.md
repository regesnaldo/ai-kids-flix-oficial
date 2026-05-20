# 🚀 MENTE.AI — ROADMAP DE DESENVOLVIMENTO

**Versão:** 2.0  
**Última Atualização:** Maio 2026  
**Status:** Beta em Produção  
**URL:** https://mente-ai.vercel.app  
**Branch ativa:** `feat/lab-redesign`

---

## 🎯 VISÃO GERAL

**MENTE.AI** é um metaverso educacional de Inteligência Artificial que transforma conceitos abstratos em agentes com personalidade cinematográfica, narrativa imersiva e progressão emocional.

---

## 📊 ARQUITETURA DE AGENTES

```
                           ┌─────────────────────────┐
                           │  NEXUS "O Conector"      │
                           │  (Orquestrador Central)   │
                           └────────────┬────────────┘
                                        │
        ┌───────────┬───────────┬───────┼───────┬───────────┬───────────┐
        ▼           ▼           ▼       │       ▼           ▼           ▼
    ┌──────┐   ┌──────┐   ┌──────┐     │   ┌──────┐   ┌──────┐   ┌──────┐
    │ VOLT │   │KAOS  │   │LYRA  │     │   │ETHOS │   │AXIOM │   │JANUS │
    └──────┘   └──────┘   └──────┘     │   └──────┘   └──────┘   └──────┘
                                        │
    ┌──────┐   ┌──────┐   ┌──────┐     │   ┌──────┐   ┌──────┐
    │AURORA│   │CIPHER│   │TERRA │     │   │PRISM │   │STRATOS│
    └──────┘   └──────┘   └──────┘     │   └──────┘   └──────┘
                                        │
    12 agentes canônicos + 108 agentes gerados = 120 agentes
```

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### 🟢 FUNDAÇÃO (Concluído)

| Sistema | Status | Detalhes |
|---------|--------|----------|
| Next.js App Router (16.2.6) | ✅ Produção | 56+ páginas, 30+ API routes |
| Drizzle ORM + TiDB Cloud | ✅ Produção | Lazy pool, 18 tabelas, migrations |
| JWT Auth (`jose` + cookie `mente_ai_token`) | ✅ Produção | Middleware com validação criptográfica |
| 12 agentes canônicos | ✅ Produção | Personalidade, conflitos, cenas 3D |
| Engine narrativo | ✅ Produção | Profiler, router, backtrack, phase-router |
| Streaming SSE | ✅ Produção | ReadableStream + AbortController |
| Netflix-style UI | ✅ Produção | Home cinematográfica, carrosséis, player |
| 12 páginas de universo | ✅ Produção | Cenas Three.js com lazy loading |
| 100 episódios (S01-S10) | ✅ Produção | Conteúdo narrativo canônico |
| CI/CD GitHub Actions | ✅ Produção | Lint → Build → Deploy Vercel |
| SEO base | ✅ Produção | sitemap.xml + robots.txt |

### 🟢 COGNIÇÃO (Concluído)

| Sistema | Status | Detalhes |
|---------|--------|----------|
| 5-layer memory system | ✅ Produção | Identity → Semantic → Consolidator → Context Priority → Recall |
| Semantic TF-IDF retrieval | ✅ Produção | Similaridade cosseno, custo zero |
| Context Priority Engine | ✅ Produção | Classificação de 5 níveis, injeção seletiva |
| Relationship state engine | ✅ Produção | 5 níveis: Stranger → Acquaintance → Companion → Confidant → Mentor |
| Meta-cognitive reflection | ✅ Produção | Auto-avaliação pós-resposta em 3 dimensões |
| Anti-noise memory filters | ✅ Produção | Ignora saudações, mensagens < 20 chars |
| Fire-and-forget storage | ✅ Produção | Assíncrono, não bloqueia resposta do chat |

### 🟢 RESILIÊNCIA (Concluído)

| Sistema | Status | Detalhes |
|---------|--------|----------|
| 4-layer error boundaries | ✅ Produção | global → root → main → conta |
| 6 loading states | ✅ Produção | Contextuais, tema escuro, spinner dual-ring |
| Hydration safety | ✅ Produção | safe-client.ts + useHydrated hook |
| Dynamic scene loader | ✅ Produção | 12 cenas Three.js, ~500KB removidos do bundle inicial |
| Rate limiter | ✅ Produção | Pluggable, por rota, janela deslizante |
| Logger estruturado | ✅ Produção | Níveis, transporte Sentry em produção |

### 🟢 DOCUMENTAÇÃO (Concluído)

| Documento | Status | Detalhes |
|-----------|--------|----------|
| Master Index | ✅ | Fonte única da verdade |
| 10 ADRs canônicos | ✅ | Memória arquitetural completa |
| Security doc | ✅ | Auth, middleware, prompt injection, segurança cognitiva |
| Database doc | ✅ | Schema, queries, migrations, performance |
| Architecture decisions overview | ✅ | Visão executiva com links para ADRs |

---

## 🟡 EM ANDAMENTO (Parcialmente Implementado)

| Sistema | Progresso | Pendente |
|---------|-----------|----------|
| Sistema de avatares 3D | 80% | Visual refinement, animações |
| ShareCard | 90% | Integração com redes sociais |
| Gamificação (XP, streaks, badges) | 60% | Sistema de ranking, achievements visuais |
| Lab de Inteligência Viva | 70% | Transformer demo, AI battles |
| ElevenLabs vozes por agente | 40% | 12 voice IDs únicos pendentes |
| Stripe (pagamentos) | 30% | Em modo teste — chaves live pendentes |

---

## 🔴 PRÓXIMAS ENTREGAS (Planejado)

### Fase Atual: ESTABILIZAÇÃO (Maio-Junho 2026)

| Tarefa | Prioridade | Estimativa |
|--------|-----------|------------|
| 12 bugs documentados (CRIT-01..04, FUNC-01..04, VIS-01..04, INFRA-01..04) | 🔴 CRÍTICA | 2 semanas |
| Build verde no Vercel — zero erros | 🔴 CRÍTICA | 1 semana |
| TypeScript strict — zero erros (`npm run typecheck`) | 🟠 ALTA | 1 semana |
| npm audit fix (48 vulnerabilidades) | 🟠 ALTA | 1 dia |
| Testes de integração (auth + chat + universo) | 🟡 MÉDIA | 2 semanas |

### Fase: EXPERIÊNCIA (Julho-Agosto 2026)

| Tarefa | Prioridade | Estimativa |
|--------|-----------|------------|
| 12 vozes ElevenLabs (1 por agente) | 🟠 ALTA | 1 semana |
| Stripe chaves live (Fase 6) | 🟠 ALTA | 1 dia |
| Conteúdo de vídeo dos episódios | 🟡 MÉDIA | 4 semanas |
| Sistema de ranking + leaderboard | 🟡 MÉDIA | 2 semanas |
| Lab 2.0: Transformer demo, AI battles | 🟡 MÉDIA | 3 semanas |

### Fase: ESCALA (Setembro-Novembro 2026)

| Tarefa | Prioridade | Estimativa |
|--------|-----------|------------|
| Embeddings (substituir TF-IDF) | 🟡 MÉDIA | 3 semanas |
| Refresh token com rotação | 🟡 MÉDIA | 1 semana |
| OAuth2 (Google/GitHub login) | 🟢 BAIXA | 2 semanas |
| Offline-first / PWA | 🟢 BAIXA | 4 semanas |
| Multi-tenant para escolas | 🟢 BAIXA | 6 semanas |

---

## 🔐 VARIÁVEIS DE AMBIENTE (Vercel)

| Variável | Status | Notas |
|----------|--------|-------|
| `JWT_SECRET` | ✅ Configurado | |
| `DATABASE_URL` | ✅ Configurado | TiDB Cloud |
| `STRIPE_SECRET_KEY` | ⚠️ Modo teste | Aguardando chaves live |
| `STRIPE_PUBLISHABLE_KEY` | ⚠️ Modo teste | Aguardando chaves live |
| `ANTHROPIC_API_KEY` | ✅ Configurado | |
| `OPENAI_API_KEY` | ✅ Configurado | |
| `ELEVENLABS_API_KEY` | ✅ Configurado | Voice IDs pendentes |

---

## 📈 MÉTRICAS ATUAIS (Maio 2026)

| Métrica | Valor | Meta |
|---------|-------|------|
| Build time | ~52s | < 60s |
| TypeScript errors | ~5 (pré-existentes) | 0 |
| npm vulnerabilities | 48 (aninhadas) | 0 |
| API routes | 30+ | 30+ |
| Agentes canônicos | 12 | 12 |
| Episódios | 100 | 100 |
| Cobertura de testes | Baixa | > 60% |

---

## 🗺️ DÉBITO TÉCNICO

| Item | Severidade | Plano |
|------|-----------|-------|
| 48 npm vulns (Next.js 16) | 🟠 HIGH | Upgrade Next.js 17 quando estável |
| TypeScript errors (Link className) | 🟡 MEDIUM | Correção na Fase de Estabilização |
| Cobertura de testes | 🟡 MEDIUM | Expandir na Fase Experiência |
| Embeddings vs TF-IDF | 🟡 MEDIUM | Migrar na Fase Escala |
| Stripe em modo teste | 🟡 MEDIUM | Chaves live na Fase Experiência |

---

## 🚀 DEPLOY

```bash
npm run typecheck
npm run build
vercel --prod --yes
```

**Produção:** https://mente-ai.vercel.app  
**Região:** gru1 (São Paulo)  
**Branch:** `feat/lab-redesign`

---

> *"Mentes são formadas, não formatadas."*  
> *— MENTE.AI, 2026*
