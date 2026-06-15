import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { users } from "./schema";

// ═══════════════════════════════════════════════════════════════════════════════
// FASE 2 — Motor de Narrativa Adaptativa
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. userProfile — O Retrato Falado da Criança ────────────────────────────
// Relacionamento: users (1) → userProfile (1)
// Armazena as dimensões emocionais, intelectuais e morais do usuário,
// construídas a partir das escolhas durante a jornada narrativa.

export const userProfile = mysqlTable(
  "user_profile",
  {
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Dimensões de personalidade (0.0 - 1.0)
    emotionalDim: decimal("emotional_dim", { precision: 3, scale: 2 })
      .notNull()
      .default("0.50"), // curiosidade / medo / rebeldia
    intellectualDim: decimal("intellectual_dim", { precision: 3, scale: 2 })
      .notNull()
      .default("0.50"), // lógico vs intuitivo
    moralDim: decimal("moral_dim", { precision: 3, scale: 2 })
      .notNull()
      .default("0.50"), // protegeu humanidade vs expandiu IA

    // Rótulo derivado (ex: "O Estrategista", "O Rebelde")
    archetypeLabel: varchar("archetype_label", { length: 64 }),

    // Último universo/agente visitado
    lastAgentId: varchar("last_agent_id", { length: 100 }),

    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (t) => ({
    // Um perfil por usuário
    uniqUser: uniqueIndex("uq_up_user").on(t.userId),
  }),
);

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;

// ─── 2. interactiveDecisions — O Histórico de Escolhas ────────────────────────
// Relacionamento: users (1) → interactiveDecisions (N)
// Registro cronológico de cada escolha feita pelo usuário durante a narrativa.

export const narrativeDecisions = mysqlTable(
  "narrative_decisions",
  {
    id: int("id").autoincrement().primaryKey(),

    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    episodeId: varchar("episode_id", { length: 100 }),
    agentId: varchar("agent_id", { length: 100 }),

    choiceId: varchar("choice_id", { length: 100 }).notNull(),
    choiceLabel: varchar("choice_label", { length: 255 }).notNull(),

    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (t) => ({
    idxUser: index("idx_nd_user").on(t.userId),
    idxUserEpisode: index("idx_nd_user_episode").on(t.userId, t.episodeId),
  }),
);

export type NarrativeDecision = typeof narrativeDecisions.$inferSelect;
export type NewNarrativeDecision = typeof narrativeDecisions.$inferInsert;

// ─── 3. universeTransitions — O Mapa de Portais Atravessados ─────────────────
// Relacionamento: users (1) → universeTransitions (N)
// Registra cada transição de um agente/universo para outro,
// documentando o motivo da mudança (estagnação, decisão do roteador, etc.).

export const universeTransitions = mysqlTable(
  "universe_transitions",
  {
    id: int("id").autoincrement().primaryKey(),

    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    fromAgent: varchar("from_agent", { length: 100 }).notNull(),
    toAgent: varchar("to_agent", { length: 100 }).notNull(),

    reason: text("reason"), // ex: "stagnation", "router_decision"

    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (t) => ({
    idxUser: index("idx_ut_user").on(t.userId),
    idxUserFrom: index("idx_ut_user_from").on(t.userId, t.fromAgent),
    idxUserTo: index("idx_ut_user_to").on(t.userId, t.toAgent),
  }),
);

export type UniverseTransition = typeof universeTransitions.$inferSelect;
export type NewUniverseTransition = typeof universeTransitions.$inferInsert;
