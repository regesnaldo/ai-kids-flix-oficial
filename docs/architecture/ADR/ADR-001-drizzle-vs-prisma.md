# ADR-001: Escolha do ORM — Drizzle vs Prisma

## Status
**Accepted** — Maio 2026

## Contexto

O MENTE.AI nasceu como um projeto que precisava de um ORM para MySQL/TiDB Cloud. A stack Next.js + TypeScript pedia tipagem forte. Duas opções dominavam o ecossistema em 2025: **Prisma** (o mais popular) e **Drizzle** (o mais novo e leve).

O projeto originalmente flertou com Prisma — schemas `.prisma`, migrations, Prisma Client. Mas durante a Fase 0 de estabilização, descobrimos que vários arquivos ainda referenciavam Prisma e Drizzle simultaneamente, criando conflitos silenciosos.

## Decisão

**Drizzle ORM como ORM exclusivo do projeto.** Prisma foi completamente removido.

## Por quê?

1. **Bundle size em serverless:** Prisma Client gera ~2-6MB de engine binária. No Vercel, cada cold start carrega esse peso. Drizzle é ~200KB — 10x menor. Em serverless, cada byte conta.

2. **Zero code generation:** Drizzle usa inferência de tipos do TypeScript (`$inferSelect`, `$inferInsert`). Prisma requer `prisma generate` após cada mudança de schema — um passo a mais que quebra o fluxo e gera arquivos commitados.

3. **SQL-like mental model:** Drizzle é "SQL com type-safety". A equipe (pequena, agile) prefere pensar em SQL do que em uma DSL proprietária.

4. **TiDB compatibility:** TiDB é MySQL-compatível. Drizzle com `drizzle-orm/mysql-core` conecta nativamente sem adaptadores especiais.

5. **Lazy pool pattern:** Drizzle permite Proxy-based lazy initialization. Prisma Client é eager por design — cada import instancia a conexão.

## Alternativas Consideradas

- **Prisma** — rejeitado. Popular (40k+ GitHub stars), maduro, mas pesado para serverless e força um workflow `prisma generate` que não combina com iteração rápida.
- **TypeORM** — rejeitado. Muito "enterprise", decorators, padrão Active Record que conflita com o estilo funcional do projeto.
- **Knex.js** — rejeitado. Query builder puro, sem type-safety. Exigiria escrever tipos manualmente.
- **Raw SQL com mysql2** — rejeitado. Perde type-safety e abre porta para SQL injection acidental.

## Consequências

### Positivas
- Cold starts ~15% mais rápidos no Vercel
- Schema TypeScript-first: `schema.ts` é a única fonte da verdade
- Migrations geradas por `drizzle-kit generate` são SQL puro, revisáveis
- Proxy pattern economiza conexões MySQL em rotas que não tocam o banco

### Negativas
- Comunidade menor que Prisma (~25k GitHub stars vs 40k)
- Menos exemplos e tutoriais online
- Equipe nova pode não conhecer Drizzle (curva de aprendizado ~2 dias)
- `drizzle-kit` requer binário esbuild específico da plataforma (problema no WSL)

### Riscos
- Se o Drizzle for abandonado, migração seria custosa (~20 tabelas)
- Mitigação: schema em TypeScript puro é portável; SQL gerado é padrão

## Evolução Futura

- Se o projeto escalar para múltiplos bancos, Drizzle suporta PostgreSQL nativamente
- Se TiDB evoluir para features não-MySQL, avaliar adaptador específico
- Monitorar Drizzle ORM releases para breaking changes (atualmente em 0.x)
