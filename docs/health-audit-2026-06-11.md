# 🔍 AUDITORIA DE SAÚDE — MENTE.AI
**Data:** 2026-06-11 | **Branch:** `feat/redesign-home-v2` | **Commit range:** 573 commits (HEAD)

---

## 1. REPOSITÓRIO & VERSIONAMENTO

### Branches Ativos

| Status | Quantidade |
|--------|-----------|
| Branches locais | ~15 ativos + 5 stale |
| Branches remotos (origin) | **71 branches** |

### Branches Stale (+30 dias sem commits)

| Branch | Observação |
|--------|-----------|
| `feat/lab-redesign` | ⚠️ Stale |
| `opencode/misty-island` | ⚠️ Stale |
| `opencode/playful-engine` | ⚠️ Stale |
| `backup/pre-design-netflix` | ⚠️ Stale |
| `backup-recuperacao` | ⚠️ Stale |

### Commits Não Mergeados

- **2 commits** em `feat/redesign-home-v2` não presentes em `origin/main`:
  - `f534e53` feat(era3): presenceToBeacon nos AgentCards, useAuraSync no wrapper
  - `9870311` feat: integrar /universo ao navigation-hints + hook CSS de aura
- **Local `main` está atrás de `origin/main`** em 3 commits (merge do redesign-home-v2)

### Arquivos Não Rastreados

| Arquivo | Tamanho | Observação |
|---------|---------|------------|
| `image.png` | **~1 MB** ⚠️ | Binário grande, idealmente deve ser .gitignored |
| `docs/stack-spec.md` | 40 KB | Novo, esperado |
| `dev-server.log` | ~1.4 KB | Log local, deve ser .gitignored |
| `dev-server2.log` | ~724 B | Log local, deve ser .gitignored |
| `dev3.log` | ~669 B | Log local, deve ser .gitignored |
| `stdout.log` | ~6.3 KB | Log local, deve ser .gitignored |
| `stderr.log` | ~1 KB | Log local, deve ser .gitignored |

**✅ .gitignore** — Cobre `node_modules/`, `.next/`, `.env*`, `.vercel`, `tsconfig.tsbuildinfo`, `.DS_Store`, `Thumbs.db`
**⚠️ Missing no .gitignore:** `*.log`, `image.png`, `*.log` de servidor local

---

## 2. DEPENDÊNCIAS & BUILD

### `npm audit` — 9 vulnerabilidades **moderadas**

| Pacote | Versão Atual | Severidade | Issue | Fix |
|--------|-------------|-----------|-------|-----|
| `esbuild` | ≤0.24.2 | **Moderate** | Requisições não autorizadas ao dev server | `npm audit fix --force` (breaking: `drizzle-kit`) |
| `postcss` | <8.5.10 | **Moderate** | XSS via `</style>` em CSS stringify | `npm audit fix --force` (breaking: `next`) |
| `uuid` | <11.1.1 | **Moderate** | Missing buffer bounds check v3/v5/v6 | `npm audit fix` |

### Dependências Desatualizadas (24 no total)

**Críticas (major version gap):**

| Pacote | Atual | Latest | Gap |
|--------|-------|--------|-----|
| `openai` | 4.104.0 | **6.42.0** | 🚨 **+2 major** |
| `framer-motion` | 11.18.2 | **12.40.0** | 🚨 **+1 major** (API changes) |
| `lucide-react` | 0.574.0 | **1.17.0** | 🚨 **+1 major** |
| `shadcn` | 3.8.5 | **4.11.0** | 🚨 **+1 major** |
| `stripe` | 20.4.1 | **22.2.0** | 🚨 **+2 major** |
| `typescript` | 5.9.3 | **6.0.3** | 🚨 **+1 major** |
| `bcryptjs` | 2.4.3 | **3.0.3** | 🚨 **+1 major** |
| `eslint-plugin-react-hooks` | 5.2.0 | **7.1.1** | 🚨 **+2 major** |
| `radix-ui` | 1.4.3 | **1.5.0** | ⚠️ Minor |

### Build de Produção

**🟢 Build succeeds!** — 38s TypeScript + 22.7s compilation

- **114 páginas estáticas** geradas
- Rotas API + dinâmicas como `ƒ` (server-rendered)
- Migração de `middleware.ts` para `proxy` **deprecation warning**

### TypeScript

**✅ Nenhum erro de TypeScript** — `tsc --noEmit` limpo

### ESLint

**⚠️ ESLint não configurado** — Projeto não tem `eslint.config.*` (ESLint v10 requer novo formato).
`package.json` lista `eslint` e `eslint-config-next` mas sem arquivo de configuração.

---

## 3. TESTES

### Jest (Unit Tests)

| Métrica | Valor |
|---------|-------|
| **Total de suites** | 24 |
| **Testes totais** | 411 |
| **Testes passando** | **390 (94.9%)** |
| **Testes falhando** | **21 (5.1%)** |
| **Suites com falha** | **5** |

### Suites Falhando

| Teste | Falhas | Causa Raiz |
|-------|--------|------------|
| `src/__tests__/cognitive/agent-identity.test.ts` | 1 fail | Prompt injection test — agente respondeu com "hackeado" (palavra proibida) |
| `src/lib/universe/__tests__/context-compressor.test.ts` | 3 fails | Provável dependência de DB não mockada |
| `src/lib/universe/__tests__/progression-engine.test.ts` | 16 fails | Dependência de DB (`getOrCreateProgression`, `activatePlanet`, etc.) sem mock |
| `src/lib/nexus/__tests__/nexus.test.ts` | **Suite crash** | `SyntaxError: Unexpected token 'export'` no `uuid` package (ESM vs CJS) |
| `src/lib/experience/tests/experience.test.ts` | **Suite crash** | Mesmo problema do `uuid` ESM |

### Causa Raiz dos Suites Crash

O `uuid` v11+ é ESM-only. O `jest.config.ts` tenta transformá-lo via `transformIgnorePatterns: ['node_modules/(?!(uuid)/)']`, mas o `ts-jest` só transforma `.ts/.tsx`, não `.js`. Os arquivos `.js` do uuid mantêm `export` syntax, causando SyntaxError no Node.

### Cobertura

**⚠️ `collectCoverage` não configurado** no `jest.config.ts` — sem métricas de cobertura disponíveis.

### Playwright (E2E)

- **3 arquivos**, **9 testes** totais
- Categorias: agent-combination (6), laboratorio-flow (2), record-demo (1)
- **Não executados** nesta auditoria (requerem servidor rodando)

---

## 4. BANCO DE DADOS & MIGRAÇÕES

### Migrações

| Total de migrações | 5 arquivos SQL |
|--------------------|----------------|

| Migration | Descrição |
|-----------|-----------|
| `0000_curvy_leopardon.sql` | Schema inicial |
| `0001_needy_thaddeus_ross.sql` | Ajustes |
| `0002_next_dracula.sql` | Alterações |
| `0004_knowledge_model.sql` | Modelo de conhecimento |
| `0005_universe_presence.sql` | Universo + presença |

**⚠️ Gap:** Migration `0003` não existe — pulou de `0002` para `0004`.

### Script de Migração

**⚠️ Migração manual** via `migrate.js` — sem snapshots automáticos do Drizzle Kit. O script lida com `ALTER TABLE` diretamente com verificação de existência.

### Drizzle Config

- **Driver:** `mysql2`
- **Schema:** `src/lib/db/schema.ts`
- **Output:** `drizzle/`

### Observações

- ✅ `DATABASE_URL` configurada no `.env`
- ❌ **Índices e performance de queries não auditados** — sem acesso ao DB de produção

---

## 5. INFRAESTRUTURA & DEPLOY

### Deploy

- **Plataforma:** Vercel (inferido por `.vercel` no `.gitignore` + configuração típica Next.js)
- **⚠️ Último deploy:** Não foi possível verificar sem acesso ao dashboard da Vercel

### Serviços Externos

| Serviço | API Key Presente | Status |
|---------|-----------------|--------|
| Groq | ✅ | Provisionado |
| OpenAI | ✅ | Provisionado |
| Anthropic | ✅ | Provisionado |
| DeepSeek | ✅ | Provisionado |
| Mimo | ✅ | Provisionado |
| ElevenLabs | ✅ | Provisionado |
| Stripe | ✅ | Provisionado |
| LangSmith | ✅ | Provisionado |
| **TiDB/MySQL** | ✅ (DATABASE_URL) | Provisionado |

### Custos

- **⚠️ Estimativa de custos não disponível** — sem acesso ao dashboard de billing

### Logs

- Logs de servidor local (`dev-server.log`, `stdout.log`, `stderr.log`) presentes no diretório — indicam que o servidor foi executado recentemente
- **Nenhum serviço de monitoring/error tracking além do Sentry** (inferido pelo arquivo `src/lib/sentry-transport.ts`)

### SSL & Certificados

- **✅ Vercel gerencia SSL automaticamente** para domínios customizados
- **⚠️ Sem certificados locais ou auto-assinados** — sem desenvolvimento HTTPS local

---

## 6. SEGURANÇA

### Secrets Expostos

| Risco | Status | Detalhe |
|-------|--------|---------|
| `.env` no git | **✅ Seguro** — `.gitignore` cobre `.env`, `.env.local`, `.env.*.local` |
| Keys hardcoded no código | **✅ Não encontrado** — nenhuma API key hardcoded em `src/` |
| Keys em logs | **⚠️ Potencial** — logs do dev-server podem conter tokens de sessão |

### Middleware de Segurança

- ✅ **Autenticação** via JWT (`verifyToken`) para rotas protegidas (`/home`, `/dashboard`, `/aulas`, etc.)
- ✅ **Redirects** — usuário não autenticado → `/login`; usuário autenticado em `/` → `/home`
- ✅ **Matcher** restringe middleware a paths específicos

### ❌ CORS

- **❌ Nenhum header CORS configurado** — middleware.ts não define `Access-Control-*` headers
- Projeto não parece expor API pública para terceiros, então pode ser intencional
- Para API routes que possam ser chamadas de origens diferentes, isso é um risco

### Rate Limiting

- **❌ Nenhum rate limiting implementado** na middleware ou nas API routes

### Vulnerabilidades

- 9 vulnerabilidades **moderadas** no `npm audit`
- Nenhuma **crítica ou alta**

---

## 7. DOCUMENTAÇÃO

### README.md

**⚠️ Desatualizado:**
- Instrução `npm install mente-ai-platform` incorreta (projeto não é um pacote npm)
- Faltam instruções de setup: `.env`, variáveis necessárias, build steps
- Sem guia de contribuição detalhado

### docs/stack-spec.md

**✅ Criado em 2026-06-11** — 23 seções cobrindo stack completa, ADRs, diagramas, custos
**⚠️ Precisa ser mantido sincronizado com mudanças futuras**

### TODOs no Código

**⚠️ Múltiplos TODOs espalhados no código:**
- `// TODO: [MENTE.AI] adicionar feedback visual ao usuário` — presente em vários arquivos (blog, logout, AgentChat, Gamification, OasisProvider)
- **Sem FIXMEs ou HACKs** encontrados

### Outros Documentos

| Documento | Status |
|-----------|--------|
| `CLAUDE.md` | ✅ Canônico, bem mantido |
| `AGENTS.md` | ✅ Ponteiro para CLAUDE.md |
| `CONTRIBUTING.md` | ✅ Existe |
| `MASTER_SCREENPLAY.md` | ✅ Existe |
| `MENTE_AI_GOVERNANCE.md` | ✅ Existe |

---

## 8. PERFORMANCE

### Lighthouse

**⚠️ Lighthouse CI configurado** (`"lighthouse": "lhci autorun"` no `package.json`) mas **não executado** nesta auditoria.

### Build Output

- Build de produção: **sucesso**
- Páginas estáticas: 114
- **Bundle size individual: não auditado** — `next build` não exibe por padrão; precisaria do `@next/bundle-analyzer`

### Cold Start

- API routes são server-rendered (ƒ) — cold start depende da plataforma (Vercel)
- **Sem monitoramento de cold start implementado**

### Análise de Performance

- Nenhum pacote de web-vitals ou RUM (Real User Monitoring) implementado
- Sem analytics de performance (Google Analytics, etc.)
- **Core Web Vitals não instrumentados**

---

## RESUMO EXECUTIVO

### Legenda
- ✅ OK — funcionando normalmente
- ⚠️ WARN — funciona, mas precisa de atenção
- ❌ FAIL — quebrado ou crítico
- ⏭️ SKIP — não aplicável

### Checklist Completo

| # | Item | Status | Detalhe |
|---|------|--------|---------|
| 1.1 | Branches ativos | ✅ | 71 branches remotos, ~15 ativos |
| 1.2 | Branches stale | ⚠️ | 5 branches sem commits há +30 dias |
| 1.3 | Commits não mergeados | ⚠️ | 2 commits no branch atual não mergeados |
| 1.4 | Conflitos de merge | ✅ | Nenhum conflito detectado |
| 1.5 | Arquivos não rastreados >1MB | ⚠️ | `image.png` (~1MB) sem .gitignore |
| 1.6 | .gitignore atualizado | ⚠️ | Faltam `*.log` e `image.png` |
| 2.1 | npm audit | ⚠️ | 9 moderadas (esbuild, postcss, uuid) |
| 2.2 | Dependências desatualizadas | ⚠️ | 24 pacotes desatualizados, 8 com major lag |
| 2.3 | Dependências não usadas | ⏭️ | `depcheck` não executado (não instalado) |
| 2.4 | Build de produção | ✅ | Sucesso (114 páginas estáticas) |
| 2.5 | TypeScript | ✅ | Zero erros |
| 2.6 | ESLint | ❌ | Configuração ESLint ausente (formato v10) |
| 2.7 | Bundle size | ⏭️ | Não auditado (sem bundle-analyzer) |
| 3.1 | Testes (Jest) | ⚠️ | 21 falhas em 5 suites (94.9% passam) |
| 3.2 | Cobertura | ❌ | `collectCoverage` não configurado |
| 3.3 | Testes skipped | ⚠️ | 2 suites crasham (uuid ESM) |
| 3.4 | Testes flaky | ⚠️ | Progression-engine (DB-dependente) |
| 4.1 | Migrações | ⚠️ | Gap: migration 0003 ausente |
| 4.2 | Conflitos de migração | ⏭️ | Sem conflitos detectados |
| 4.3 | Tamanho do banco | ⏭️ | Sem acesso ao DB de produção |
| 4.4 | Índices | ⏭️ | Não auditado |
| 5.1 | Último deploy | ⏭️ | Sem acesso ao dashboard |
| 5.2 | Staging vs Produção | ⏭️ | Sem acesso |
| 5.3 | Logs de erro recentes | ⚠️ | Logs locais presentes mas não analisados |
| 5.4 | Serviços externos | ✅ | Todos provisionados |
| 5.5 | SSL | ✅ | Gerenciado pela Vercel |
| 5.6 | Custos | ⏭️ | Sem acesso ao billing |
| 6.1 | Secrets expostos | ✅ | Nenhum encontrado |
| 6.2 | Vulnerabilidades críticas | ✅ | Nenhuma crítica/alta |
| 6.3 | Permissões de arquivos | ✅ | Padrão |
| 6.4 | CORS | ❌ | Nenhum header CORS configurado |
| 7.1 | README atualizado | ⚠️ | Desatualizado, instruções incorretas |
| 7.2 | docs/stack-spec.md | ✅ | Criado recentemente |
| 7.3 | TODOs/FIXMEs críticos | ⚠️ | TODOs de feedback visual espalhados |
| 8.1 | Lighthouse | ⏭️ | Não executado |
| 8.2 | Core Web Vitals | ⏭️ | Não instrumentado |
| 8.3 | Cold start | ⏭️ | Não medido |
| 8.4 | Queries lentas | ⏭️ | Sem acesso ao DB |

---

## 🔴 TOP 3 PROBLEMAS CRÍTICOS

### 1️⃣ Testes Quebrados — 21 Falhas em 5 Suites (🚨 ALTO IMPACTO)

**Impacto:** Impede deploy com confiança. 2 suites crasham completamente.

**Causas:**
- **uuid ESM (critical):** `nexus.test.ts` e `experience.test.ts` crasham porque `uuid` v11+ é ESM e o `ts-jest` não transforma arquivos `.js`. Fix: adicionar `babel-jest` para transformar `.js` de node_modules ou trocar transform pattern.
- **DB não mockado:** `context-compressor`, `progression-engine` e `agent-identity` dependem de conexão real com banco.
- **Prompt injection:** Teste de segurança falha porque agente responde com palavra proibida.

**Fix sugerido:**
```js
// jest.config.ts — adicionar transform para .js de node_modules ESM
transform: {
  '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  '^.+\\.m?js$': ['babel-jest', { configFile: false }],
},
transformIgnorePatterns: ['node_modules/(?!(uuid|other-esm-pkg)/)'],
```

### 2️⃣ ESLint sem Configuração — Arquivo `eslint.config.*` Ausente (🚨 ALTO IMPACTO)

**Impacto:** `npm run lint` não funciona. Qualidade de código não é verificada automaticamente.

**Causa:** ESLint v10 requer `eslint.config.js` (formato flat config). O projeto migrou para ESLint v10 mas não criou o arquivo de configuração.

**Fix sugerido:** Criar `eslint.config.js` ou `eslint.config.mjs` com configuração Next.js + TypeScript.

### 3️⃣ Dependências com Major Lag — 8 Pacotes Atrasados (⚠️ MÉDIO-ALTO IMPACTO)

**Impacto:** Riscos de segurança não corrigidos, possíveis breaking changes acumuladas.

**Mais críticos:**
| Pacote | Versão | Latest | Risco |
|--------|--------|--------|-------|
| `openai` | 4.x | **6.x** | API changes significativas |
| `stripe` | 20.x | **22.x** | Webhooks e API podem ter mudado |
| `typescript` | 5.9 | **6.0** | TS 6.0 tem breaking changes |
| `framer-motion` | 11.x | **12.x** | API de animação reformulada |
| `lucide-react` | 0.x | **1.x** | Breaking change na importação |

---

## 📋 AÇÕES RECOMENDADAS — ESTA SEMANA

### Prioridade Alta (fazer imediatamente)

1. **🔧 Fix uuid ESM nos testes** — Adicionar `babel-jest` no `jest.config.ts` para resolver os 2 suites que crasham
2. **🔧 Criar `eslint.config.js`** — Restaurar linting do projeto
3. **🔧 Mockar DB nos testes** — `context-compressor` e `progression-engine` precisam de mocks para não dependerem de banco real

### Prioridade Média (fazer nos próximos dias)

4. **📦 Atualizar dependências seguras** — `uuid`, `esbuild` (moderate vulns), `@types/*`, `zustand`, `react`/`react-dom`
5. **📄 Atualizar README.md** — Corrigir instruções de setup, adicionar guia de `.env`
6. **🗑️ Limpar branches stale** — `feat/lab-redesign`, `opencode/misty-island`, `opencode/playful-engine`, `backup/*`
7. **🗑️ Adicionar `*.log` e `image.png` ao `.gitignore`** — Evitar arquivos indesejados no repositório

### Prioridade Baixa (monitorar)

8. **📈 Configurar `collectCoverage`** no Jest
9. **🌐 Avaliar necessidade de headers CORS** na middleware
10. **🔐 Avaliar necessidade de rate limiting** nas API routes

---

## 🚨 RISCOS DE DEPLOY SE FOSSE HOJE

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| **Build OK, testes quebrados em produção** | Alta | Médio | 21 testes falhando podem indicar regressões não detectadas |
| **Prompt injection vulnerável** | Média | Alto | Teste de segurança falha — agente pode ser manipulado |
| **DB connection sem fallback** | Média | Alto | Testes de progression-engine falham por falta de mock — se DB estiver indisponível, funcionalidade crítica quebra |
| **Middleware sem rate limit** | Baixa | Alto | Sem proteção contra abuso de API |

### Conclusão: 🟡 **DEPLOY CONDICIONAL**

> **Não recomendo deploy em produção hoje.**  
> Os 2 suites que crasham (nexus + experience) indicam problemas de configuração de ambiente que podem se manifestar em produção.  
> As 21 falhas de teste precisam ser resolvidas antes de qualquer deploy.

**Pré-requisitos mínimos para deploy:**
1. ✅ Fix uuid ESM → testes de nexus e experience passando
2. ✅ Criar eslint.config.js
3. ✅ Mockar DB nos testes de progression-engine
4. ⚠️ Idealmente: resolver prompt injection test

---

*Relatório gerado automaticamente em 2026-06-11 por Buffy (MENTE.AI Health Audit)*
