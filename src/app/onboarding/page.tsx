"use client";

import { useRouter } from "next/navigation";
import AgentSelector from "@/components/onboarding/AgentSelector";
import { savePreferences } from "@/lib/onboarding/types";
import { useUserStore } from "@/store/useUserStore";

export default function OnboardingPage() {
  const router = useRouter();
  const { setGuideAgent } = useUserStore();

  const handleAgentSelect = (agentId: string) => {
    setGuideAgent(agentId);
    savePreferences({ selectedGuideAgent: agentId, onboardingCompleted: true });
    router.push("/home");
  };

  const handleAgentSkip = () => {
    savePreferences({ onboardingCompleted: true });
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AgentSelector onSelect={handleAgentSelect} onSkip={handleAgentSkip} />
    </div>
  );
}
