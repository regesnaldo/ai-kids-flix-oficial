# ADR — Architecture Decision Records

> "ADRs são como a caixa-preta de um avião. Elas preservam o porquê das decisões importantes — mesmo quando todos os engenheiros originais já se foram."

## O que é um ADR?

Um **Architecture Decision Record** (Registro de Decisão Arquitetural) é um documento curto que explica **por que** uma decisão técnica importante foi tomada.

Não é documentação de código. Não é tutorial. Não é spec.

É **memória de engenharia**.

Exemplo: se daqui a 2 anos alguém perguntar *"por que o MENTE.AI usa Drizzle e não Prisma?"*, a resposta estará em `ADR-001-drizzle-vs-prisma.md`.

## Por que ADRs existem?

| Problema que resolve | Sem ADR | Com ADR |
|---------------------|---------|---------|
| Rotatividade de devs | Ninguém sabe por que X foi escolhido | Decisão documentada, contexto preservado |
| Dívida técnica invisível | "Sempre foi assim" vira justificativa | Cada tradeoff está explícito |
| Refatoração cega | Quebra algo sem saber que existia um motivo | Consequências documentadas |
| Onboarding lento | Novo dev descobre arquitetura por tentativa e erro | ADRs contam a história da arquitetura |

## Como criar um ADR novo

1. Copie o template abaixo
2. Preencha com a decisão REAL que foi tomada
3. Seja honesto sobre alternativas consideradas e tradeoffs
4. Salve em `docs/architecture/ADR/ADR-NNN-nome-curto.md`
5. Atualize o Master Index (`MENTE_AI_COGNITIVE_ARCHITECTURE_MASTER_INDEX.md`)

### Template

```markdown
# ADR-NNN: Título

## Status
[Proposed | Accepted | Deprecated | Experimental]

## Contexto
Qual era o problema? O que motivou a decisão?

## Decisão
O que foi escolhido?

## Por quê?
Por que este caminho foi selecionado? (3-5 razões)

## Alternativas Consideradas
- **Alternativa A** — rejeitada porque...
- **Alternativa B** — rejeitada porque...

## Consequências
### Positivas
- ...
### Negativas
- ...
### Riscos
- ...

## Evolução Futura
Como esta decisão pode evoluir?
```

## Regras de nomenclatura

```
ADR-NNN-nome-curto.md
│   │   │
│   │   └── Nome descritivo em ingles, lowercase, com hifens
│   └────── Número sequencial (001, 002, 003...)
└────────── Prefixo fixo: ADR
```

Exemplos:
- `ADR-001-drizzle-vs-prisma.md`
- `ADR-004-five-layer-memory-system.md`
- `ADR-009-streaming-architecture.md`

## Ciclo de vida

```
Proposed ──→ Accepted ──→ (em uso)
    │              │
    │              └──→ Deprecated ──→ (mantido como histórico)
    │
    └──→ Experimental ──→ Accepted ou Deprecated
```

- **Proposed:** Ainda em discussão, não implementado
- **Accepted:** Decisão ativa, código segue este padrão
- **Experimental:** Em teste, pode mudar
- **Deprecated:** Substituído por decisão mais nova — NUNCA deletado

## Princípios de memória arquitetural

1. **NUNCA delete um ADR.** Decisões passadas explicam o presente.
2. **ADR não é documentação de código.** É documentação de raciocínio.
3. **Seja honesto sobre tradeoffs.** Toda decisão tem lado negativo — documente-o.
4. **Decisões narrativas também merecem ADRs.** Arquitetura cognitiva é tão importante quanto arquitetura de software.
5. **Decisões de segurança exigem ADR obrigatório.**
6. **Sistemas experimentais devem ser marcados como Experimental.**
7. **Um ADR por decisão.** Não agrupe decisões não relacionadas.
8. **ADR é para humanos e IAs.** Escreva com clareza, use analogias, evite corporativês.

## Índice de ADRs

| ADR | Título | Status |
|-----|--------|--------|
| [001](ADR-001-drizzle-vs-prisma.md) | Escolha do ORM: Drizzle vs Prisma | Accepted |
| [002](ADR-002-tidb-architecture.md) | Arquitetura de Banco: TiDB Cloud | Accepted |
| [003](ADR-003-jwt-auth-strategy.md) | Estratégia de Autenticação: JWT + Cookies | Accepted |
| [004](ADR-004-five-layer-memory-system.md) | Sistema de Memória em 5 Camadas | Accepted |
| [005](ADR-005-semantic-tfidf-retrieval.md) | Recuperação Semântica: TF-IDF | Accepted |
| [006](ADR-006-context-priority-engine.md) | Motor de Prioridade de Contexto | Accepted |
| [007](ADR-007-relationship-state-engine.md) | Motor de Estado de Relacionamento | Accepted |
| [008](ADR-008-meta-cognitive-reflection.md) | Reflexão Meta-Cognitiva | Accepted |
| [009](ADR-009-streaming-architecture.md) | Arquitetura de Streaming | Accepted |
| [010](ADR-010-narrative-first-philosophy.md) | Filosofia Narrative-First | Accepted |
| [011](ADR-011-nextjs-app-router.md) | Escolha do Framework: Next.js App Router | Accepted |
| [012](ADR-012-zustand-state-management.md) | Gerenciamento de Estado: Zustand | Accepted |
| [013](ADR-013-tailwind-css-strategy.md) | Estratégia de Estilização: Tailwind CSS 4 | Accepted |
| [014](ADR-014-vercel-deploy-platform.md) | Plataforma de Deploy: Vercel (gru1) | Accepted |
| [015](ADR-015-lazy-db-pool-pattern.md) | Padrão de Pool: Lazy Singleton com Proxy | Accepted |
| [016](ADR-016-elevenlabs-voice-strategy.md) | Estratégia de Voz: ElevenLabs + Fallback | Accepted |
| [017](ADR-017-error-boundary-hierarchy.md) | Hierarquia de Error Boundaries (4 níveis) | Accepted |
| [018](ADR-018-langchain-tree-of-thoughts.md) | LangChain + Tree of Thoughts — Raciocínio Multi-Caminho | Accepted |
| [019](ADR-019-threejs-scene-architecture.md) | Arquitetura de Cenas: Three.js + Dynamic Loading | Accepted |
| [020](ADR-020-zustand-global-state.md) | Estratégia de Estado Global: 5 Stores Independentes | Accepted |
| [021](ADR-021-langchain-cognitive-routing.md) | Roteamento Cognitivo: LangChain + ToT | Accepted |
| [022](ADR-022-stripe-subscription-model.md) | Modelo de Assinatura: Stripe Checkout + Webhooks | Accepted |
| [023](ADR-023-documentation-governance.md) | Governança de Documentação: Master Index como Fonte Única | Accepted |
| [024](ADR-024-webpack-wsl-build-strategy.md) | Estratégia de Build: Webpack no WSL | Accepted |
| [025](ADR-025-frontend-cognitive-immersion.md) | Imersão Cognitiva no Frontend | Accepted |

---

*"A arquitetura que você não documenta é a arquitetura que você está condenado a repetir."*
