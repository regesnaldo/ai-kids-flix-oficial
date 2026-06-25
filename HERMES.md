# HERMES.md - Regras do Agente (MENTE.AI)

## Stack Obrigatória
- Framework: Next.js 16 (App Router)
- Linguagem: TypeScript (Strict)
- Banco de Dados: TiDB Cloud (MySQL) via Drizzle ORM
- Auth: JWT (cookie `mente_ai_token`) - NUNCA usar Clerk ou NextAuth.
- ORM: Drizzle ORM - NUNCA usar Prisma. O Prisma é permanentemente proibido neste repositório.

## Regras de Workflow
1. Um problema por commit. Não faça commits em lote.
2. `git add .` é PROIBIDO. Adicione arquivos explicitamente (ex: `git add src/app/page.tsx`).
3. A branch `main` é protegida. Todo trabalho deve ser feito via Pull Request.
4. O arquivo `src/lib/db/schema.ts` (e extensões) é protegido. Não modifique o schema do banco sem aprovação explícita.
5. Não crie arquivos `src/proxy.ts`.
6. O Middleware deve SEMPRE exportar `async function middleware`.

## Padrões de Código
- Remover todos os `console.log` antes do commit (ou envolvê-los em `if (process.env.NODE_ENV === 'development')`).
- Tratar erros de API com `try/catch` retornando status 500 ou 503 com JSON.
- Usar aliases `@/` para imports (aponta para `./src`).

## Loop Landing Hero — Rodada 1 — 2026-06-23
- Resultado: APROVADO (Gates 2-5 ✅, Gate 1 pré-existente)
- Arquivo modificado: src/app/landing/page.tsx
- Aprendizado: erro TTS (@google-cloud/text-to-speech ausente)
  é pré-existente — tratar em loop separado
- Build limpo: Turbopack ✅, tsc landing ✅

## Loop Cleanup .hermes/plans — 2026-06-24
- Resultado: PR #250 criado (aguardando merge)
- Ação: Removidos 11 scripts .py de criação de PR acidentalmente commitados no PR #248
- Branch: chore/remove-hermes-plans
- Regra registrada: `hermes_agent.py` scripts são artefatos internos — nunca commitados no repositório remoto

## Loop Unificado ERA 4 — 24 Jun 2026
- Tarefa 1: PR #249 rate-limiter — PASSOU (cherry-pick e98d396 → fix/rate-limiter-v2)
- Tarefa 2: PROJECT.md criado — PASSOU (docs/project-md, 98 linhas)
- Tarefa 3: Constituição Arquitetural — PASSOU (docs/constituicao-arquitetural)
- Aprendizado: `.next/dev/types/validator.ts` pode corromper entre branches — limpar arquivo específico antes do build
