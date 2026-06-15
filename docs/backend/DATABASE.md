# 🗄️ Banco de Dados — MENTE.AI

> **Tudo sobre como o MENTE.AI armazena, consulta e evolui dados.**  
> Stack: TiDB Cloud (MySQL) + Drizzle ORM + mysql2

---

## 🏗️ ARQUITETURA DE BANCO

### Visão geral

```
┌─────────────────────────────────────────┐
│           VERCEL (gru1 — SP)             │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │ API Route │  │ API Route │  ...      │
│  │ (chat)    │  │ (auth)    │           │
│  └─────┬─────┘  └─────┬─────┘           │
│        │              │                  │
│        └──────┬───────┘                  │
│               │                          │
│        ┌──────▼──────┐                   │
│        │  Lazy Pool   │                   │
│        │  (Proxy)     │                   │
│        └──────┬──────┘                   │
└───────────────┼──────────────────────────┘
                │ TLS (MySQL wire protocol)
┌───────────────▼──────────────────────────┐
│          TiDB Cloud (gru1)               │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │         TiDB Serverless          │   │
│  │  (compute + storage separados)    │   │
│  │  Auto-scaling horizontal          │   │
│  │  5GB free tier                    │   │
│  └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

### Por que TiDB?

- **MySQL wire protocol** — qualquer driver MySQL funciona sem adaptação
- **Serverless-native** — separa compute de storage, ideal para Vercel
- **Mesma região (gru1)** — latência < 5ms entre API e banco
- **Auto-scaling** — escala horizontalmente sem intervenção
- **Free tier** — 5GB + 50M Request Units/mês gratuitos para MVP

---

## 🔌 DRIZZLE ORM — PADRÕES

### Lazy Singleton Pool (`src/lib/db/index.ts`)

O pool de conexões NÃO é criado no `import`. Ele é criado apenas na primeira query.

```typescript
// Estado lazy — undefined até o primeiro uso
let _pool: any;
let _db: any;

function getPool(): mysql.Pool {
  if (_pool) return _pool;
  _pool = mysql.createPool(normalizeDatabaseUrl(process.env.DATABASE_URL!));
  return _pool;
}

// Proxy mantém API inalterada: import { db } from "@/lib/db"
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const instance = getDbInstance();
    return (instance as any)[prop];
  },
});
```

**Por que isso importa:** Em serverless, cada cold start acorda uma função. Se o pool fosse criado no `import`, TODA função criaria conexão MySQL — mesmo as que não usam banco (ex: página estática). Com lazy pool, só rotas que efetivamente fazem query consomem conexão.

### Schema (`src/lib/db/schema.ts`)

Todas as definições de tabela em **um único arquivo**. Não há migrations soltas ou schemas espalhados.

```typescript
import { mysqlTable, varchar, int, text, timestamp, json, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  senhaHash: varchar("senha_hash", { length: 255 }).notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
});

// Tipos TypeScript gerados automaticamente
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

---

## 📊 MAPA DE TABELAS

### Tabelas de Usuário e Autenticação

| Tabela | Função | Campos principais |
|--------|--------|-------------------|
| `users` | Contas de usuário | id, email, nome, senhaHash, criadoEm |
| `profiles` | Perfil do usuário no metaverso | userId, avatarShape, avatarColor, auraColor, auraIntensity |

### Tabelas de Conteúdo e Narrativa

| Tabela | Função | Campos principais |
|--------|--------|-------------------|
| `series` | Séries/temporadas (ex: S01 — O Início de Tudo) | id, titulo, descricao, agenteId, fase |
| `episodes` | Episódios dentro de uma série | id, serieId, titulo, duracao, ordem |
| `explorers` | Trilhas de exploração (tech, science, arts...) | id, titulo, trilha, faixaEtaria |
| `explorerProgress` | Progresso do usuário nas trilhas | userId, explorerId, completado |
| `explorerDecisions` | Decisões tomadas em trilhas interativas | userId, explorerId, decisao, consequencia |

### Tabelas de Memória e Cognição

| Tabela | Função | Campos principais |
|--------|--------|-------------------|
| `chatHistory` | Histórico de conversas com agentes | userId, agentId, mensagem, resposta, timestamp |
| `userPreferences` | Preferências e perfil cognitivo | userId, preferencias (JSON), estiloAprendizado |
| `interactiveDecisions` | Decisões narrativas do usuário | userId, agenteId, decisao, contexto, timestamp |
| `agentNotes` | Notas e memórias por agente | userId, agentId, nota, pesoEmocional |
| `userAgentProgress` | Progresso com cada agente | userId, agentId, interacoes, nivelRelacionamento |

### Tabelas de Gamificação

| Tabela | Função | Campos principais |
|--------|--------|-------------------|
| `userXp` | Experiência acumulada | userId, xpTotal, streak, ultimaAtividade |
| `favorites` | Conteúdo favoritado | userId, tipo (serie/episodio/agente), itemId |
| `watchProgress` | Progresso em episódios | userId, episodeId, progressoSegundos, concluido |

### Tabelas de Sistema

| Tabela | Função | Campos principais |
|--------|--------|-------------------|
| `agentMetadata` | Metadados dos agentes canônicos | agenteId, dimensao, cor, voiceId, visualPrompt |
| `agentCombinations` | Combinações entre agentes | agente1Id, agente2Id, sinergia, conflito |
| `userCombinations` | Combinações desbloqueadas pelo usuário | userId, combinationId, desbloqueadoEm |

---

## 🔄 ESTRATÉGIA DE MIGRATIONS

### Ferramenta: `drizzle-kit`

```bash
# 1. Editar src/lib/db/schema.ts
# 2. Gerar migration SQL
npx drizzle-kit generate

# 3. Aplicar migration
npx drizzle-kit migrate

# SQL gerado é puro e revisável:
# migrations/0000_round_black_widow.sql
# ALTER TABLE users ADD COLUMN avatar_shape VARCHAR(50);
```

### Regras de migration

1. **NUNCA editar migration SQL gerada manualmente** — se precisar de algo diferente, edite o `schema.ts` e gere novamente
2. **Uma migration por mudança de schema** — não agrupe alterações não relacionadas
3. **Testar em staging antes de produção** — TiDB Serverless tem staging gratuito
4. **Backup antes de migration destrutiva** — `mysqldump` da instância TiDB

### Problema conhecido: WSL + esbuild

No WSL, o `drizzle-kit` pode falhar com erro de platform mismatch (`@esbuild/win32-x64` vs `@esbuild/linux-x64`).

```bash
# Solução:
npm install @esbuild/linux-x64
npx drizzle-kit generate  # agora funciona
```

---

## ⚡ PADRÕES DE QUERY

### Select com tipo inferido

```typescript
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Tipo do resultado é inferido: { id: number; email: string; ... }
const user = await db.select()
  .from(users)
  .where(eq(users.email, "usuario@email.com"))
  .limit(1);

// user[0]?.id → number (type-safe!)
```

### Insert com retorno

```typescript
const result = await db.insert(users)
  .values({ email: "novo@email.com", nome: "Novo Usuario", senhaHash: hash })
  .returning({ insertedId: users.id });

// result[0].insertedId → number
```

### Update condicional

```typescript
await db.update(users)
  .set({ nome: "Nome Atualizado" })
  .where(eq(users.id, userId));
```

### Transações (quando necessário)

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({...}).returning();
  await tx.insert(profiles).values({ userId: user.id, ... });
  // Se qualquer query falhar → rollback automático
});
```

---

## 🚀 PERFORMANCE

### Estratégias atuais

| Estratégia | Onde | Impacto |
|-----------|------|---------|
| Lazy pool | `db/index.ts` | Economiza conexões em cold starts |
| Prepared statements | Drizzle internamente | Evita re-parse de SQL |
| Índices implícitos | PKs e FKs no schema | Busca por ID é O(1) |
| Limit em queries de chat | `chatHistory` | Evita carregar histórico infinito |
| TTL em memórias | `agentNotes` | Limpeza automática de dados antigos |

### Gargalos conhecidos

| Gargalo | Causa | Mitigação |
|---------|-------|-----------|
| Cold start + primeira query | Lazy pool inicializa mysql2 | Inevitável, mas ~200ms é aceitável |
| Muitas conexões simultâneas | Vercel escala funções | TiDB auto-scaling absorve |
| Chat history grande | Usuário com muitas mensagens | Limit 100 por query + paginação |

---

## 🔮 PLANOS FUTUROS: EMBEDDINGS E VETORES

### Por que migrar de TF-IDF para embeddings?

- TF-IDF não captura semântica profunda ("estou pra baixo" ≠ "tristeza")
- Embeddings resolvem isso com similaridade real de significado

### Estratégia de migração (futuro)

```
Fase 1: Tabela de embeddings
  → Adicionar coluna embedding (VECTOR ou JSON) em agentNotes
  → Armazenar embedding de cada memória (text-embedding-3-small)

Fase 2: Busca híbrida
  → TF-IDF + Embeddings em paralelo
  → Merge results por weighted score
  → A/B test: precisão do contexto injetado

Fase 3: Embeddings como primário
  → Descontinuar TF-IDF quando embeddings provarem superioridade
  → Manter TF-IDF como fallback para cold path
```

### Não usar agora porque...

- Custo: $0.02/1M tokens × N usuários × M memórias
- Latência: +200ms por chamada de API de embedding
- Complexidade: exige caching de embeddings, re-indexação periódica
- MVP: TF-IDF resolve 85% dos casos com custo zero

---

## 📋 CHECKLIST DE BANCO (ANTES DE DEPLOY)

- [ ] `DATABASE_URL` configurado no Vercel (com TLS)
- [ ] `npm run typecheck` passa (Drizzle infere tipos)
- [ ] `npx drizzle-kit generate` não gera migrations novas (schema estável)
- [ ] Lazy pool testado em cold start
- [ ] Rate limiting nas rotas que tocam o banco
- [ ] Backup schedule configurado no TiDB Cloud

---

> *"Um banco de dados bem modelado não é o que armazena mais dados — é o que torna os dados mais úteis com menos consultas."*
