/**
 * ═══════════════════════════════════════════════════════
 * MENTE.AI — Schema Extensions: Netflix Personalization
 * ═══════════════════════════════════════════════════════
 *
 * Extends the existing schema with:
 * - Content metadata (tags, genres, match score)
 * - Thumbnail variants for A/B testing
 * - Thumbnail performance tracking (A/B testing)
 * - User interactions (views, clicks, skips)
 */

import {
  int, mysqlEnum, mysqlTable, text, varchar, boolean,
  decimal, json, uniqueIndex, index, timestamp,
} from "drizzle-orm/mysql-core";
import { users, series } from "./schema";

// ═══════════════════════════════════════════════════════
// content_metadata — Metadados ricos para personalização
// ═══════════════════════════════════════════════════════

export const contentMetadata = mysqlTable(
  "content_metadata",
  {
    id: int("id").autoincrement().primaryKey(),
    seriesId: int("series_id").notNull(),

    // Personalização
    matchBaseScore: decimal("match_base_score", { precision: 5, scale: 2 }).default("50"),
    maturityRating: varchar("maturity_rating", { length: 10 }).default("L"),
    difficulty: int("difficulty").default(1),

    // Tags e gêneros para motor de recomendação
    tags: json("tags").$type<string[]>().default([]),
    genres: json("genres").$type<string[]>().default([]),
    moods: json("moods").$type<string[]>().default([]),

    // Agentes principais envolvidos
    primaryAgents: json("primary_agents").$type<string[]>().default([]),
    secondaryAgents: json("secondary_agents").$type<string[]>().default([]),

    // Métricas de engajamento
    avgCompletionRate: decimal("avg_completion_rate", { precision: 5, scale: 2 }).default("0"),
    avgRating: decimal("avg_rating", { precision: 3, scale: 1 }).default("0"),
    totalInteractions: int("total_interactions").default(0),
    trendScore: decimal("trend_score", { precision: 5, scale: 2 }).default("0"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    idxSeries: index("idx_cm_series").on(t.seriesId),
    idxTags: index("idx_cm_tags").on(t.tags),
    idxMatch: index("idx_cm_match").on(t.matchBaseScore),
  }),
);

export type ContentMetadata = typeof contentMetadata.$inferSelect;
export type NewContentMetadata = typeof contentMetadata.$inferInsert;

// ═══════════════════════════════════════════════════════
// thumbnail_variants — Variantes de imagem para A/B testing
// ═══════════════════════════════════════════════════════

export const thumbnailVariants = mysqlTable(
  "thumbnail_variants",
  {
    id: int("id").autoincrement().primaryKey(),
    seriesId: int("series_id").notNull(),

    // Tipo de thumbnail
    variantName: varchar("variant_name", { length: 50 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),

    // Segmento-alvo (null = todos)
    segment: varchar("segment", { length: 50 }),
    ageGroup: varchar("age_group", { length: 20 }),

    // Métricas de performance (calculadas pelo job)
    impressions: int("impressions").default(0),
    clicks: int("clicks").default(0),
    ctr: decimal("ctr", { precision: 5, scale: 2 }).default("0"),

    // Status
    isActive: boolean("is_active").default(true),
    isWinner: boolean("is_winner").default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    idxSeries: index("idx_tv_series").on(t.seriesId),
    idxSegment: index("idx_tv_segment").on(t.segment),
    idxWinner: index("idx_tv_winner").on(t.isWinner),
  }),
);

export type ThumbnailVariant = typeof thumbnailVariants.$inferSelect;
export type NewThumbnailVariant = typeof thumbnailVariants.$inferInsert;

// ═══════════════════════════════════════════════════════
// ab_test_experiments — Controle de experimentos A/B
// ═══════════════════════════════════════════════════════

export const abTestExperiments = mysqlTable(
  "ab_test_experiments",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),

    // Tipo de teste
    testType: mysqlEnum("test_type", ["thumbnail", "title", "description", "layout"]).notNull(),
    seriesId: int("series_id"),

    // Configuração
    startDate: timestamp("start_date").defaultNow().notNull(),
    endDate: timestamp("end_date"),
    minSampleSize: int("min_sample_size").default(1000),
    confidenceLevel: decimal("confidence_level", { precision: 4, scale: 2 }).default("95"),

    // Resultado
    status: mysqlEnum("status", ["running", "completed", "paused"]).default("running"),
    winnerVariant: varchar("winner_variant", { length: 50 }),
    significance: decimal("significance", { precision: 5, scale: 2 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxStatus: index("idx_ab_status").on(t.status),
    idxType: index("idx_ab_type").on(t.testType),
  }),
);

export type AbTestExperiment = typeof abTestExperiments.$inferSelect;
export type NewAbTestExperiment = typeof abTestExperiments.$inferInsert;

// ═══════════════════════════════════════════════════════
// user_interactions — Rastreamento de interações
// ═══════════════════════════════════════════════════════

export const userInteractions = mysqlTable(
  "user_interactions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    seriesId: int("series_id").notNull(),

    // Tipo de interação
    interactionType: mysqlEnum("interaction_type", [
      "impression",    // Thumbnail foi exibida
      "click",         // Usuário clicou
      "play",          // Iniciou reprodução
      "pause",         // Pausou
      "complete",      // Assistiu até o fim
      "skip",          // Pulou após < 30s
      "bookmark",      // Salvou na lista
      "share",         // Compartilhou
      "rate",          // Avaliou
      "search",        // Veio de busca
    ]).notNull(),

    // Contexto
    thumbnailVariantId: int("thumbnail_variant_id"),
    source: varchar("source", { length: 50 }),
    rowContext: varchar("row_context", { length: 100 }),
    watchTimeSeconds: int("watch_time_seconds").default(0),
    rating: int("rating"),

    // Dispositivo
    deviceType: mysqlEnum("device_type", ["desktop", "mobile", "tablet", "tv"]),
    userAgent: varchar("user_agent", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUser: index("idx_ui_user").on(t.userId),
    idxSeries: index("idx_ui_series").on(t.seriesId),
    idxType: index("idx_ui_type").on(t.interactionType),
    idxThumbnail: index("idx_ui_thumbnail").on(t.thumbnailVariantId),
    // Query: "todas as interações do usuário X nos últimos 30 dias"
    idxUserDate: index("idx_ui_user_date").on(t.userId, t.createdAt),
  }),
);

export type UserInteraction = typeof userInteractions.$inferSelect;
export type NewUserInteraction = typeof userInteractions.$inferInsert;
