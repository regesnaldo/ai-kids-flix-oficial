import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json, uniqueIndex, primaryKey, index, float, real } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

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
  avatarShape: varchar("avatar_shape", { length: 20 }).default("humanoid"),
  avatarColor: varchar("avatar_color", { length: 7 }).default("#3B82F6"),
  auraColor: varchar("aura_color", { length: 7 }).default("#60A5FA"),
  auraIntensity: decimal("aura_intensity", { precision: 3, scale: 2 }).default("0.50"),
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
    tags:            json("tags").$type<string[]>().$defaultFn(() => []),

    // Gamificação
    dificuldade:         int("dificuldade").notNull().default(1),   // 1-5
    xpPorInteracao:      int("xp_por_interacao").notNull().default(15),
    xpPorConcluir:       int("xp_por_concluir").notNull().default(100),
    bloqueadoPorPadrao:  boolean("bloqueado_por_padrao").notNull().default(false),
    requisitosDesbloqueio: json("requisitos_desbloqueio")
      .$type<RequisitosDesbloqueio>()
      .$defaultFn(() => ({})),

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
      .$defaultFn(() => ({})),

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

// ═══════════════════════════════════════════════════════════════════════════════
// FASE 3 — Memória Persistente Multi-Agente
// ═══════════════════════════════════════════════════════════════════════════════

export const MEMORY_TYPES = [
  "emotional",   // Memória emocional (ex: "usuário demonstrou empatia com TERRA")
  "factual",     // Fato aprendido (ex: "usuário sabe o que é backpropagation")
  "preference",  // Preferência do usuário (ex: "prefere explicações visuais")
  "narrative",   // Evento narrativo (ex: "NEXUS revelou segredo sobre VOLT")
] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

// ─── agent_memories ───────────────────────────────────────────────────────────
//
// Memória persistente por agente. Cada agente pode armazenar até 200 memórias
// por usuário. Memórias expiram após TTL (padrão 90 dias) e são podadas
// automaticamente por um job de limpeza (cron futuro) ou na leitura.
//
// Relacionamento: users (1) → agent_memories (N) ← agentMetadata (1)

export const agentMemories = mysqlTable(
  "agent_memories",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    userId:  int("user_id").notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    agentId: varchar("agent_id", { length: 100 }).notNull(),

    memoryType: mysqlEnum("memory_type", MEMORY_TYPES).notNull().default("factual"),

    content: text("content").notNull(),

    // Peso emocional (-1.0 a 1.0): negativo = memória negativa, positivo = positiva
    emotionalWeight: decimal("emotional_weight", { precision: 3, scale: 2 }).default("0.00"),

    // Metadados para busca contextual
    tags:     json("tags").$type<string[]>().$defaultFn(() => []),
    contexto: json("contexto").$type<Record<string, unknown>>().$defaultFn(() => ({})),

    // Controle de ciclo de vida
    ttlDays:      int("ttl_days").notNull().default(90),
    expiresAt:    timestamp("expires_at"),
    accessCount:  int("access_count").notNull().default(0),
    lastAccessAt: timestamp("last_access_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    // Queries frequentes: "memórias do usuário X com agente Y"
    idxUserAgent:       index("idx_am_user_agent").on(t.userId, t.agentId),
    // "Memórias emocionais do usuário X"
    idxUserEmotional:   index("idx_am_user_emotional").on(t.userId, t.memoryType),
    // "Memórias que expiram em breve" (para job de limpeza)
    idxExpiresAt:       index("idx_am_expires").on(t.expiresAt),
    // "Top memórias mais acessadas do usuário"
    idxUserAccess:      index("idx_am_user_access").on(t.userId, t.accessCount),
    // Limite de 200 memórias por par (usuário, agente) — via aplicação
  }),
);

export type AgentMemory    = typeof agentMemories.$inferSelect;
export type NewAgentMemory = typeof agentMemories.$inferInsert;

// ═══════════════════════════════════════════════════════════════════════════════
// FOUNDATION FREEZE — Universe Progression
// ═══════════════════════════════════════════════════════════════════════════════

export const universeProgression = mysqlTable(
  "universe_progression",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    userId: int("user_id").notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Planetas completados: ["nexus", "kaos", ...]
    completed: json("completed").$type<string[]>().$defaultFn(() => []),

    // Planeta ativo atual (null = nenhum)
    activePlanet: varchar("active_planet", { length: 50 }),

    // Planetas disponíveis para ativação: ["lyra", ...]
    available: json("available").$type<string[]>().$defaultFn(() => ["nexus"]),

    // Dicas ativas (max 2): [{ id, planetId, text, createdAt }]
    activeHints: json("active_hints").$defaultFn(() => []),

    // Timestamp da última mudança de progressão (cooldown)
    lastProgressionAt: timestamp("last_progression_at").defaultNow(),

    // Total completado (derivado, cache para queries rápidas)
    totalCompleted: int("total_completed").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => ({
    // Um registro por usuário
    uniqUser:  uniqueIndex("uq_up_user").on(t.userId),
    // "Quantos usuários estão ativos no planeta X"
    idxActive: index("idx_up_active_planet").on(t.activePlanet),
  }),
);

export type UniverseProgression    = typeof universeProgression.$inferSelect;
export type NewUniverseProgression = typeof universeProgression.$inferInsert;

// ═══════════════════════════════════════════════════════════════════════════════
// LOGOS — Knowledge Validation
// ═══════════════════════════════════════════════════════════════════════════════

export const logosAttempts = mysqlTable("logos_attempts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  episodeId: varchar("episode_id", { length: 36 }).notNull(),
  agentId: varchar("agent_id", { length: 50 }).notNull(),
  questions: json("questions").notNull(),
  answers: json("answers").notNull(),
  score: int("score").notNull().default(0),
  passed: boolean("passed").notNull().default(false),
  attemptNumber: int("attempt_number").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export type LogosAttempt = typeof logosAttempts.$inferSelect;

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE MODEL — Content Persistence Layer
// ═══════════════════════════════════════════════════════════════════════════════

export const COGNITIVE_LEVELS = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
] as const;
export type CognitiveLevel = (typeof COGNITIVE_LEVELS)[number];

export const ASSET_TYPES = [
  "episode",
  "quiz",
  "video",
  "audio",
  "mission",
  "image",
] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const EDITORIAL_STATUS = [
  "draft",
  "review",
  "approved",
  "published",
] as const;
export type EditorialStatus = (typeof EDITORIAL_STATUS)[number];

export const CONTENT_SOURCE = ["manual", "deepseek", "groq", "hybrid"] as const;
export type ContentSource = (typeof CONTENT_SOURCE)[number];

// ─── knowledge_unit — O ÁTOMO DE CONHECIMENTO ────────────────────────────────
//
// O QUE o usuário aprende. Independente de formato.
// Um conceito pode ser entregue como episódio, vídeo, quiz ou missão.
// Separação: conhecimento ≠ forma de apresentação.

export const knowledgeUnit = mysqlTable(
  "knowledge_unit",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Identidade
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull().unique(),

    // Pedagogia
    learningObjective: text("learning_objective").notNull(),
    cognitiveLevel: mysqlEnum("cognitive_level", COGNITIVE_LEVELS)
      .notNull()
      .default("understand"),
    difficulty: varchar("difficulty", { length: 16 }).default("beginner"),
    estimatedTimeMin: int("estimated_time_min"),
    skills: json("skills").$type<string[]>().$defaultFn(() => []),

    // Curadoria
    tags: json("tags").$type<string[]>().$defaultFn(() => []),
    agentDomain: varchar("agent_domain", { length: 32 }),

    // Metadados
    version: int("version").default(1),
    status: mysqlEnum("status", EDITORIAL_STATUS).default("draft"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (t) => ({
    idxCognitive: index("idx_ku_cognitive").on(t.cognitiveLevel, t.difficulty),
    idxAgent: index("idx_ku_agent").on(t.agentDomain),
    idxStatus: index("idx_ku_status").on(t.status),
  }),
);

export type KnowledgeUnit = typeof knowledgeUnit.$inferSelect;
export type NewKnowledgeUnit = typeof knowledgeUnit.$inferInsert;

// ─── knowledge_asset — A FORMA DE APRESENTAÇÃO ───────────────────────────────
//
// COMO o conhecimento é entregue. Um knowledge_unit pode ter N assets.
// Conteúdo polimórfico por type (episode, quiz, video, audio, mission, image).

export const knowledgeAsset = mysqlTable(
  "knowledge_asset",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    knowledgeUnitId: varchar("knowledge_unit_id", { length: 36 }).notNull(),

    // Posicionamento na série
    agentId: varchar("agent_id", { length: 32 }),
    season: int("season"),
    episode: int("episode"),

    // Tipo de mídia
    type: mysqlEnum("type", ASSET_TYPES).notNull(),

    // Conteúdo polimórfico por type
    content: json("content").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>().$defaultFn(() => ({})),

    // Provenance
    source: mysqlEnum("source", CONTENT_SOURCE).default("manual"),
    generatedBy: varchar("generated_by", { length: 64 }),
    generatedAt: timestamp("generated_at"),

    // Editorial
    version: int("version").default(1),
    status: mysqlEnum("status", EDITORIAL_STATUS).default("draft"),

    // Cache
    cacheKey: varchar("cache_key", { length: 64 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (t) => ({
    idxUnit: index("idx_ka_unit").on(t.knowledgeUnitId),
    idxSeries: index("idx_ka_series").on(t.agentId, t.season, t.episode),
    idxTypeStatus: index("idx_ka_type_status").on(t.type, t.status),
    idxCache: index("idx_ka_cache").on(t.cacheKey),
  }),
);

export type KnowledgeAsset = typeof knowledgeAsset.$inferSelect;
export type NewKnowledgeAsset = typeof knowledgeAsset.$inferInsert;

// ─── knowledge_graph_edge — A TEIA DE DEPENDÊNCIAS ───────────────────────────
//
// Grafo direcionado entre knowledge_units.
// Suporta: prerequisite, next, related, reinforces, expands.

export const GRAPH_RELATIONSHIPS = [
  "prerequisite",
  "next",
  "related",
  "reinforces",
  "expands",
] as const;
export type GraphRelationship = (typeof GRAPH_RELATIONSHIPS)[number];

export const knowledgeGraphEdge = mysqlTable(
  "knowledge_graph_edge",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    fromUnitId: varchar("from_unit_id", { length: 36 }).notNull(),
    toUnitId: varchar("to_unit_id", { length: 36 }).notNull(),
    relationship: mysqlEnum("relationship", GRAPH_RELATIONSHIPS).notNull(),
    weight: real("weight").default(1.0),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    uniqueEdge: uniqueIndex("uq_kge_edge").on(
      t.fromUnitId,
      t.toUnitId,
      t.relationship,
    ),
    idxFrom: index("idx_kge_from").on(t.fromUnitId),
    idxTo: index("idx_kge_to").on(t.toUnitId),
  }),
);

export type KnowledgeGraphEdge = typeof knowledgeGraphEdge.$inferSelect;
export type NewKnowledgeGraphEdge = typeof knowledgeGraphEdge.$inferInsert;
export type NewLogosAttempt = typeof logosAttempts.$inferInsert;
