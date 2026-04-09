import { mysqlTable, varchar, int, text, timestamp, json } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userProfiles = mysqlTable('user_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  emotionalCuriosity: int('emotional_curiosity').default(50).notNull(),
  emotionalFear: int('emotional_fear').default(50).notNull(),
  emotionalRebellion: int('emotional_rebellion').default(50).notNull(),
  emotionalConformism: int('emotional_conformism').default(50).notNull(),
  intellectualLogic: int('intellectual_logic').default(50).notNull(),
  intellectualIntuition: int('intellectual_intuition').default(50).notNull(),
  intellectualData: int('intellectual_data').default(50).notNull(),
  intellectualNarrative: int('intellectual_narrative').default(50).notNull(),
  moralProtection: int('moral_protection').default(50).notNull(),
  moralExpansion: int('moral_expansion').default(50).notNull(),
  archetype: varchar('archetype', { length: 50 }).default('Analítico-Protetor').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userXp = mysqlTable('user_xp', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalXp: int('total_xp').default(0).notNull(),
  currentLevel: int('current_level').default(1).notNull(),
  episodesCompleted: int('episodes_completed').default(0).notNull(),
  completedEpisodes: json('completed_episodes').$type<string[]>().default([]).notNull(),
  currentEpisode: varchar('current_episode', { length: 255 }),
  visitedUniverses: json('visited_universes').$type<string[]>().default([]).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatHistory = mysqlTable('chat_history', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  episodeId: varchar('episode_id', { length: 255 }).notNull(),
  agentId: varchar('agent_id', { length: 255 }).notNull(),
  messages: json('messages').$type<Array<{ role: string; content: string }>>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const interactiveDecisions = mysqlTable('interactive_decisions', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  episodeId: varchar('episode_id', { length: 255 }).notNull(),
  decisionPoint: varchar('decision_point', { length: 255 }).notNull(),
  selectedOption: varchar('selected_option', { length: 255 }).notNull(),
  emotionalImpact: json('emotional_impact').$type<Record<string, number>>(),
  intellectualImpact: json('intellectual_impact').$type<Record<string, number>>(),
  moralImpact: json('moral_impact').$type<Record<string, number>>(),
  xpGained: int('xp_gained').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const globalNarrativeState = mysqlTable('global_narrative_state', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  episodeId: varchar('episode_id', { length: 255 }).notNull(),
  choiceId: varchar('choice_id', { length: 255 }).notNull(),
  choiceLabel: varchar('choice_label', { length: 500 }).notNull(),
  totalVotes: int('total_votes').default(0).notNull(),
  percentage: int('percentage').default(0).notNull(),
  dominantChoice: varchar('dominant_choice', { length: 255 }),
  isActive: int('is_active').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const universePresence = mysqlTable('universe_presence', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  universeId: varchar('universe_id', { length: 255 }).notNull().unique(),
  activeCount: int('active_count').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const collectiveVotes = mysqlTable('collective_votes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  episodeId: varchar('episode_id', { length: 255 }).notNull(),
  choiceId: varchar('choice_id', { length: 255 }).notNull(),
  choiceLabel: varchar('choice_label', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  xp: one(userXp),
  chats: many(chatHistory),
  decisions: many(interactiveDecisions),
  collectiveVotes: many(collectiveVotes),
}));

export const userProfileRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const userXpRelations = relations(userXp, ({ one }) => ({
  user: one(users, { fields: [userXp.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type UserXp = typeof userXp.$inferSelect;
export type ChatHistory = typeof chatHistory.$inferSelect;
export type InteractiveDecision = typeof interactiveDecisions.$inferSelect;
export type GlobalNarrativeState = typeof globalNarrativeState.$inferSelect;
export type UniversePresence = typeof universePresence.$inferSelect;
export type CollectiveVote = typeof collectiveVotes.$inferSelect;