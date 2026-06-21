import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema-narrative";
import { eq } from "drizzle-orm";

interface AuraResult {
  auraColor: string;
  auraIntensity: number;
  dominantDim: "emotional" | "intellectual" | "moral" | "neutral";
  label: string;
}

const AURA_COLORS = {
  moralHigh: "#3b82f6",
  moralLow: "#f59e0b",
  emotionalHigh: "#22c55e",
  intellectualHigh: "#a855f7",
  neutral: "#00f0ff",
} as const;

const AURA_LABELS = {
  moralHigh: "Protetor da Humanidade",
  moralLow: "Expandiu Poder",
  emotionalHigh: "Empático",
  intellectualHigh: "Analítico",
  neutral: "Em Formação",
} as const;

export async function calculateAura(userId: number): Promise<AuraResult> {
  try {
    const rows = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      return {
        auraColor: AURA_COLORS.neutral,
        auraIntensity: 0.5,
        dominantDim: "neutral",
        label: AURA_LABELS.neutral,
      };
    }

    const profile = rows[0];
    const emotional = Number(profile.emotionalDim);
    const intellectual = Number(profile.intellectualDim);
    const moral = Number(profile.moralDim);

    const intensity = Math.min(1, Number(((emotional + intellectual + moral) / 3).toFixed(2)));

    if (moral > 0.7) {
      return { auraColor: AURA_COLORS.moralHigh, auraIntensity: intensity, dominantDim: "moral", label: AURA_LABELS.moralHigh };
    }
    if (moral < 0.4) {
      return { auraColor: AURA_COLORS.moralLow, auraIntensity: intensity, dominantDim: "moral", label: AURA_LABELS.moralLow };
    }
    if (emotional > 0.7) {
      return { auraColor: AURA_COLORS.emotionalHigh, auraIntensity: intensity, dominantDim: "emotional", label: AURA_LABELS.emotionalHigh };
    }
    if (intellectual > 0.7) {
      return { auraColor: AURA_COLORS.intellectualHigh, auraIntensity: intensity, dominantDim: "intellectual", label: AURA_LABELS.intellectualHigh };
    }

    return { auraColor: AURA_COLORS.neutral, auraIntensity: intensity, dominantDim: "neutral", label: AURA_LABELS.neutral };
  } catch {
    return { auraColor: AURA_COLORS.neutral, auraIntensity: 0.5, dominantDim: "neutral", label: AURA_LABELS.neutral };
  }
}
