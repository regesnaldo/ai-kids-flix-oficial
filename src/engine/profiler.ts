import { db } from "@/lib/db";
import { interactiveDecisions } from "@/lib/db/schema";

// NOTE (Phase 0): userProfiles table is planned for Era 1 / Phase 2
// (Motor de Narrativa Adaptativa). The silent profiler logic is preserved
// but DB persistence for user dimensions is disabled until that migration runs.

export type EmotionalSignal = "curiosity" | "fear" | "rebellion" | "conformity";
export type IntellectualSignal = "logical" | "intuitive";
export type MoralSignal = "protected_humanity" | "expanded_ai_power";

export interface ProfileSignals {
  emotional: EmotionalSignal;
  intellectual: IntellectualSignal;
  moral: MoralSignal;
  emotionalScore: number;
  intellectualScore: number;
  moralScore: number;
}

export interface InteractionContext {
  userId: number;
  episodeId?: number;
  seriesId?: number;
  agentId?: string;
  choiceId?: string;
  choiceLabel: string;
  narrativeResponse?: string;
}

const emotionalPatterns: Record<EmotionalSignal, RegExp[]> = {
  curiosity: [/curios/i, /explor/i, /e se/i, /quero entender/i, /why/i, /how/i],
  fear: [/medo/i, /insegur/i, /perigo/i, /ansio/i, /não consigo/i, /travado/i],
  rebellion: [/quebrar/i, /rebel/i, /subverter/i, /contra regra/i, /hack/i, /ruptura/i],
  conformity: [/seguir/i, /manual/i, /regra/i, /protocolo/i, /padr[aã]o/i, /compliance/i],
};

const intellectualPatterns: Record<IntellectualSignal, RegExp[]> = {
  logical: [/l[oó]gic/i, /prova/i, /evid[eê]n/i, /analis/i, /passo a passo/i, /axioma/i],
  intuitive: [/intui/i, /sentir/i, /insight/i, /vis[aã]o/i, /imagin/i, /instinto/i],
};

const moralPatterns: Record<MoralSignal, RegExp[]> = {
  protected_humanity: [/human/i, /seguran[aç]/i, /[eé]tic/i, /limite/i, /prote[çc][aã]o/i],
  expanded_ai_power: [/escalar ia/i, /autonom/i, /expand/i, /superintelig/i, /mais poder/i],
};

function countMatches(input: string, patterns: RegExp[]): number {
  return patterns.reduce((acc, pattern) => acc + (pattern.test(input) ? 1 : 0), 0);
}

function clampProfileRange(value: number): number {
  return Math.max(-9.99, Math.min(9.99, Number(value.toFixed(2))));
}

function chooseDominant<T extends string>(scores: Record<T, number>, fallback: T): T {
  const entries = Object.entries(scores) as Array<[T, number]>;
  const winner = entries.sort((a, b) => b[1] - a[1])[0];
  return winner && winner[1] > 0 ? winner[0] : fallback;
}

function normalizeDelta(left: number, right: number): number {
  const total = left + right;
  if (!total) return 0;
  return Number((((left - right) / total) * 1.8).toFixed(2));
}

export function extractProfileSignals(choiceLabel: string): ProfileSignals {
  const normalized = choiceLabel.toLowerCase();

  const emotionalCounts = {
    curiosity: countMatches(normalized, emotionalPatterns.curiosity),
    fear: countMatches(normalized, emotionalPatterns.fear),
    rebellion: countMatches(normalized, emotionalPatterns.rebellion),
    conformity: countMatches(normalized, emotionalPatterns.conformity),
  };

  const intellectualCounts = {
    logical: countMatches(normalized, intellectualPatterns.logical),
    intuitive: countMatches(normalized, intellectualPatterns.intuitive),
  };

  const moralCounts = {
    protected_humanity: countMatches(normalized, moralPatterns.protected_humanity),
    expanded_ai_power: countMatches(normalized, moralPatterns.expanded_ai_power),
  };

  const emotional = chooseDominant(emotionalCounts, "curiosity");
  const intellectual = chooseDominant(intellectualCounts, "logical");
  const moral = chooseDominant(moralCounts, "protected_humanity");

  const emotionalScore = Number(
    normalizeDelta(
      emotionalCounts.curiosity + emotionalCounts.rebellion,
      emotionalCounts.fear + emotionalCounts.conformity,
    ).toFixed(2),
  );
  const intellectualScore = Number(normalizeDelta(intellectualCounts.logical, intellectualCounts.intuitive).toFixed(2));
  const moralScore = Number(normalizeDelta(moralCounts.protected_humanity, moralCounts.expanded_ai_power).toFixed(2));

  return { emotional, intellectual, moral, emotionalScore, intellectualScore, moralScore };
}

export async function persistInteractionDecision(context: InteractionContext): Promise<void> {
  // agentId column not yet in interactiveDecisions schema — omitted until Phase 2 migration
  await db.insert(interactiveDecisions).values({
    userId: context.userId,
    episodeId: context.episodeId ?? 0,
    seriesId: context.seriesId ?? 0,
    choiceId: context.choiceId ?? `choice_${Date.now()}`,
    choiceLabel: context.choiceLabel.slice(0, 255),
    narrativeResponse: context.narrativeResponse,
  });
}

// Phase 0: userProfiles table not yet migrated — returns extracted signals only.
// Full DB persistence (emotionalDim, intellectualDim, moralDim) ships in Phase 2.
export async function updateSilentProfile(
  context: InteractionContext,
): Promise<ProfileSignals | null> {
  const signals = extractProfileSignals(context.choiceLabel);

  try {
    await persistInteractionDecision(context);
  } catch {
    // Swallow DB errors in Phase 0 — table may not exist in the current environment
  }

  return signals;
}

// Phase 0: userProfiles table not yet migrated — always returns null.
export async function getUserProfile(_userId: number) {
  return null;
}
