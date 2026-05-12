import { routeAdaptiveNarrative } from "@/engine/router";

export async function executeAutomaticBacktracking(params: {
  userId: number;
  userText: string;
  currentAgent?: string;
}) {
  return routeAdaptiveNarrative(params);
}
