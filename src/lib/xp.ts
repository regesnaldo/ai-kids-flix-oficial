import { db } from "@/lib/db";
import { userXp } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const XP_REWARDS = {
  NOTA_CRIADA: 10,
  EXPERIMENTO_CONCLUIDO: 25,
  LOGIN_DIARIO: 5,
  PERFIL_COMPLETO: 50,
} as const;

function getMondayOfCurrentWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

export async function addXp(userId: number, amount: number, reason: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const monday = getMondayOfCurrentWeek();

  const existing = await db.select().from(userXp).where(eq(userXp.userId, userId)).limit(1);

  if (existing.length === 0) {
    await db.insert(userXp).values({
      id: crypto.randomUUID(),
      userId,
      xpTotal: amount,
      xpThisWeek: amount,
      streakDays: 1,
      lastActivityDate: today,
      weekStartDate: monday,
    });
    return;
  }

  const record = existing[0];
  const lastDate = record.lastActivityDate ?? null;
  const lastWeek = record.weekStartDate ?? null;

  const diffDays = lastDate
    ? Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / 86400000)
    : 999;

  const newStreak =
    diffDays === 0 ? record.streakDays! :
    diffDays === 1 ? record.streakDays! + 1 : 1;

  const newXpWeek = lastWeek !== monday ? amount : record.xpThisWeek! + amount;

  await db.update(userXp).set({
    xpTotal: record.xpTotal! + amount,
    xpThisWeek: newXpWeek,
    streakDays: newStreak,
    lastActivityDate: today,
    weekStartDate: monday,
  }).where(eq(userXp.userId, userId));
}
