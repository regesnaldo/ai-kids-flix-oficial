# ADR-015: Padrão de Pool de Banco — Lazy Singleton com Proxy

## Status
**Accepted** — Maio 2026

## Contexto

Em serverless, cada função é efêmera. Um `import { db } from "@/lib/db"` cria o pool MySQL imediatamente — mesmo que a função nunca toque no banco. Pior: cada cold start cria um pool novo, consumindo conexões do TiDB desnecessariamente.

O bug foi descoberto na Fase 0: rotas de health check e páginas estáticas estavam criando conexões MySQL sem usar.

## Decisão

**Lazy Singleton Pool via JavaScript Proxy.** Pool criado apenas no primeiro `.select()`, `.insert()`, ou `.getConnection()`.

## Por quê?

1. **Economia de conexões:** Rotas que não tocam no banco (health check, página estática) não consomem conexão. Em produção, ~40% das rotas não precisam de DB.

2. **API inalterada:** `import { db } from "@/lib/db"` continua funcionando. O Proxy intercepta o acesso e cria a instância sob demanda.

3. **Thread-safe em serverless:** Cada função é isolada. O singleton vive apenas durante a execução da função — sem risco de compartilhar estado entre requests.

4. **Zero breaking change:** A migração de eager → lazy foi transparente. Nenhum arquivo precisou ser alterado além de `db/index.ts`.

## Alternativas Consideradas

- **Eager pool (padrão antigo)** — rejeitado. Criava pool em todo cold start, mesmo sem uso. ~40% de conexões desperdiçadas.
- **Pool por request** — rejeitado. Criar e destruir pool a cada query seria ainda pior (overhead de handshake MySQL).
- **Edge Functions + HTTP queries** — rejeitado. TiDB usa MySQL wire protocol, não HTTP. Precisaria de proxy.
- **ORM com pool built-in (Prisma)** — rejeitado. Prisma Client é eager por design, sem lazy option.

## Consequências

### Positivas
- ~40% menos conexões MySQL em produção
- Cold starts de rotas não-DB são mais rápidos (não inicializam mysql2)
- API inalterada para consumidores

### Negativas
- Proxy pattern é "mágica" — dev novo pode não entender como funciona
- Debugging: erro de conexão só aparece na primeira query, não no import
- TypeScript: Proxy perde tipagem precisa (resolvido com `as` casts)

### Riscos
- Se o Proxy tiver bug, toda query quebra
- Mitigação: testes de integração cobrem o pool pattern

## Evolução Futura

- Connection pool sizing automático baseado em carga
- Read replicas para queries pesadas (analytics, ranking)
