# 🛡️ CI/CD Inteligente — MENTE.AI

> **O guardião da civilização cognitiva.**  
> CI que valida não apenas código — mas arquitetura, narrativa e memória.

---

## 🧠 FILOSOFIA

CI tradicional valida sintaxe (lint), tipos (tsc) e build. Isso funciona para apps CRUD. Para uma civilização cognitiva, o CI precisa validar também:

- Se a documentação está íntegra (links não quebram)
- Se decisões arquiteturais estão registradas (ADR)
- Se a narrativa permanece consistente
- Se a segurança não foi comprometida

**Analogia:** O CI tradicional é um inspetor de obras que verifica se os tijolos estão retos. O CI inteligente é um guardião que verifica se a cidade ainda faz sentido como cidade.

---

## 🏗️ ARQUITETURA DO CI

```
Push na branch
      │
      ▼
┌─────────────────────────────────────────┐
│           GITHUB ACTIONS                  │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ 1. TECHNICAL GATES              │    │
│  │    • ESLint (zero errors)       │    │
│  │    • tsc --noEmit (zero errors) │    │
│  │    • next build (sucesso)       │    │
│  │    • Jest (testes passam)       │    │
│  └─────────────┬───────────────────┘    │
│                │                         │
│  ┌─────────────▼───────────────────┐    │
│  │ 2. DOCUMENTATION GATES          │    │
│  │    • validate-docs.py (links)   │    │
│  │    • orphan detection (alertas) │    │
│  │    • ADR check (arquitetura)    │    │
│  └─────────────┬───────────────────┘    │
│                │                         │
│  ┌─────────────▼───────────────────┐    │
│  │ 3. ARCHITECTURE GATES           │    │
│  │    • ADR required? (novos files │    │
│  │      em src/lib/, src/engine/)  │    │
│  │    • API docs updated?          │    │
│  │    • Security review needed?    │    │
│  └─────────────┬───────────────────┘    │
│                │                         │
│  ┌─────────────▼───────────────────┐    │
│  │ 4. NARRATIVE GATES              │    │
│  │    • Agent canon consistency     │    │
│  │    • Universe base unchanged     │    │
│  │    • Narrative conflicts intact  │    │
│  └─────────────┬───────────────────┘    │
│                │                         │
│  ┌─────────────▼───────────────────┐    │
│  │ 5. DEPLOY GATE                  │    │
│  │    • Vercel preview deploy      │    │
│  │    • Smoke tests                │    │
│  │    • Health check               │    │
│  └─────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🔍 VALIDAÇÕES ESPECÍFICAS

### Gate 1: Técnico (existente, reforçado)
- ESLint configurado para zero warnings
- TypeScript strict mode
- Build com webpack

### Gate 2: Documentação (NOVO)
- `scripts/validate-docs.py` — 0 links quebrados
- Orphan detection — alerta para .md não referenciado no Master Index
- ADR index atualizado (se ADR novo foi criado)

### Gate 3: Arquitetura (NOVO)
- Detecta arquivos modificados em `src/lib/`, `src/engine/`, `middleware.ts`
- Se modificados → verifica se ADR foi criado no mesmo PR
- Se `src/app/api/` modificado → verifica `docs/backend/API.md`

### Gate 4: Narrativa (NOVO)
- Detecta modificações em `src/canon/agents/`
- Se modificado → verifica consistência de nomes, cores, dimensões dos 12 canônicos
- Alerta se agentes canônicos são removidos ou renomeados

### Gate 5: Deploy (existente)
- Vercel preview deploy automático
- URL única por PR para teste visual
- Health check `GET /api/health/system` após deploy

---

## 🚨 POLÍTICA DE BLOQUEIO

| Gate | Bloqueia merge? | Mensagem |
|------|----------------|----------|
| Técnico (lint/tsc/build) | ✅ Sim | "Build falhou. Corrija os erros acima." |
| Documentação (links) | ✅ Sim | "Links quebrados encontrados. Execute validate-docs.py." |
| Documentação (órfãos) | ⚠️ Warning | "Novo doc não está no Master Index. Adicione ou use tag [doc-pending-index]." |
| Arquitetura (ADR) | ✅ Sim | "Mudança arquitetural detectada sem ADR. Crie ADR ou use --skip-adr." |
| Arquitetura (API docs) | ⚠️ Warning | "API modificada. Atualize docs/backend/API.md." |
| Narrativa (canon) | ⚠️ Warning | "Agentes canônicos modificados. Valide contra universe-base." |
| Segurança | ✅ Sim | "Arquivo de segurança modificado. Requer revisão de security owner." |

---

> *"CI não é sobre punir desenvolvedores — é sobre proteger a civilização de si mesma."*
