# Relatório Fase 0 — Verdade Operacional

**Data:** 17 de julho de 2026  
**Branch:** `main` (commit `349f7eb`)  
**Executor:** Kimi K3

---

## 1. Resumo Executivo

| Check | Status | Detalhes |
|-------|--------|----------|
| Typecheck | ✅ PASS | Zero erros |
| Build | ✅ PASS | 1 warning (Turbopack NFT tracing) |
| Testes unitários | ✅ PASS | 24 suites, 460 testes, 100% pass rate |
| Lint | ❌ FAIL | 97 problemas (59 erros, 38 warnings) |
| E2E | ⚠️ NÃO EXECUTADO | Comando disponível (`npm run test:e2e`) mas não rodado nesta fase |
| Providers (código) | ✅ Estrutura OK | Fallbacks implementados; health checks existem |
| TTS (ElevenLabs) | ⚠️ BLOQUEADO | Créditos zerados em 27/06/2026; rota `/api/tts` usa Google TTS como fallback técnico |
| Stripe webhook | ⚠️ IDEMPOTÊNCIA FRÁGIL | Usa `Set` em memória — não persiste entre cold starts na Vercel |

**Veredicto:** O código compila e os testes passam, mas o lint está quebrado e há pelo menos 3 problemas operacionais que impediriam um deploy de produção confiável.

---

## 2. Resultados Detalhados

### 2.1 Typecheck (`tsc --noEmit`)
- **Status:** ✅ PASS
- **Erros:** 0
- **Observação:** TypeScript 5.9.3 com strict mode ativo. Nenhum erro de tipo.

### 2.2 Build (`npm run build`)
- **Status:** ✅ PASS (79s compilação + 42s typecheck + 5.6s geração de 116 páginas estáticas)
- **Warning:** `Turbopack build encountered 1 warnings: ./next.config.mjs — Encountered unexpected file in NFT list`
  - Causa: `src/app/api/health/governance/route.ts` contém operações de filesystem (path.join, path.resolve, fs.readFile) ou requires dinâmicos que fazem o Turbopack traçar o projeto inteiro.
  - Impacto: aumento de bundle size e build time; não quebra o build.
  - Ação: isolar operações de filesystem a subpastas ou adicionar comentário `/*turbopackIgnore: true*/`.

### 2.3 Lint (`npm run lint`)
- **Status:** ❌ FAIL — 97 problemas totais

#### Erros (59)
| Categoria | Quantidade | Exemplos de arquivos |
|-----------|-----------|----------------------|
| `@typescript-eslint/no-explicit-any` | ~22 | `scripts/generate-agent-images.ts`, `src/app/api/**/route.ts`, `src/data/seed/*.ts`, `src/components/**/page.tsx` |
| `@typescript-eslint/no-require-imports` | ~14 | `generate-pdf.js`, `jest.setup.js`, `migrate.js`, `scripts/validation/*.js`, `.minimax/skills/**` |
| `no-useless-escape` | 4 | `generate-pdf.js`, `jest.config.ts` |
| `react-hooks/immutability` | 4 | `Navigation.tsx`, `Billboard.tsx`, `AccessibilityFeatures.tsx`, `AdaptiveProfileModal.tsx` |
| `react-hooks/exhaustive-deps` | 15 | Diversos componentes (hooks com dependências faltantes) |

#### Warnings (38)
| Categoria | Quantidade | Notas |
|-----------|-----------|-------|
| `react-hooks/exhaustive-deps` | 15 | Dependências faltantes em useEffect/useCallback |
| `react-hooks/immutability` | 4 | Acesso a variável antes da declaração; modificação de ref retornado de hook |
| `@next/next/no-img-element` | 2 | `HeroBanner.tsx`, `AgentSelector.tsx` |
| `import/no-anonymous-default-export` | 1 | `eslint.config.mjs` |

**Problemas críticos de lint que merecem atenção imediata:**
1. **12 cenas Three.js** (`src/components/scenes/*.tsx`): modificam `scene.background` diretamente em `useEffect` — `react-hooks/immutability` warning. Isso pode causar inconsistência de renderização no React Three Fiber.
2. **Navigation.tsx linha 95**: função `isEditable` acessada antes de ser declarada dentro do mesmo `useEffect`.
3. **Billboard.tsx linha 81**: função `goTo` acessada antes de ser declarada.
4. **AccessibilityFeatures.tsx linha 249**: `fallbackTone` acessada antes de ser declarada.
5. **AdaptiveProfileModal.tsx linha 304**: `badgesContainerRef` (useState) modificado diretamente via ref callback — deve usar `useRef` ou `useCallback`.

### 2.4 Testes Unitários (`npm run test`)
- **Status:** ✅ PASS
- **Suites:** 24 passed
- **Testes:** 460 passed
- **Snapshots:** 0
- **Tempo:** 30.4s
- **Observações:**
  - Console.warns esperados em testes de contrato (props validation).
  - Console.errors esperados em testes de transição inválida do NexusRuntime.
  - Nenhum teste falhou de fato.

### 2.5 Jornada Crítica (inspeção de código — não testada em runtime)

| Etapa | Status | Evidência |
|-------|--------|-----------|
| Login/Auth | ✅ Implementado | JWT + cookie `mente_ai_token`; middleware protege rotas |
| Chat com agentes | ✅ Implementado | `/api/chat` com fallback OpenAI → Anthropic → Groq |
| XP | ✅ Implementado | `src/lib/xp.ts` + `/api/xp/award` + `/api/xp/level-up` |
| Checkout Stripe | ✅ Implementado | `/api/checkout` + `/api/webhooks/stripe` |
| Webhook Stripe | ⚠️ Parcial | Idempotência usa `Set` em memória — não funciona em serverless |
| TTS ElevenLabs | ❌ Bloqueado | Créditos zerados; rota `/api/elevenlabs/speak` deve existir mas não verificada |
| TTS Google | ✅ Fallback técnico | `/api/tts` usa Google Cloud TTS com vozes por agente |
| Health checks | ✅ Implementados | `/api/health/anthropic`, `/api/health/system` |

---

## 3. Problemas Operacionais Encontrados

### P0 — Crítico (impede deploy seguro)

#### 1. Stripe Webhook Idempotência Frágil
- **Arquivo:** `src/app/api/webhooks/stripe/route.ts:9`
- **Problema:** `const processedEvents = new Set<string>()` — em memória.
- **Impacto:** Na Vercel (serverless), cada requisição pode rodar em uma instância nova. O `Set` é resetado a cada cold start. Stripe pode reenviar o mesmo evento e ele será processado duplicado.
- **Solução mínima:** usar o banco de dados (TiDB) para guardar `event.id` já processados, ou usar Stripe's `idempotency` nativa. Alternativa: armazenar em KV (Vercel KV, Redis) ou na própria tabela de `users` com timestamp.

#### 2. Lint Quebrado (59 erros)
- **Impacto:** Pipeline não está verde. Não é possível garantir que novos commits não introduzam regressões.
- **Solução mínima:**
  - Fixar `no-explicit-any` nos 22+ lugares (tipar ou usar `unknown` + narrowing).
  - Excluir arquivos JS legados (scripts, .minimax) do escopo do ESLint ou convertê-los para TS.
  - Fixar os 4 erros de `react-hooks/immutability` (mover declaração antes do uso, usar `useRef` para refs).

#### 3. Turbopack NFT Warning
- **Arquivo:** `src/app/api/health/governance/route.ts` (via `next.config.mjs`)
- **Impacto:** Build time aumentado, bundle size inflado.
- **Solução mínima:** isolar operações de filesystem a `process.cwd()` + subpasta, ou usar `/*turbopackIgnore: true*/`.

### P1 — Alto (degrada experiência ou gera custo)

#### 4. TTS ElevenLabs Indisponível
- **Status:** Créditos zerados em 27/06/2026.
- **Impacto:** Experiência de voz premium inoperante. `/api/tts` usa Google TTS como fallback, mas sem a qualidade da ElevenLabs.
- **Solução:** recarregar créditos ou implementar fallback inteligente (Web Speech API no browser quando ElevenLabs falha).

#### 5. Rate Limiting Não Implementado
- **Impacto:** APIs de chat, TTS e checkout expostas a abuso.
- **Arquivos afetados:** `/api/chat`, `/api/tts`, `/api/checkout`, `/api/elevenlabs/speak`
- **Solução mínima:** implementar rate limit por IP (Vercel KV ou memory-based para MVP) nas rotas mais críticas.

#### 6. 12 Cenas Three.js — Mutação de `scene`
- **Arquivos:** `src/components/scenes/*.tsx` (Aurora, Axiom, Cipher, Ethos, Janus, Kaos, Lyra, Prism, Stratos, Terra, Volt)
- **Problema:** `scene.background = new THREE.Color(...)` dentro de `useEffect` — R3F desencoraja mutação de objetos retornados por hooks.
- **Impacto:** Possível inconsistência de renderização, warnings no console, e incompatibilidade futura com React 19 Strict Mode.
- **Solução mínima:** usar `<color attach="background" args={['#010509']} />` no JSX do Canvas, ou configurar o background no `onCreated` do Canvas.

#### 7. E2E Não Executado
- **Comando:** `npm run test:e2e` (Playwright)
- **Status:** Não foi executado nesta fase por limitação de tempo.
- **Impacto:** Não há garantia de que a jornada principal (login → aula → chat → checkout) funciona em browser real.

### P2 — Médio (dívida técnica)

#### 8. `any` em rotas de API
- **Arquivos:** `src/app/api/admin/dashboard/route.ts`, `src/app/api/agents/chat/route.ts`, `src/app/api/health/governance/route.ts`, `src/app/api/lab/agent/route.ts`, `src/app/api/tools/seed-episodes/route.ts`, `src/app/api/tts/route.ts`, `src/app/api/universe/progression/route.ts`, `src/app/api/universo/chat/route.ts`
- **Impacto:** Perda de segurança de tipo em camada crítica (backend).

#### 9. Scripts JS legados no escopo do lint
- **Arquivos:** `generate-pdf.js`, `migrate.js`, `jest.setup.js`, `scripts/validation/*.js`
- **Impacto:** `no-require-imports` falha porque são arquivos JS puros em projeto TS.
- **Solução:** adicionar `ignorePatterns` no ESLint ou migrar para TS.

#### 10. Dependências desatualizadas
- **Relatório histórico:** 24 dependências desatualizadas, 8 com major lag.
- **Não verificado nesta fase:** `npm audit` não foi executado.

---

## 4. Arquitetura de Providers (LLM) — Estado do Código

| Provider | Adapter | Gateway | Health Check | Fallback |
|----------|---------|---------|--------------|----------|
| Anthropic | `src/lib/llm/adapters/anthropic.ts` | ✅ | `/api/health/anthropic` | ✅ (usado em `/api/chat`) |
| OpenAI | `src/lib/llm/adapters/openai.ts` (compat) | ✅ | Via `OPENAI_FALLBACK` no health/anthropic | ✅ |
| Groq | `src/lib/llm/adapters/groq.ts` (compat) | ✅ | Não dedicado | ✅ |
| DeepSeek | `src/lib/llm/adapters/deepseek.ts` (compat) | ✅ | Não dedicado | ✅ (novo gateway `provider.ts`) |

**Observações:**
- O novo gateway (`src/lib/llm/provider.ts`) implementa fallback DeepSeek → Groq com ping de conectividade. É uma evolução positiva.
- A rota `/api/chat` ainda usa fallback manual OpenAI → Anthropic → Groq, enquanto o gateway usa DeepSeek → Groq. Há **duplicação de lógica de fallback**. Recomendação: migrar `/api/chat` para usar o gateway centralizado.
- Cost tracker (`src/lib/llm/cost-tracker.ts`) loga custos em JSON estruturado. Preços hardcoded de junho/2026. Funciona, mas precisa de atualização periódica.

---

## 5. Catálogo de Rotas (build gerou 116 páginas)

**Rotas estáticas (○):** 52  
**Rotas dinâmicas (ƒ):** 64  
**Proxy (middleware):** 1

Todas as rotas documentadas no relatório executivo estão presentes e compilando. Nenhuma rota quebrada no build.

---

## 6. Recomendações Imediatas (antes de avançar para Fase 1)

### A. Fazer o lint passar (meta: 0 erros, warnings baseline aceitável)
1. **Corrigir os 4 erros de `react-hooks/immutability`**:
   - `Navigation.tsx`: mover `isEditable` para fora do componente ou usar `useCallback`.
   - `Billboard.tsx`: mover `goTo` para fora do `useEffect` ou usar `useRef`.
   - `AccessibilityFeatures.tsx`: mover `fallbackTone` para fora do `useCallback`.
   - `AdaptiveProfileModal.tsx`: converter `badgesContainerRef` de `useState` para `useRef`.
2. **Corrigir `any` nas rotas de API** (8 arquivos): tipar ou usar `unknown` + zod parsing.
3. **Excluir arquivos JS legados do lint** (`generate-pdf.js`, `migrate.js`, `scripts/validation/*.js`, `.minimax/**`) via `ignorePatterns` no `eslint.config.mjs`.
4. **Corrigir 12 cenas Three.js**: usar `<color attach="background" />` no Canvas ou configurar via `onCreated`.

### B. Corrigir idempotência do Stripe webhook
- Implementar `processedEvents` no banco (TiDB) ou em KV. Query: `SELECT event_id FROM stripe_webhook_events WHERE event_id = ?` com INSERT após processamento.

### C. Executar E2E
- Rodar `npm run test:e2e` para validar jornada principal em browser.

### D. Executar `npm audit`
- Verificar vulnerabilidades conhecidas (relatório histórico menciona 9 moderadas).

---

## 7. Métricas de Sucesso da Fase 0

| Métrica | Alvo | Real |
|---------|------|------|
| Typecheck zero erros | ✅ | ✅ |
| Build zero erros | ✅ | ✅ (1 warning) |
| Testes unitários passando | 100% | ✅ 100% (460/460) |
| Lint zero erros | ✅ | ❌ 59 erros |
| E2E passando | ✅ | ⚠️ Não executado |
| Health checks respondendo | ✅ | ⚠️ Código OK, runtime não testado |
| Stripe webhook idempotente | ✅ | ❌ Frágil |
| TTS funcional | ✅ | ⚠️ Google OK, ElevenLabs bloqueado |

---

## 8. Conclusão

O MENTE.AI tem uma base técnica sólida: TypeScript sem erros, build compilando, 460 testes passando, e arquitetura de providers bem estruturada com fallback e cost tracking. No entanto, **não está pronto para deploy de produção sem correções**:

1. **Lint quebrado** (59 erros) — pipeline não é confiável.
2. **Stripe webhook idempotente frágil** — risco de cobrança duplicada em produção.
3. **TTS premium indisponível** — ElevenLabs sem créditos.
4. **E2E não validado** — jornada principal não confirmada em browser.

**Próximo passo recomendado:** Antes de iniciar a Fase 1 (Jornada Essencial), investir 1-2 dias para:
- Fazer lint passar (correções cirúrgicas nos 4 erros de hooks + anys nas APIs + exclusão de JS legados).
- Corrigir idempotência do Stripe webhook.
- Executar E2E mínimo (login → home → chat → planos).
- Verificar `npm audit`.

Isso estabelece a **verdade operacional** como base confiável para todas as fases seguintes.

---

*Arquivo gerado em: `docs/RELATORIO-FASE0-2026-07-17.md`*
