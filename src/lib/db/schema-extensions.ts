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

// ═══════════════════════════════════════════════════════
// MENTE.AI — Gamification: XP, Referrals, Rewards, Fraud
// ═══════════════════════════════════════════════════════

export const xpEvents = mysqlTable(
  "xp_events",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: int("amount").notNull(),
    reason: varchar("reason", { length: 50 }).notNull(),
    agentId: varchar("agent_id", { length: 50 }),
    season: int("season"),
    episode: int("episode"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUser: index("idx_xpe_user").on(t.userId),
    idxUserDate: index("idx_xpe_user_date").on(t.userId, t.createdAt),
    idxReason: index("idx_xpe_reason").on(t.reason),
  }),
);

export type XpEvent = typeof xpEvents.$inferSelect;
export type NewXpEvent = typeof xpEvents.$inferInsert;

export const referrals = mysqlTable(
  "referrals",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    referrerId: int("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    invitedId: int("invited_id").references(() => users.id, { onDelete: "set null" }),
    invitedEmail: varchar("invited_email", { length: 320 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    fingerprint: varchar("fingerprint", { length: 255 }),
    valid: boolean("valid").default(false),
    validatedAt: timestamp("validated_at"),
    validationReason: varchar("validation_reason", { length: 255 }),
    linkCode: varchar("link_code", { length: 20 }).unique(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxReferrer: index("idx_ref_referrer").on(t.referrerId),
    idxInvited: index("idx_ref_invited").on(t.invitedId),
    idxLinkCode: index("idx_ref_link").on(t.linkCode),
    idxValid: index("idx_ref_valid").on(t.valid),
  }),
);

export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;

export const rewards = mysqlTable(
  "rewards",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: int("level").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    code: varchar("code", { length: 100 }),
    claimedAt: timestamp("claimed_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUser: index("idx_rwd_user").on(t.userId),
    idxLevel: index("idx_rwd_level").on(t.level),
  }),
);

export type Reward = typeof rewards.$inferSelect;
export type NewReward = typeof rewards.$inferInsert;

export const fraudLog = mysqlTable(
  "fraud_log",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    reason: varchar("reason", { length: 255 }).notNull(),
    riskScore: int("risk_score").default(0),
    flaggedAt: timestamp("flagged_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUser: index("idx_fl_user").on(t.userId),
    idxScore: index("idx_fl_score").on(t.riskScore),
  }),
);

export type FraudLogEntry = typeof fraudLog.$inferSelect;
export type NewFraudLogEntry = typeof fraudLog.$inferInsert;

// ═══════════════════════════════════════════════════════
// MENTE.AI — Blog: Posts, Reads, Parental Controls
// ═══════════════════════════════════════════════════════

export const blogPosts = mysqlTable(
  "blog_posts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    summary: varchar("summary", { length: 500 }),
    content: text("content").notNull(),
    openingScene: text("opening_scene"),
    category: varchar("category", { length: 100 }).notNull(),
    agentId: varchar("agent_id", { length: 50 }),
    agentCommentary: text("agent_commentary"),
    interactivePause: json("interactive_pause").$type<{
      pergunta: string;
      opcoes: [string, string, string];
      continuacoes: [string, string, string];
    }>(),
    ageRating: varchar("age_rating", { length: 10 }).default("all"),
    xpReward: int("xp_reward").default(5),
    whatsappText: text("whatsapp_text"),
    generatedBy: varchar("generated_by", { length: 50 }).default("deepseek"),
    publishedAt: timestamp("published_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    idxSlug: index("idx_bp_slug").on(t.slug),
    idxCategory: index("idx_bp_cat").on(t.category),
    idxPublished: index("idx_bp_pub").on(t.publishedAt),
  }),
);

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export const blogReads = mysqlTable(
  "blog_reads",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    postId: varchar("post_id", { length: 36 }).notNull(),
    completed: boolean("completed").default(false),
    choiceMade: varchar("choice_made", { length: 1 }),
    xpAwarded: int("xp_awarded").default(0),
    readAt: timestamp("read_at").defaultNow().notNull(),
  },
  (t) => ({
    idxUserPost: uniqueIndex("idx_br_user_post").on(t.userId, t.postId),
    idxUser: index("idx_br_user").on(t.userId),
  }),
);

export type BlogRead = typeof blogReads.$inferSelect;

export const parentControls = mysqlTable(
  "parent_controls",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    parentId: int("parent_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    childId: int("child_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    timeLimitMinutes: int("time_limit_minutes").default(60),
    allowedCategories: json("allowed_categories").$type<string[]>().default([]),
    pin: varchar("pin", { length: 6 }),
    weeklyReport: boolean("weekly_report").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqParentChild: uniqueIndex("idx_pc_pair").on(t.parentId, t.childId),
  }),
);

export type ParentControl = typeof parentControls.$inferSelect;
export type NewParentControl = typeof parentControls.$inferInsert;
