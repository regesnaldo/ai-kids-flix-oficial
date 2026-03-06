import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { series, episodes, watchProgress, favorites, chatHistory, userPreferences, interactiveDecisions, InsertWatchProgress, InsertFavorite, InsertChatHistory, InsertInteractiveDecision } from "../drizzle/schema";

/**
 * Series queries
 */
export async function getAllSeries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(series);
}

export async function getSeriesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(series).where(eq(series.category, category));
}

export async function getSeriesById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(series).where(eq(series.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Episodes queries
 */
export async function getEpisodesBySeriesAndSeason(seriesId: number, seasonNumber: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(episodes)
    .where(and(eq(episodes.seriesId, seriesId), eq(episodes.seasonNumber, seasonNumber)));
}

export async function getEpisodeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(episodes).where(eq(episodes.id, id)).limit(1);
  return result[0] || null;
}

export async function getEpisodesBySeriesId(seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(episodes).where(eq(episodes.seriesId, seriesId));
}

/**
 * Watch Progress queries
 */
export async function getUserWatchProgress(userId: number, seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(watchProgress)
    .where(and(eq(watchProgress.userId, userId), eq(watchProgress.seriesId, seriesId)));
}

export async function getEpisodeProgress(userId: number, episodeId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(watchProgress)
    .where(and(eq(watchProgress.userId, userId), eq(watchProgress.episodeId, episodeId)))
    .limit(1);
  return result[0] || null;
}

export async function updateWatchProgress(data: InsertWatchProgress) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await getEpisodeProgress(data.userId, data.episodeId);
  
  if (existing) {
    await db
      .update(watchProgress)
      .set(data)
      .where(eq(watchProgress.id, existing.id));
    return existing.id;
  } else {
    await db.insert(watchProgress).values(data);
    return 1;
  }
}

export async function getContinueWatching(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(watchProgress)
    .where(and(eq(watchProgress.userId, userId), eq(watchProgress.isCompleted, false)))
    .orderBy((t) => t.lastWatchedAt)
    .limit(limit);
}

/**
 * Favorites queries
 */
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function isFavorite(userId: number, seriesId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.seriesId, seriesId)))
    .limit(1);
  return result.length > 0;
}

export async function addToFavorites(data: InsertFavorite) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(favorites).values(data);
  return 1;
}

export async function removeFromFavorites(userId: number, seriesId: number) {
  const db = await getDb();
  if (!db) return false;
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.seriesId, seriesId)));
  return true;
}

/**
 * Chat History queries
 */
export async function saveChatMessage(data: InsertChatHistory) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(chatHistory).values(data);
  return 1;
}

export async function getUserChatHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(chatHistory)
    .where(eq(chatHistory.userId, userId))
    .orderBy((t) => t.createdAt)
    .limit(limit);
}

/**
 * User Preferences queries
 */
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function updateUserPreferences(userId: number, data: Partial<typeof userPreferences.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await getUserPreferences(userId);
  
  if (existing) {
    await db
      .update(userPreferences)
      .set(data)
      .where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({
      userId,
      ...data,
    });
  }
  
  return getUserPreferences(userId);
}

/**
 * Interactive Decisions queries (LangGraph)
 */
export async function saveInteractiveDecision(data: InsertInteractiveDecision) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(interactiveDecisions).values(data);
  return 1;
}

export async function getUserDecisionsForEpisode(userId: number, episodeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(interactiveDecisions)
    .where(and(eq(interactiveDecisions.userId, userId), eq(interactiveDecisions.episodeId, episodeId)))
    .orderBy(desc(interactiveDecisions.createdAt));
}

export async function getUserDecisionsForSeries(userId: number, seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(interactiveDecisions)
    .where(and(eq(interactiveDecisions.userId, userId), eq(interactiveDecisions.seriesId, seriesId)))
    .orderBy(desc(interactiveDecisions.createdAt));
}

export async function getDecisionPath(userId: number, seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(interactiveDecisions)
    .where(and(eq(interactiveDecisions.userId, userId), eq(interactiveDecisions.seriesId, seriesId)))
    .orderBy(interactiveDecisions.createdAt);
}

/**
 * Admin: Update episode video URL
 */
export async function updateEpisodeVideoUrl(episodeId: number, videoUrl: string) {
  const db = await getDb();
  if (!db) return null;
  await db.update(episodes).set({ videoUrl }).where(eq(episodes.id, episodeId));
  return getEpisodeById(episodeId);
}

/**
 * Admin: Get all episodes with series info for admin panel
 */
export async function getAllEpisodesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(episodes).orderBy(episodes.seriesId, episodes.seasonNumber, episodes.episodeNumber);
}

/**
 * Recommendation: Get all watch progress for a user
 */
export async function getAllUserWatchProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(watchProgress)
    .where(eq(watchProgress.userId, userId))
    .orderBy(desc(watchProgress.lastWatchedAt));
}

/**
 * Recommendation: Get all user decisions
 */
export async function getAllUserDecisions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(interactiveDecisions)
    .where(eq(interactiveDecisions.userId, userId))
    .orderBy(desc(interactiveDecisions.createdAt));
}


/**
 * Watch History queries - returns all watched episodes with episode details
 */
export async function getWatchHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      episodeId: watchProgress.episodeId,
      episodeTitle: episodes.title,
      episodeNumber: episodes.episodeNumber,
      seasonNumber: episodes.seasonNumber,
      seriesTitle: series.title,
      progressSeconds: watchProgress.progressSeconds,
      totalSeconds: watchProgress.totalSeconds,
      isCompleted: watchProgress.isCompleted,
      lastWatchedDate: watchProgress.lastWatchedAt,
    })
    .from(watchProgress)
    .innerJoin(episodes, eq(watchProgress.episodeId, episodes.id))
    .innerJoin(series, eq(episodes.seriesId, series.id))
    .where(eq(watchProgress.userId, userId))
    .orderBy((t) => t.lastWatchedDate)
    .limit(100);
  
  return result.map(item => ({
    ...item,
    progressPercentage: (item.totalSeconds ?? 0) > 0 
      ? Math.round(((item.progressSeconds ?? 0) / (item.totalSeconds ?? 1)) * 100)
      : 0,
  }));
}
