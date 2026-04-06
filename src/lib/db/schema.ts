import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json, uniqueIndex, primaryKey, index } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  password: varchar("password", { length: 255 }).default(""),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionPlan: mysqlEnum("subscriptionPlan", ["FREE", "BASIC", "PREMIUM", "FAMILY"]).default("FREE"),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "trialing"]).default("active"),
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const series = mysqlTable("series", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  totalSeasons: int("totalSeasons").default(50),
  totalEpisodes: int("totalEpisodes").default(500),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Series = typeof series.$inferSelect;
export type InsertSeries = typeof series.$inferInsert;

export const episodes = mysqlTable("episodes", {
  id: int("id").autoincrement().primaryKey(),
  seriesId: int("seriesId").notNull(),
  seasonNumber: int("seasonNumber").notNull(),
  episodeNumber: int("episodeNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: int("duration").default(0),
  videoUrl: varchar("videoUrl", { length: 500 }),
  thumbnail: varchar("thumbnail", { length: 500 }),
  releaseDate: timestamp("releaseDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = typeof episodes.$inferInsert;

export const watchProgress = mysqlTable("watchProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seriesId: int("seriesId").notNull(),
  episodeId: int("episodeId").notNull(),
  seasonNumber: int("seasonNumber").notNull(),
  episodeNumber: int("episodeNumber").notNull(),
  progressSeconds: int("progressSeconds").default(0),
  totalSeconds: int("totalSeconds").default(0),
  isCompleted: boolean("isCompleted").default(false),
  lastWatchedAt: timestamp("lastWatchedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WatchProgress = typeof watchProgress.$inferSelect;
export type InsertWatchProgress = typeof watchProgress.$inferInsert;

export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seriesId: int("seriesId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

export const chatHistory = mysqlTable("chatHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userMessage: text("userMessage").notNull(),
  botResponse: text("botResponse").notNull(),
  context: json("context"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;

export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  themeMode: mysqlEnum("themeMode", ["kids", "teens", "adults"]).default("kids").notNull(),
  language: varchar("language", { length: 10 }).default("pt-BR"),
  notificationsEnabled: boolean("notificationsEnabled").default(true),
  autoPlayEnabled: boolean("autoPlayEnabled").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

export const interactiveDecisions = mysqlTable("interactiveDecisions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: int("episodeId").notNull(),
  seriesId: int("seriesId").notNull(),
  choiceId: varchar("choiceId", { length: 100 }).notNull(),
  choiceLabel: varchar("choiceLabel", { length: 255 }).notNull(),
  narrativeResponse: text("narrativeResponse"),
  graphState: json("graphState"),
  decisionPath: json("decisionPath"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InteractiveDecision = typeof interactiveDecisions.$inferSelect;
export type InsertInteractiveDecision = typeof interactiveDecisions.$inferInsert;

export interface UserProfileAgentHistoryEntry {
  agentId: string;
  archetype: string;
  dimensao: string;
  choiceId: string;
  choiceLabel: string;
  dimensaoEmocional: number;
  dimensaoIntelectual: number;
  dimensaoMoral: number;
  backtrackingApplied: boolean;
  timestamp: string;
}

export const userProfile = mysqlTable("userProfile", {
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }).primaryKey(),
  dimensaoEmocional: int("dimensaoEmocional").notNull().default(0),
  dimensaoIntelectual: int("dimensaoIntelectual").notNull().default(0),
  dimensaoMoral: int("dimensaoMoral").notNull().default(0),
  agentHistory: json("agentHistory").$type<UserProfileAgentHistoryEntry[]>().notNull().default([]),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type InsertUserProfile = typeof userProfile.$inferInsert;

export const AI_KNOWLEDGE_LEVELS = ["leigo", "intermediario", "avancado"] as const;
export const AGE_GROUPS = ["kids-4-6", "kids-7-9", "kids-10-12", "teens-13", "adults-18", "all-ages"] as const;
export const TRACKS = ["tech", "science", "arts", "math", "philosophy"] as const;
export const PILLARS = ["autonomy", "curiosity", "creativity", "critical-thinking"] as const;

export type AiKnowledgeLevel = (typeof AI_KNOWLEDGE_LEVELS)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type TrackId = (typeof TRACKS)[number];
export type PillarId = (typeof PILLARS)[number];

export const explorers = mysqlTable(
  "explorers",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    aiKnowledgeLevel: mysqlEnum("ai_knowledge_level", AI_KNOWLEDGE_LEVELS).notNull().default("leigo"),
    ageGroup: mysqlEnum("age_group", AGE_GROUPS).notNull().default("all-ages"),
    track: mysqlEnum("track", TRACKS).notNull().default("tech"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("explorers_email_uq").on(table.email),
  }),
);

export type Explorer = typeof explorers.$inferSelect;
export type NewExplorer = typeof explorers.$inferInsert;

export const explorerProgress = mysqlTable(
  "explorer_progress",
  {
    explorerId: int("explorer_id").notNull().references(() => explorers.id, { onDelete: "cascade", onUpdate: "cascade" }),
    contentId: varchar("content_id", { length: 100 }).notNull(),
    track: mysqlEnum("track", TRACKS).notNull(),
    watchedPercentage: int("watched_percentage").notNull().default(0),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    progressPk: primaryKey({ columns: [table.explorerId, table.contentId] }),
  }),
);

export type ExplorerProgress = typeof explorerProgress.$inferSelect;
export type NewExplorerProgress = typeof explorerProgress.$inferInsert;

export const explorerDecisions = mysqlTable("explorer_decisions", {
  id: int("id").autoincrement().primaryKey(),
  explorerId: int("explorer_id").notNull().references(() => explorers.id, { onDelete: "cascade", onUpdate: "cascade" }),
  contentId: varchar("content_id", { length: 100 }).notNull(),
  track: mysqlEnum("track", TRACKS).notNull(),
  pillars: json("pillars").$type<PillarId[]>().notNull(),
  decisionType: varchar("decision_type", { length: 80 }).notNull(),
  payload: json("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ExplorerDecision = typeof explorerDecisions.$inferSelect;
export type NewExplorerDecision = typeof explorerDecisions.$inferInsert;
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  avatar: varchar("avatar", { length: 20 }).default("blue"),
  ageGroup: mysqlEnum("ageGroup", ["kids-4-6", "kids-7-9", "kids-10-12", "teens-13", "adults-18"]).default("adults-18").notNull(),
  isKids: boolean("isKids").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

export const agentNotes = mysqlTable("agent_notes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("user_id").notNull(),
  agentId: varchar("agent_id", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type AgentNote = typeof agentNotes.$inferSelect;
export type NewAgentNote = typeof agentNotes.$inferInsert;

export const userXp = mysqlTable("user_xp", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("user_id").notNull(),
  xpTotal: int("xp_total").default(0),
  xpThisWeek: int("xp_this_week").default(0),
  streakDays: int("streak_days").default(0),
  lastActivityDate: varchar("last_activity_date", { length: 10 }),
  weekStartDate: varchar("week_start_date", { length: 10 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type UserXp = typeof userXp.$inferSelect;

// ═══════════════════════════════════════════════════════════════════════════════
// FASE 2 — Gamificação, Combinações e Progresso por Agente
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Constantes de domínio ────────────────────────────────────────────────────

export const CATEGORIAS_AGENTE = [
  "fundamentos",
  "linguagens",
  "criacao",
  "inovacao",
  "ferramentas",
  "colaborativos",
] as const;

export const TIPOS_SINERGIA = [
  "amplificacao",   // Os dois agentes somam forças
  "contrabalanco",  // Um equilibra o extremo do outro
  "fusao",          // Juntos criam um conceito novo
  "especializacao", // Um aprofunda o domínio do outro
] as const;

export type CategoriaAgente = (typeof CATEGORIAS_AGENTE)[number];
export type TipoSinergia   = (typeof TIPOS_SINERGIA)[number];

// ─── Requisitos de desbloqueio (JSON tipado) ──────────────────────────────────

export interface RequisitosDesbloqueio {
  xpMinimo?: number;           // XP total necessário
  agentesCompletos?: string[]; // IDs de agentes que precisam estar completos
  badges?: string[];           // Badges necessários
  faseMinima?: number;         // Fase do roadmap mínima (1-4)
}

// ─── 1. agentMetadata — estende all-agents.ts com dados da Fase 2 ─────────────
//
// Relacionamento: 1 agente (all-agents.ts) → 1 agentMetadata (DB)
// Não duplica nome/personalidade — só armazena dados dinâmicos/gamificação.

export const agentMetadata = mysqlTable(
  "agent_metadata",
  {
    agentId: varchar("agent_id", { length: 100 }).primaryKey(),

    // Organização
    temporada:       int("temporada").notNull().default(1),         // 1-4
    ordemNaTemporada: int("ordem_na_temporada").notNull().default(0),
    fase:            int("fase").notNull().default(1),              // 1=MVP, 2=Beta, 3=Early, 4=Full
    categoria:       mysqlEnum("categoria", CATEGORIAS_AGENTE).notNull().default("fundamentos"),
    tags:            json("tags").$type<string[]>().default([]),

    // Gamificação
    dificuldade:         int("dificuldade").notNull().default(1),   // 1-5
    xpPorInteracao:      int("xp_por_interacao").notNull().default(15),
    xpPorConcluir:       int("xp_por_concluir").notNull().default(100),
    bloqueadoPorPadrao:  boolean("bloqueado_por_padrao").notNull().default(false),
    requisitosDesbloqueio: json("requisitos_desbloqueio")
      .$type<RequisitosDesbloqueio>()
      .default({}),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => ({
    idxTemporada: index("idx_agent_temporada").on(t.temporada),
    idxCategoria: index("idx_agent_categoria").on(t.categoria),
    idxFase:      index("idx_agent_fase").on(t.fase),
  }),
);

export type AgentMetadata    = typeof agentMetadata.$inferSelect;
export type NewAgentMetadata = typeof agentMetadata.$inferInsert;

// ─── 2. userAgentProgress — progresso de um usuário com cada agente ───────────
//
// Relacionamento: users (1) → userAgentProgress (N) ← agentMetadata (1)
// Complementa userXp (XP global) com rastreamento fino por agente.

export const userAgentProgress = mysqlTable(
  "user_agent_progress",
  {
    id:      varchar("id", { length: 36 }).primaryKey(),
    userId:  int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    agentId: varchar("agent_id", { length: 100 }).notNull(),

    // Desbloqueio
    desbloqueado:   boolean("desbloqueado").notNull().default(false),
    desbloqueadoEm: timestamp("desbloqueado_em"),

    // Engajamento
    interacoesTotal: int("interacoes_total").notNull().default(0),
    notasTotal:      int("notas_total").notNull().default(0),
    xpGanho:         int("xp_ganho").notNull().default(0),

    // Nível de relacionamento com o agente (0-5 — calculado na app)
    nivelInteracao: int("nivel_interacao").notNull().default(0),

    completadoEm: timestamp("completado_em"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => ({
    // Chave lógica: cada usuário tem 1 registro por agente
    uniqUserAgent:    uniqueIndex("uq_user_agent_progress").on(t.userId, t.agentId),
    // Queries frequentes: "todos os agentes desbloqueados do usuário X"
    idxUserDesbloq:   index("idx_uap_user_desbloqueado").on(t.userId, t.desbloqueado),
    // Queries de admin: "quem mais interagiu com o agente Y"
    idxAgentInteracao: index("idx_uap_agent_interacoes").on(t.agentId, t.interacoesTotal),
  }),
);

export type UserAgentProgress    = typeof userAgentProgress.$inferSelect;
export type NewUserAgentProgress = typeof userAgentProgress.$inferInsert;

// ─── 3. agentCombinations — catálogo de pares de agentes combináveis ──────────
//
// Relacionamento: N:N entre agentes.
// Regra: agentAId < agentBId (ordem lexicográfica) para evitar duplicatas (A,B) = (B,A).
// Essa invariante é GARANTIDA pelo serviço de negócio, não pelo DB.

export const agentCombinations = mysqlTable(
  "agent_combinations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Par de agentes (IDs do all-agents.ts)
    agentAId: varchar("agent_a_id", { length: 100 }).notNull(),
    agentBId: varchar("agent_b_id", { length: 100 }).notNull(),

    // Sinergia
    tipoSinergia:  mysqlEnum("tipo_sinergia", TIPOS_SINERGIA).notNull().default("amplificacao"),
    sinergiaBonus: int("sinergia_bonus").notNull().default(0), // 0-100
    xpBonus:       int("xp_bonus").notNull().default(0),      // XP extra por usar a combo
    descricao:     text("descricao"),                         // "Juntos dominam NLP + Ética"

    // Requisitos para descobrir esta combinação
    requisitosDesbloqueio: json("requisitos_desbloqueio")
      .$type<RequisitosDesbloqueio>()
      .default({}),

    ativa:     boolean("ativa").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    // Garante unicidade do par (A, B) no banco
    uniqPar:      uniqueIndex("uq_combination_par").on(t.agentAId, t.agentBId),
    idxAgentA:    index("idx_comb_agent_a").on(t.agentAId),
    idxAgentB:    index("idx_comb_agent_b").on(t.agentBId),
    idxSinergia:  index("idx_comb_sinergia").on(t.tipoSinergia),
  }),
);

export type AgentCombination    = typeof agentCombinations.$inferSelect;
export type NewAgentCombination = typeof agentCombinations.$inferInsert;

// ─── 4. userCombinations — combinações descobertas pelo usuário ───────────────
//
// Relacionamento: users (1) → userCombinations (N) ← agentCombinations (1)
// Registra QUANDO e QUANTAS VEZES o usuário usou cada combinação.

export const userCombinations = mysqlTable(
  "user_combinations",
  {
    id:            varchar("id", { length: 36 }).primaryKey(),
    userId:        int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    combinationId: varchar("combination_id", { length: 36 }).notNull()
      .references(() => agentCombinations.id, { onDelete: "cascade" }),

    descobertaEm:  timestamp("descoberta_em").notNull().defaultNow(),
    vezesUsada:    int("vezes_usada").notNull().default(1),
    ultimoUsoEm:   timestamp("ultimo_uso_em").defaultNow(),
  },
  (t) => ({
    // Um usuário descobre cada combinação apenas uma vez
    uniqUserCombo: uniqueIndex("uq_user_combination").on(t.userId, t.combinationId),
    // "Todas as combinações do usuário X, ordenadas por uso"
    idxUserUso:    index("idx_uc_user_uso").on(t.userId, t.vezesUsada),
    // "Qual combinação foi mais usada globalmente"
    idxComboUso:   index("idx_uc_combo_uso").on(t.combinationId, t.vezesUsada),
  }),
);

export type UserCombination    = typeof userCombinations.$inferSelect;
export type NewUserCombination = typeof userCombinations.$inferInsert;
