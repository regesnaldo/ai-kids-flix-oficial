/**
 * MENTE.AI — Recommendation Engine
 *
 * Netflix-style personalized ranking based on:
 * - User interaction history (views, skips, completions)
 * - Content metadata (tags, genres, moods)
 * - Thumbnail A/B test winner selection
 * - Trending boost for rising content
 */

import type { ContentMetadata, UserInteraction } from "@/lib/db/schema-extensions";

// ─── Types ──────────────────────────────────────────────

export interface UserProfile {
  userId: number;
  genreWeights: Record<string, number>;
  tagAffinities: Record<string, number>;
  moodPreferences: Record<string, number>;
  avgWatchTime: number;
  skipRate: number;
  completionRate: number;
  preferredDifficulty: number;
  maturityLevel: string;
}

export interface RankedContent {
  seriesId: number;
  score: number;
  matchPercentage: number;
  reason: string;
  thumbnailVariant?: string;
  row: string;
}

// ─── Weights ────────────────────────────────────────────

const W = {
  genreMatch: 0.35,
  tagAffinity: 0.2,
  moodMatch: 0.1,
  interactionHistory: 0.15,
  trending: 0.1,
  difficulty: 0.05,
  freshness: 0.05,
};

// ─── Profile Builder ────────────────────────────────────

export function buildUserProfile(
  interactions: UserInteraction[]
): UserProfile {
  const genreWeights: Record<string, number> = {};
  const tagAffinities: Record<string, number> = {};
  const moodPreferences: Record<string, number> = {};

  let totalWatchTime = 0;
  let completions = 0;
  let skips = 0;
  let totalPlays = 0;
  const difficulties: number[] = [];

  for (const ix of interactions) {
    if (ix.interactionType === "play") totalPlays++;
    if (ix.interactionType === "complete") completions++;
    if (ix.interactionType === "skip") skips++;
    if (ix.watchTimeSeconds) totalWatchTime += ix.watchTimeSeconds;
  }

  // Simple affinity: count interactions per series, then map to metadata
  // In production, this would join with contentMetadata table
  const seriesInteractionCount: Record<number, number> = {};
  for (const ix of interactions) {
    seriesInteractionCount[ix.seriesId] = (seriesInteractionCount[ix.seriesId] ?? 0) + 1;
  }

  return {
    userId: interactions[0]?.userId ?? 0,
    genreWeights,
    tagAffinities,
    moodPreferences,
    avgWatchTime: totalPlays > 0 ? totalWatchTime / totalPlays : 0,
    skipRate: totalPlays > 0 ? skips / totalPlays : 0,
    completionRate: totalPlays > 0 ? completions / totalPlays : 0,
    preferredDifficulty: difficulties.length > 0
      ? difficulties.reduce((a, b) => a + b, 0) / difficulties.length
      : 3,
    maturityLevel: "L",
  };
}

// ─── Scoring Functions ──────────────────────────────────

function genreScore(
  content: ContentMetadata,
  profile: UserProfile
): number {
  if (!content.genres || content.genres.length === 0) return 0.5;

  let score = 0;
  let weight = 0;

  for (const genre of content.genres) {
    const w = profile.genreWeights[genre] ?? 0.5;
    score += w;
    weight++;
  }

  return weight > 0 ? score / weight : 0.5;
}

function tagScore(
  content: ContentMetadata,
  profile: UserProfile
): number {
  if (!content.tags || content.tags.length === 0) return 0.5;

  let score = 0;
  for (const tag of content.tags) {
    score += profile.tagAffinities[tag] ?? 0.5;
  }

  return score / content.tags.length;
}

function moodScore(
  content: ContentMetadata,
  profile: UserProfile
): number {
  if (!content.moods || content.moods.length === 0) return 0.5;

  let score = 0;
  for (const mood of content.moods) {
    score += profile.moodPreferences[mood] ?? 0.5;
  }

  return score / content.moods.length;
}

function interactionScore(
  content: ContentMetadata,
  interactions: UserInteraction[]
): number {
  const seriesInteractions = interactions.filter(
    (ix) => ix.seriesId === content.seriesId
  );

  if (seriesInteractions.length === 0) return 0.3;

  let score = 0;
  for (const ix of seriesInteractions) {
    switch (ix.interactionType) {
      case "complete":
        score += 1.0;
        break;
      case "play":
        score += 0.4;
        break;
      case "bookmark":
        score += 0.7;
        break;
      case "share":
        score += 0.9;
        break;
      case "rate":
        score += (ix.rating ?? 3) / 5;
        break;
      case "skip":
        score -= 0.5;
        break;
      default:
        score += 0.1;
    }
  }

  return Math.max(0, Math.min(1, score / seriesInteractions.length));
}

function trendingScore(content: ContentMetadata): number {
  const trend = parseFloat(content.trendScore ?? "0");
  return Math.min(1, trend / 100);
}

function difficultyMatchScore(
  content: ContentMetadata,
  profile: UserProfile
): number {
  const difficulty = content.difficulty ?? 3;
  const preferred = profile.preferredDifficulty;
  const distance = Math.abs(difficulty - preferred);
  return Math.max(0, 1 - distance / 4);
}

function freshnessScore(content: ContentMetadata): number {
  if (!content.createdAt) return 0.5;
  const age = Date.now() - content.createdAt.getTime();
  const days = age / (1000 * 60 * 60 * 24);
  return Math.max(0.1, 1 - days / 90);
}

// ─── Main Ranking ───────────────────────────────────────

export function rankContent(
  contents: ContentMetadata[],
  interactions: UserInteraction[],
  profile: UserProfile,
  rows: Record<string, (c: ContentMetadata) => boolean> = {}
): RankedContent[] {
  const ranked: RankedContent[] = [];

  for (const content of contents) {
    const scores = {
      genre: genreScore(content, profile),
      tags: tagScore(content, profile),
      mood: moodScore(content, profile),
      interaction: interactionScore(content, interactions),
      trending: trendingScore(content),
      difficulty: difficultyMatchScore(content, profile),
      freshness: freshnessScore(content),
    };

    const total =
      scores.genre * W.genreMatch +
      scores.tags * W.tagAffinity +
      scores.mood * W.moodMatch +
      scores.interaction * W.interactionHistory +
      scores.trending * W.trending +
      scores.difficulty * W.difficulty +
      scores.freshness * W.freshness;

    const matchPercentage = Math.round(total * 100);

    // Determine best row assignment
    let assignedRow = "Recommended For You";
    for (const [rowName, predicate] of Object.entries(rows)) {
      if (predicate(content)) {
        assignedRow = rowName;
        break;
      }
    }

    // Reason string
    const reasons: string[] = [];
    if (scores.genre > 0.7) reasons.push("Genres match your interests");
    if (scores.trending > 0.6) reasons.push("Trending now");
    if (scores.interaction > 0.7) reasons.push("You enjoyed similar content");
    if (scores.difficulty > 0.8) reasons.push("Perfect difficulty level");
    if (reasons.length === 0) reasons.push("New for you");

    ranked.push({
      seriesId: content.seriesId,
      score: Math.round(total * 1000) / 1000,
      matchPercentage: Math.min(99, Math.max(30, matchPercentage)),
      reason: reasons[0],
      row: assignedRow,
    });
  }

  return ranked.sort((a, b) => b.score - a.score);
}

// ─── Row Generators ─────────────────────────────────────

export function generateRowPredicates(
  profile: UserProfile
): Record<string, (c: ContentMetadata) => boolean> {
  return {
    "Top Picks For You": (c) => {
      if (!c.genres) return false;
      return c.genres.some((g) => (profile.genreWeights[g] ?? 0) > 0.6);
    },
    "Trending Now": (c) => parseFloat(c.trendScore ?? "0") > 50,
    "Because You Watched": (c) => (c.difficulty ?? 3) <= Math.ceil(profile.preferredDifficulty),
    "New Releases": (c) => {
      if (!c.createdAt) return false;
      const days = (Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return days < 14;
    },
    "For Beginners": (c) => (c.difficulty ?? 3) <= 2,
    "Challenging": (c) => (c.difficulty ?? 3) >= 4,
    "Quick Watch": (c) => (c.avgCompletionRate ? parseFloat(c.avgCompletionRate) > 80 : false),
  };
}

// ─── Thumbnail A/B Test Winner Selection ────────────────

export interface ThumbnailVariant {
  id: number;
  seriesId: number;
  variantName: string;
  imageUrl: string;
  segment?: string;
  impressions: number;
  clicks: number;
  ctr: string;
  isWinner: boolean;
}

export function selectThumbnail(
  variants: ThumbnailVariant[],
  userSegment?: string
): ThumbnailVariant | null {
  // Filter by segment if provided
  const segmentVariants = variants.filter(
    (v) => !v.segment || v.segment === userSegment
  );

  const pool = segmentVariants.length > 0 ? segmentVariants : variants;
  if (pool.length === 0) return null;

  // If there's a declared winner, use it
  const winner = pool.find((v) => v.isWinner);
  if (winner) return winner;

  // Otherwise pick by best CTR
  return pool.reduce((best, v) => {
    const ctr = parseFloat(v.ctr ?? "0");
    const bestCtr = parseFloat(best.ctr ?? "0");
    return ctr > bestCtr ? v : best;
  });
}

// ─── Match Score Calculator (for UI display) ────────────

export function formatMatchScore(score: number): string {
  if (score >= 80) return `${score}% Match`;
  if (score >= 60) return `${score}% Match`;
  return `${score}% Match`;
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "text-match-high";
  if (score >= 60) return "text-match-mid";
  return "text-match-low";
}
