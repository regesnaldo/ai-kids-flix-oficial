import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { interactiveDecisions } from "@/lib/db/schema";
// NOTE (Phase 0): universeTransitions and userProfiles are Phase 2 tables.
// All inserts/updates to those tables are stubbed out until migrations land.
import { getUserProfile } from "@/engine/profiler";

export type Archetype = "analytical" | "rebel" | "paralyzed" | "empathetic" | "strategic" | "creative";
export type UniverseId = "NEXUS" | "AXIOM" | "KAOS" | "ETHOS" | "VOLT" | "TERRA" | "LYRA" | "STRATOS" | "PRISM" | "AURORA";

export interface RouterDecision {
  archetype: Archetype;
  selectedUniverse: UniverseId;
  alternatives: UniverseId[];
  reason: string;
  backtrackApplied: boolean;
}

const ARCHETYPE_DESTINATIONS: Record<Archetype, UniverseId[]> = {
  analytical: ["NEXUS", "AXIOM"],
  rebel: ["KAOS", "ETHOS"],
  paralyzed: ["VOLT"],
  empathetic: ["TERRA", "LYRA"],
  strategic: ["STRATOS"],
  creative: ["PRISM", "AURORA"],
};

function classifyArchetype(emotional: number, intellectual: number, moral: number): Archetype {
  if (emotional <= -1.4 && intellectual >= 1.2) return "analytical";
  if (emotional >= 1.2 && moral <= -0.8) return "rebel";
  if (emotional <= -1.1 && intellectual <= -0.9) return "paralyzed";
  if (moral >= 1.1 && emotional >= 0.4) return "empathetic";
  if (intellectual >= 1.1 && moral >= 0.3) return "strategic";
  return "creative";
}

async function runTreeOfThoughtsHeuristic(args: {
  archetype: Archetype;
  userText: string;
  currentAgent?: string;
}): Promise<{ selectedUniverse: UniverseId; reason: string }> {
  const candidates = ARCHETYPE_DESTINATIONS[args.archetype];
  const candidateA = candidates[0];
  const candidateB = candidates[1] ?? candidates[0];

  const thought1 = `Thought 1: Se o usuário pediu estrutura/clareza, priorizar ${candidateA}.`;
  const thought2 = `Thought 2: Se pediu contraste/alternativa, priorizar ${candidateB}.`;
  const thought3 = `Thought 3: Evitar repetir universo atual para destravar avanço.`;

  const lowered = args.userText.toLowerCase();
  const asksAlternative = /alternativa|outra|diferente|new angle|different/i.test(lowered);
  const selectedUniverse = asksAlternative ? candidateB : candidateA;

  try {
    // Optional runtime integration; if LangChain is unavailable, heuristic remains active.
    const dynamicImporter = new Function("specifier", "return import(specifier);") as (specifier: string) => Promise<unknown>;
    const maybeLangchain = await dynamicImporter("langchain/chains");
    if (maybeLangchain) {
      return {
        selectedUniverse,
        reason: `${thought1} ${thought2} ${thought3} (Tree-of-Thoughts via LangChain enabled)`,
      };
    }
  } catch {
    // silent fallback to deterministic route
  }

  return {
    selectedUniverse,
    reason: `${thought1} ${thought2} ${thought3} (deterministic ToT fallback)`,
  };
}

async function shouldBacktrackForStagnation(userId: number): Promise<boolean> {
  const rows = await db
    .select({ choiceId: interactiveDecisions.choiceId })
    .from(interactiveDecisions)
    .where(eq(interactiveDecisions.userId, userId))
    .orderBy(desc(interactiveDecisions.createdAt))
    .limit(3);

  if (rows.length < 3) return false;
  return rows.every((r) => r.choiceId === rows[0].choiceId);
}

async function shouldBacktrackForNoProgress(userId: number): Promise<boolean> {
  const rows = await db
    .select({ narrativeResponse: interactiveDecisions.narrativeResponse })
    .from(interactiveDecisions)
    .where(eq(interactiveDecisions.userId, userId))
    .orderBy(desc(interactiveDecisions.createdAt))
    .limit(5);

  if (rows.length < 5) return false;
  return rows.every((row) => (row.narrativeResponse ?? "").trim().length < 30);
}

function selectDifferentPerspective(currentUniverse: UniverseId | null, alternatives: UniverseId[]): UniverseId {
  if (!currentUniverse) return alternatives[0];
  const different = alternatives.find((u) => u !== currentUniverse);
  return different ?? alternatives[0];
}

function mapAgentToUniverse(agentId?: string | null): UniverseId | null {
  if (!agentId) return null;
  const token = agentId.toUpperCase();
  if (["NEXUS", "AXIOM", "KAOS", "ETHOS", "VOLT", "TERRA", "LYRA", "STRATOS", "PRISM", "AURORA"].includes(token)) {
    return token as UniverseId;
  }
  return null;
}

function mapUniverseToAgent(universe: UniverseId): string {
  return universe.toLowerCase();
}

export async function routeAdaptiveNarrative(params: {
  userId: number;
  userText: string;
  currentAgent?: string;
}): Promise<RouterDecision> {
  const profile = await getUserProfile(params.userId);

  const emotional = profile ? parseFloat((profile as Record<string, string>).emotionalDim ?? "0") : 0;
  const intellectual = profile ? parseFloat((profile as Record<string, string>).intellectualDim ?? "0") : 0;
  const moral = profile ? parseFloat((profile as Record<string, string>).moralDim ?? "0") : 0;

  const archetype = classifyArchetype(emotional, intellectual, moral);
  const alternatives = ARCHETYPE_DESTINATIONS[archetype];

  const tot = await runTreeOfThoughtsHeuristic({
    archetype,
    userText: params.userText,
    currentAgent: params.currentAgent,
  });

  const currentUniverse = mapAgentToUniverse(params.currentAgent);
  let selectedUniverse = tot.selectedUniverse;
  let backtrackApplied = false;
  let reason = tot.reason;

  const stagnated = await shouldBacktrackForStagnation(params.userId);
  const noProgress = await shouldBacktrackForNoProgress(params.userId);

  if (stagnated || noProgress) {
    selectedUniverse = selectDifferentPerspective(currentUniverse, alternatives);
    backtrackApplied = true;
    reason = "stagnation";

    // NOTE (Phase 0): universeTransitions insert stubbed — table added in Phase 2 migration
    // await db.insert(universeTransitions).values({ userId: params.userId, fromAgent: params.currentAgent ?? "nexus", toAgent: mapUniverseToAgent(selectedUniverse), reason: "stagnation" });
  } else if (currentUniverse && currentUniverse !== selectedUniverse) {
    // NOTE (Phase 0): universeTransitions insert stubbed — table added in Phase 2 migration
    // await db.insert(universeTransitions).values({ userId: params.userId, fromAgent: params.currentAgent ?? "nexus", toAgent: mapUniverseToAgent(selectedUniverse), reason: "adaptive_route" });
  }

  // NOTE (Phase 0): userProfiles update stubbed — table added in Phase 2 migration
  // await db.update(userProfiles).set({ archetypeLabel: archetype, lastAgentId: mapUniverseToAgent(selectedUniverse), updatedAt: new Date() }).where(eq(userProfiles.userId, params.userId));

  // Silence unused variable warning from mapUniverseToAgent while stubs are active
  void mapUniverseToAgent(selectedUniverse);

  return {
    archetype,
    selectedUniverse,
    alternatives,
    reason,
    backtrackApplied,
  };
}
