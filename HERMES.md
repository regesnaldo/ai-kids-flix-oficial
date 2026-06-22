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
