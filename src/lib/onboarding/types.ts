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

/**
 * Determina se o onboarding deve ser exibido para o usuário atual.
 *
 * Regras:
 *   - Usuários com `onboardingCompleted === true` → NÃO exibir
 *   - Usuários sem preferências salvas (primeiro acesso) → EXIBIR
 *   - Usuários que pularam explicitamente via skip → NÃO exibir
 *   - Fallback seguro: se localStorage falhar, NÃO exibir (evita loop)
 */
export function shouldShowOnboarding(): boolean {
  try {
    const prefs = getPreferences();
    if (!prefs) return true;
    if (prefs.onboardingCompleted) return false;
    // Se o usuário já tem preferências mas não completou o onboarding
    // (ex: pulou), não insistir — respeita o skip explícito
    return false;
  } catch {
    return false;
  }
}

/**
 * Marca o onboarding como completo e salva no localStorage.
 * Usado pelo OnboardingPage ao final da calibração.
 */
export function completeOnboarding(): void {
  savePreferences({ onboardingCompleted: true });
}

