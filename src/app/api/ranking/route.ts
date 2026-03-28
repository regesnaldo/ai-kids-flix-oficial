import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userXp, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

async function getUserId(request: NextRequest): Promise<number | null> {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as number;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const period = request.nextUrl.searchParams.get("period") ?? "week";
  const orderBy = period === "all" ? userXp.xpTotal : userXp.xpThisWeek;

  const top20 = await db
    .select({
      userId: userXp.userId,
      xp: period === "all" ? userXp.xpTotal : userXp.xpThisWeek,
      streakDays: userXp.streakDays,
      name: users.name,
    })
    .from(userXp)
    .innerJoin(users, eq(userXp.userId, users.id))
    .orderBy(desc(orderBy))
    .limit(20);

  const ranking = top20.map((row, index) => ({
    position: index + 1,
    userId: row.userId,
    name: row.name ?? "Participante",
    xp: row.xp ?? 0,
    streakDays: row.streakDays ?? 0,
    isCurrentUser: row.userId === userId,
  }));

  const currentUserInTop = ranking.find(r => r.userId === userId);

  let currentUser = { position: 0, xp: 0, streakDays: 0 };

  if (currentUserInTop) {
    currentUser = {
      position: currentUserInTop.position,
      xp: currentUserInTop.xp,
      streakDays: currentUserInTop.streakDays,
    };
  } else {
    const myXp = await db.select().from(userXp).where(eq(userXp.userId, userId)).limit(1);
    if (myXp.length > 0) {
      const myXpValue = period === "all" ? myXp[0].xpTotal ?? 0 : myXp[0].xpThisWeek ?? 0;
      const countAbove = await db
        .select({ userId: userXp.userId })
        .from(userXp)
        .orderBy(desc(orderBy));
      const pos = countAbove.findIndex(r => r.userId === userId);
      currentUser = {
        position: pos === -1 ? 0 : pos + 1,
        xp: myXpValue,
        streakDays: myXp[0].streakDays ?? 0,
      };
    }
  }

  return NextResponse.json({ ranking, currentUser });
}
