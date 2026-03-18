"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import AgentSelector from "@/components/onboarding/AgentSelector";
import InteractiveTutorial from "@/components/onboarding/InteractiveTutorial";
import { savePreferences, shouldShowOnboarding } from "@/lib/onboarding/types";
import { useUserStore } from "@/store/useUserStore";

type OnboardingStep = "welcome" | "agent" | "tutorial";

export default function OnboardingPage() {
  const router = useRouter();
  const { setGuideAgent } = useUserStore();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldShowOnboarding()) {
      router.push("/laboratorio/simulador");
    }
  }, [router]);

  const handleWelcomeNext = () => setStep("agent");
  const handleWelcomeSkip = () => {
    savePreferences({ onboardingCompleted: true });
    router.push("/laboratorio/simulador");
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setGuideAgent(agentId);
    savePreferences({ selectedGuideAgent: agentId });
    setStep("tutorial");
  };

  const handleAgentSkip = () => {
    savePreferences({ onboardingCompleted: true });
    router.push("/laboratorio/simulador");
  };

  const handleTutorialComplete = () => {
    savePreferences({ onboardingCompleted: true });
    if (selectedAgent) {
      router.push(`/laboratorio/simulador?guide=${encodeURIComponent(selectedAgent)}`);
      return;
    }
    router.push("/agentes");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {step === "welcome" && <WelcomeScreen onNext={handleWelcomeNext} onSkip={handleWelcomeSkip} />}
      {step === "agent" && <AgentSelector onSelect={handleAgentSelect} onSkip={handleAgentSkip} />}
      {step === "tutorial" && <InteractiveTutorial onComplete={handleTutorialComplete} />}
    </div>
  );
}
