import { db } from "@/lib/db";
import { userXp } from "@/lib/db/schema";
import { xpEvents, type NewXpEvent } from "@/lib/db/schema-extensions";
import { eq, and, gte, sql } from "drizzle-orm";
import crypto from "crypto";

// ─── XP Rules ──────────────────────────────────────────────────────────
export const XP = {
  EPISODE_COMPLETE: 10,
  ALL_CHOICES_MADE: 5,
  FIRST_EPISODE_DAY: 2,
  LAB_EXPERIMENT: 15,
  LAB_ROLLBACK_BONUS: 5,
  DAILY_CEILING: 100,
} as const;

// ─── 5 Reward Levels ───────────────────────────────────────────────────
export interface RewardLevel {
  level: number;
  label: string;
  xpRequired: number;
  referralsRequired: number;
  daysRequired: number;
  reward: string;
}

export const REWARD_LEVELS: RewardLevel[] = [
  { level: 1, label: "Explorador Iniciante", xpRequired: 500, referralsRequired: 3, daysRequired: 7, reward: "10% de desconto" },
  { level: 2, label: "Navegador Cósmico", xpRequired: 1500, referralsRequired: 7, daysRequired: 21, reward: "20% de desconto" },
  { level: 3, label: "Arquiteto Neural", xpRequired: 3000, referralsRequired: 15, daysRequired: 45, reward: "1 mês ChatGPT grátis" },
  { level: 4, label: "Mestre do Metaverso", xpRequired: 6000, referralsRequired: 25, daysRequired: 90, reward: "Distintivo + Acesso Antecipado" },
  { level: 5, label: "Lenda Viva", xpRequired: 10000, referralsRequired: 40, daysRequired: 180, reward: "Hall da Fama + Surpresa" },
];

// ─── Award XP ──────────────────────────────────────────────────────────
export async function awardXp(params: {
  userId: number;
  amount: number;
  reason: string;
  agentId?: string;
  season?: number;
  episode?: number;
}): Promise<{ awarded: number; total: number; dailyUsed: number; capped: boolean }> {
  const today = new Date().toISOString().split("T")[0];

  // Daily ceiling check via xp_events
  const dailyEvents = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(xpEvents)
    .where(
      and(
        eq(xpEvents.userId, params.userId),
        gte(xpEvents.createdAt, new Date(today)),
      )
    );

  const dailyUsed = Number(dailyEvents[0]?.total ?? 0);
  const remaining = Math.max(0, XP.DAILY_CEILING - dailyUsed);
  const awarded = Math.min(params.amount, remaining);

  if (awarded <= 0) return { awarded: 0, total: 0, dailyUsed, capped: true };

  // Record event
  await db.insert(xpEvents).values({
    id: crypto.randomUUID(),
    userId: params.userId,
    amount: awarded,
    reason: params.reason,
    agentId: params.agentId ?? null,
    season: params.season ?? null,
    episode: params.episode ?? null,
  } satisfies NewXpEvent);

  // Update user_xp total
  const existing = await db.select().from(userXp).where(eq(userXp.userId, params.userId)).limit(1);
  if (existing.length > 0) {
    await db.update(userXp)
      .set({ xpTotal: (existing[0].xpTotal ?? 0) + awarded })
      .where(eq(userXp.userId, params.userId));
  } else {
    await db.insert(userXp).values({
      id: crypto.randomUUID(),
      userId: params.userId,
      xpTotal: awarded,
      xpThisWeek: awarded,
      streakDays: 1,
      lastActivityDate: today,
      weekStartDate: today,
    });
  }

  // Get new total
  const updated = await db.select({ xpTotal: userXp.xpTotal })
    .from(userXp).where(eq(userXp.userId, params.userId)).limit(1);

  return {
    awarded,
    total: updated[0]?.xpTotal ?? awarded,
    dailyUsed: dailyUsed + awarded,
    capped: awarded < params.amount,
  };
}

// ─── Get user XP data ──────────────────────────────────────────────────
export async function getUserXpData(userId: number) {
  const [record] = await db.select().from(userXp).where(eq(userXp.userId, userId)).limit(1);
  const today = new Date().toISOString().split("T")[0];

  const [todayResult] = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(xpEvents)
    .where(and(eq(xpEvents.userId, userId), gte(xpEvents.createdAt, new Date(today))));

  return {
    total: record?.xpTotal ?? 0,
    today: Number(todayResult?.total ?? 0),
    streak: record?.streakDays ?? 0,
  };
}

// ─── Check level up ────────────────────────────────────────────────────
export async function checkLevelUp(userId: number, validReferrals: number, accountCreatedAt: Date): Promise<RewardLevel | null> {
  const xpData = await getUserXpData(userId);
  const daysSinceCreation = Math.floor((Date.now() - accountCreatedAt.getTime()) / 86400000);

  for (let i = REWARD_LEVELS.length - 1; i >= 0; i--) {
    const level = REWARD_LEVELS[i];
    if (
      xpData.total >= level.xpRequired &&
      validReferrals >= level.referralsRequired &&
      daysSinceCreation >= level.daysRequired
    ) {
      return level;
    }
  }
  return null;
}
