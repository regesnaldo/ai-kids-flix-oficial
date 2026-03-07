import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json, uniqueIndex, primaryKey } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Stripe integration fields
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionPlan: mysqlEnum("subscriptionPlan", ["BASIC", "PREMIUM", "FAMILY"]),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "trialing"]),
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Series/Shows table for Netflix-style content
 */
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

/**
 * Episodes table for individual episodes within seasons
 */
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

/**
 * User watch progress table
 */
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

/**
 * User favorites table
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seriesId: int("seriesId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Chat history for ChatBot interactions
 */
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

/**
 * User preferences and settings
 */
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

/**
 * Interactive decisions table - LangGraph state tracking
 * Stores user choices after episodes and AI-generated narrative branches
 */
export const interactiveDecisions = mysqlTable("interactiveDecisions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  episodeId: int("episodeId").notNull(),
  seriesId: int("seriesId").notNull(),
  /** The choice the user selected (e.g. "cooperate", "confront", "investigate") */
  choiceId: varchar("choiceId", { length: 100 }).notNull(),
  choiceLabel: varchar("choiceLabel", { length: 255 }).notNull(),
  /** AI-generated narrative response to the choice */
  narrativeResponse: text("narrativeResponse"),
  /** JSON state of the LangGraph decision tree */
  graphState: json("graphState"),
  /** Accumulated path of decisions in this series */
  decisionPath: json("decisionPath"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InteractiveDecision = typeof interactiveDecisions.$inferSelect;
export type InsertInteractiveDecision = typeof interactiveDecisions.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSE CORE — Tabelas do sistema de exploração AI Kids Flix
// Adicionadas em: 2026-03-04
// NÃO conflitam com users, watchProgress ou interactiveDecisions existentes
// ─────────────────────────────────────────────────────────────────────────────

export const AI_KNOWLEDGE_LEVELS = ["leigo", "intermediario", "avancado"] as const;
export const AGE_GROUPS = [
  "kids-4-6",
  "kids-7-9",
  "kids-10-12",
  "teens-13",
  "adults-18",
  "all-ages",
] as const;
export const TRACKS = ["tech", "science", "arts", "math", "philosophy"] as const;
export const PILLARS = ["autonomy", "curiosity", "creativity", "critical-thinking"] as const;

export type AiKnowledgeLevel = (typeof AI_KNOWLEDGE_LEVELS)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type TrackId = (typeof TRACKS)[number];
export type PillarId = (typeof PILLARS)[number];

/**
 * Perfil do Explorador — identidade no universo AI Kids Flix
 * Separado de `users` (auth) para permitir múltiplos perfis por conta
 */
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

/**
 * Progresso do Explorador por conteúdo
 * Separado de `watchProgress` (que rastreia por userId/episodeId numérico)
 */
export const explorerProgress = mysqlTable(
  "explorer_progress",
  {
    explorerId: int("explorer_id")
      .notNull()
      .references(() => explorers.id, { onDelete: "cascade", onUpdate: "cascade" }),
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

/**
 * Decisões do Explorador — registro de escolhas narrativas
 * Separado de `interactiveDecisions` (que usa userId/episodeId numérico + LangGraph)
 */
export const explorerDecisions = mysqlTable("explorer_decisions", {
  id: int("id").autoincrement().primaryKey(),
  explorerId: int("explorer_id")
    .notNull()
    .references(() => explorers.id, { onDelete: "cascade", onUpdate: "cascade" }),
  contentId: varchar("content_id", { length: 100 }).notNull(),
  track: mysqlEnum("track", TRACKS).notNull(),
  pillars: json("pillars").$type<PillarId[]>().notNull(),
  decisionType: varchar("decision_type", { length: 80 }).notNull(),
  payload: json("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ExplorerDecision = typeof explorerDecisions.$inferSelect;
export type NewExplorerDecision = typeof explorerDecisions.$inferInsert;