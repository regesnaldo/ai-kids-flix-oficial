import { redirect } from "next/navigation";

/**
 * /agentes — redirect to /explorar (canonical agent gallery).
 *
 * Oasis context: available via OasisProvider in (main)/layout.tsx.
 * Client components on this route can use useOasis() for
 * currentScene, cognitiveProfile, and progressionSnapshot.
 */
export default function AgentesPage() {
  redirect("/explorar");
}
