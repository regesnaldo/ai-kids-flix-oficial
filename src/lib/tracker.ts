import { db } from '@/lib/db';
import { profiles, userXp, interactiveDecisions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function updateProfile(
  userId: number,
  impacts: {
    emotional?: Record<string, number>;
    intellectual?: Record<string, number>;
    moral?: Record<string, number>;
  },
) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  if (!profile) {
    return 'Analítico-Protetor';
  }

  return calculateArchetype(userId);
}

export async function addXp(userId: number, amount: number, episodeId?: string) {
  const xp = await db.query.userXp.findFirst({ where: eq(userXp.userId, userId) });

  if (!xp) {
    await db.insert(userXp).values({
      id: crypto.randomUUID(),
      userId,
      xpTotal: amount,
      xpThisWeek: amount,
      streakDays: 1,
    });
  } else {
    const newTotal = (xp.xpTotal ?? 0) + amount;
    const newThisWeek = (xp.xpThisWeek ?? 0) + amount;

    await db
      .update(userXp)
      .set({
        xpTotal: newTotal,
        xpThisWeek: newThisWeek,
        updatedAt: new Date(),
      })
      .where(eq(userXp.userId, userId));
  }

  return {
    totalXp: (xp?.xpTotal ?? 0) + amount,
    level: Math.floor(((xp?.xpTotal ?? 0) + amount) / 100) + 1,
  };
}

export async function saveDecision(
  userId: number,
  data: {
    episodeId: string;
    decisionPoint: string;
    selectedOption: string;
    impacts: {
      emotional?: Record<string, number>;
      intellectual?: Record<string, number>;
      moral?: Record<string, number>;
    };
    xpGained: number;
  },
) {
  await updateProfile(userId, data.impacts);
  return addXp(userId, data.xpGained, data.episodeId);
}

async function calculateArchetype(userId: number) {
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, userId) });
  if (!profile) return 'Analítico-Protetor';

  return 'Analítico-Protetor';
}

export async function getUserProgress(userId: number) {
  const [profile, xp] = await Promise.all([
    db.query.profiles.findFirst({ where: eq(profiles.userId, userId) }),
    db.query.userXp.findFirst({ where: eq(userXp.userId, userId) }),
  ]);

  return {
    profile: profile ?? null,
    xp: xp ?? null,
    archetype: 'Analítico-Protetor',
  };
}