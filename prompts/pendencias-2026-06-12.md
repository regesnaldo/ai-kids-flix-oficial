# 🎯 PROMPT COMPLETO — MENTE.AI PENDÊNCIAS
# Data: 2026-06-12
# Status: Aguardando execução

---

## Prioridade 1 — 🔧 Fix ESLint (IMPACT: BUILD BLOCKER)

**Problema:** ESLint v10 não tem arquivo de configuração (`eslint.config.*` ausente).
`npm run lint` não funciona.

**Ação:**
1. Criar `eslint.config.mjs` com flat config para Next.js + TypeScript
2. Verificar compatibilidade `eslint-plugin-react-hooks` v5.2.0 com ESLint v10
3. Rodar `npm run lint` e corrigir erros

**Arquivos:** `eslint.config.mjs` (novo)

---

## Prioridade 2 — 🧪 Corrigir Testes Quebrados (IMPACT: 21 FAILS)

### 2a — uuid ESM crash (2 suites crasham)

**Problema:** `uuid` v11+ é ESM-only. `ts-jest` não transforma `.js` → SyntaxError.

**Arquivos afetados:**
- `src/lib/nexus/__tests__/nexus.test.ts`
- `src/lib/experience/tests/experience.test.ts`

**Fix:** Adicionar `babel-jest` no `jest.config.ts` para transformar `.js` de node_modules ESM.

### 2b — DB não mockado (3 suites falham)

**Arquivos afetados:**
- `src/lib/universe/__tests__/context-compressor.test.ts` (3 fails)
- `src/lib/universe/__tests__/progression-engine.test.ts` (16 fails)
- `src/__tests__/cognitive/agent-identity.test.ts` (1 fail, prompt injection)

**Ação:** Mockar dependências de banco de dados nos testes.

---

## Prioridade 3 — 📦 Atualizar Dependências (IMPACT: SECURITY + COMPAT)

### Major updates (breaking changes):

| Pacote | Atual | Latest | Risco |
|--------|-------|--------|-------|
| `eslint-plugin-react-hooks` | 5.2.0 | **7.1.1** | 🚨 +2 major |
| `typescript` | 5.9.3 | **6.0.3** | 🚨 +1 major |
| `openai` | 4.104.0 | **6.42.0** | 🚨 +2 major |
| `stripe` | 20.4.1 | **22.2.0** | 🚨 +2 major |
| `framer-motion` | 11.18.2 | **12.40.0** | 🚨 +1 major |
| `lucide-react` | 0.574.0 | **1.17.0** | 🚨 +1 major |
| `shadcn` | 3.8.5 | **4.11.0** | 🚨 +1 major |
| `bcryptjs` | 2.4.3 | **3.0.3** | 🚨 +1 major |

### Vulnerabilidades (npm audit):

| Pacote | Severidade | Fix |
|--------|-----------|-----|
| `esbuild` ≤0.24.2 | Moderate | `npm audit fix --force` (cuidado: breaking no drizzle-kit) |
| `postcss` <8.5.10 | Moderate | `npm audit fix --force` (cuidado: breaking no next) |
| `uuid` <11.1.1 | Moderate | `npm audit fix` |

---

## Prioridade 4 — 🏗️ CI/CD + Husky + Dependabot

### 4a — Husky + lint-staged

**Ação:** Configurar pre-commit hooks para:
- ESLint nos arquivos staged
- TypeScript type check
- Testes unitários dos arquivos alterados

### 4b — Dependabot / Renovate

**Ação:** Configurar Dependabot (GitHub) ou Renovate para PRs automáticos de atualização de dependências.

**Arquivos:** `.github/dependabot.yml` (novo)

### 4c — GitHub Actions CI

**Ação:** Pipeline de CI que roda:
- `npm ci`
- `npm run lint`
- `npm run typecheck` (ou `tsc --noEmit`)
- `npm test`
- `npm run build`

**Arquivos:** `.github/workflows/ci.yml` (novo)

---

## Prioridade 5 — 🧹 Limpeza e Housekeeping

### 5a — .gitignore

Adicionar:
```
*.log
image.png
```

### 5b — Branches stale

Limpar branches locais e remotos sem commits há +30 dias:
- `feat/lab-redesign`
- `opencode/misty-island`
- `opencode/playful-engine`
- `backup/pre-design-netflix`
- `backup-recuperacao`

### 5c — README.md

Atualizar instruções de setup:
- Corrigir `npm install mente-ai-platform`
- Adicionar guia de variáveis `.env`
- Documentar comandos de desenvolvimento

---

## Referências

- Relatório completo: `docs/health-audit-2026-06-11.md`
- Stack spec: `docs/stack-spec.md`
- CLAUDE.md: `CLAUDE.md`
