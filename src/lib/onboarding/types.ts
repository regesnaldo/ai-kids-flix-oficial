export interface UserPreferences {
  userId: string;
  name: string;
  selectedGuideAgent: string | null;
  onboardingCompleted: boolean;
  onboardingVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  illustration: string;
  action?: {
    type: "next" | "skip" | "select-agent";
    label: string;
  };
}

export const ONBOARDING_VERSION = 1;

const STORAGE_KEY = "mente-ai-preferences";

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getPreferences(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserPreferences;
  } catch {
    return null;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  // Temporarily disabled for testing - no-op
}

export function shouldShowOnboarding(): boolean {
  return true;
}

