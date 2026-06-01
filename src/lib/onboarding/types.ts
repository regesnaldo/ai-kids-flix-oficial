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
  if (typeof window === "undefined") return;
  const existing = getPreferences() ?? {
    userId: generateUserId(),
    name: "",
    selectedGuideAgent: null,
    onboardingCompleted: false,
    onboardingVersion: ONBOARDING_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const merged = { ...existing, ...prefs, updatedAt: new Date().toISOString() };
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch (error) { console.error('[MENTE.AI] Error in onboarding/types.ts:', error); }
}

export function shouldShowOnboarding(): boolean {
  try {
    const completed = localStorage.getItem('mente_ai_onboarding_complete')
    if (completed === 'true') return false
    return false // TEMP: disable onboarding loop until fix is validated
  } catch {
    return false
  }
}

