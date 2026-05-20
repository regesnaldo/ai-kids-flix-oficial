# 📓 Arquitetura de Decisões — MENTE.AI

> **Visão executiva consolidada.**  
> Para o registro detalhado de cada decisão (contexto completo, alternativas rejeitadas, tradeoffs), consulte os [ADRs canônicos](ADR/README.md).

---

## 🗺️ MAPA DE DECISÕES ARQUITETURAIS

Cada decisão listada abaixo foi documentada como ADR (Architecture Decision Record). Este documento serve como índice executivo — o "Google Maps" da arquitetura. Os ADRs são o "Street View".

| # | Decisão | Status | ADR |
|---|---------|--------|-----|
| 1 | Drizzle ORM como ORM exclusivo (NUNCA Prisma) | ✅ Accepted | [ADR-001](ADR/ADR-001-drizzle-vs-prisma.md) |
| 2 | TiDB Cloud como banco serverless MySQL-compatível | ✅ Accepted | [ADR-002](ADR/ADR-002-tidb-architecture.md) |
| 3 | JWT + cookie `mente_ai_token` como estratégia de auth | ✅ Accepted | [ADR-003](ADR/ADR-003-jwt-auth-strategy.md) |
| 4 | Sistema de memória cognitiva em 5 camadas | ✅ Accepted | [ADR-004](ADR/ADR-004-five-layer-memory-system.md) |
| 5 | TF-IDF como mecanismo primário de recuperação semântica | ✅ Accepted | [ADR-005](ADR/ADR-005-semantic-tfidf-retrieval.md) |
| 6 | Context Priority Engine para injeção seletiva de contexto | ✅ Accepted | [ADR-006](ADR/ADR-006-context-priority-engine.md) |
| 7 | Motor de estado de relacionamento em 5 níveis | ✅ Accepted | [ADR-007](ADR/ADR-007-relationship-state-engine.md) |
| 8 | Sistema de reflexão meta-cognitiva pós-resposta | ✅ Accepted | [ADR-008](ADR/ADR-008-meta-cognitive-reflection.md) |
| 9 | Streaming SSE com ReadableStream + AbortController | ✅ Accepted | [ADR-009](ADR/ADR-009-streaming-architecture.md) |
| 10 | Filosofia Narrative-First como princípio fundador | ✅ Accepted | [ADR-010](ADR/ADR-010-narrative-first-philosophy.md) |

---

## 🧬 DECISÃO ZERO: NARRATIVE-FIRST

Antes de qualquer decisão técnica, existe a **Decisão Zero**: o MENTE.AI é um metaverso narrativo, não uma plataforma de cursos.

Isso significa que:
- Features existem para servir a história, não o contrário
- Agentes têm personalidade, conflitos e arcos — não são "chatbots temáticos"
- Performance importa porque ninguém espera 5 segundos no meio de uma cena dramática
- Segurança importa porque crianças e adolescentes confiam nos agentes

**Toda decisão arquitetural subsequente deriva desta.**

---

## 🏗️ PILARES ARQUITETURAIS

### Pilar 1: Serverless-First

Toda a arquitetura assume ambiente serverless (Vercel). Isso moldou decisões críticas:

| Decisão | Motivo serverless |
|---------|-------------------|
| Drizzle (não Prisma) | Bundle 10x menor → cold starts mais rápidos |
| JWT (não sessions) | Stateless → sem query de sessão a cada request |
| Lazy DB pool | Pool só criado quando necessário → economia de conexões |
| SSE streaming | Nativo HTTP, funciona em qualquer CDN/proxy |

### Pilar 2: Cognitive-Native

O produto não "usa IA" — ele é construído COMO uma arquitetura cognitiva:

| Camada | Função | Status |
|--------|--------|--------|
| Identity Profiler | 3 dimensões → 6 arquétipos | ✅ Produção |
| Semantic Memory | TF-IDF + similaridade cosseno | ✅ Produção |
| Memory Consolidator | Decaimento temporal, coalescência | ✅ Produção |
| Context Priority Engine | Classificação de 5 níveis para injeção | ✅ Produção |
| Recall Moments | Gatilhos emocionais para resgate de memória | ✅ Produção |
| Meta-Cognition | Auto-avaliação pós-resposta | ✅ Produção |
| Relationship State | 5 níveis de relacionamento (Stranger→Mentor) | ✅ Produção |

### Pilar 3: Resilience-by-Default

4 níveis de Error Boundary + 6 loading states + hydration safety:

```
global-error → error → (main)/error → (main)/conta/error
     ↑            ↑          ↑                ↑
  último      segmento    grupo de        específico
  recurso      raiz       rotas           de seção
```

---

## 🔐 DECISÕES DE SEGURANÇA

| Decisão | Impacto |
|---------|---------|
| Cookie `mente_ai_token` HttpOnly | Imune a XSS |
| JWT validado criptograficamente no middleware | Não apenas "existe cookie?", mas "o cookie é válido?" |
| Rate limiter pluggable | Proteção por rota, configurável |
| Logger estruturado com transporte Sentry | Visibilidade de produção sem vazar dados |
| Prompt injection protection | Sanitização de input do usuário antes do system prompt |

---

## 🔮 DECISÕES FUTURAS (já mapeadas, aguardando ADR)

| Decisão | Quando | Impacto |
|---------|--------|---------|
| Trocar TF-IDF por embeddings | Quando volume > 10k usuários | Precisão semântica +15%, custo +$0.02/1M tokens |
| Refresh token com rotação | Quando sessão > 7 dias for necessária | Segurança +, complexidade + |
| OAuth2 (Google/GitHub) | Quando usuários pedirem social login | Conversão +, vendor lock-in do provider |
| Offline-first com PWA | Quando mobile for prioridade | Acesso sem internet, complexidade de cache |
| Multi-tenant para escolas | Se pivotar para B2B | Isolamento de dados, billing por instituição |

---

## 📋 REGRAS DE GOVERNANÇA

1. **Nova arquitetura significativa → ADR obrigatório.** Sem exceção.
2. **ADR nunca é deletado.** Deprecated fica documentado como história.
3. **Alteração de segurança → ADR + validação de 2 revisores.**
4. **Sistema experimental → marcado `Experimental` no ADR e no código.**
5. **Decisão narrativa → ADR.** Arquitetura cognitiva é tão importante quanto software.

---

> *"A arquitetura que você não documenta é a arquitetura que você está condenado a repetir — ou pior, a esquecer que existiu."*
