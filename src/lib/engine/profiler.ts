"use server";

export interface UserProfile {
  emotionalScore: number;
  intellectualScore: number;
  moralScore: number;
  archetype: Archetype;
  decisionHistory: string[];
  currentAgent: string;
  lastUpdated: number;
}

export type Archetype = "analytical" | "rebel" | "paralyzed" | "empathetic" | "strategic" | "creative";

const STORAGE_KEY = "mente_ai_profile_v1";

function defaultProfile(): UserProfile {
  return {
    emotionalScore: 50,
    intellectualScore: 50,
    moralScore: 50,
    archetype: "analytical",
    decisionHistory: [],
    currentAgent: "nexus",
    lastUpdated: Date.now(),
  };
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    return JSON.parse(raw) as UserProfile;
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, lastUpdated: Date.now() }));
  } catch { }
}

export function updateProfile(deltas: Partial<Record<"emotionalScore" | "intellectualScore" | "moralScore", number>>): UserProfile {
  const profile = loadProfile();
  if (deltas.emotionalScore) profile.emotionalScore = Math.max(0, Math.min(100, profile.emotionalScore + deltas.emotionalScore));
  if (deltas.intellectualScore) profile.intellectualScore = Math.max(0, Math.min(100, profile.intellectualScore + deltas.intellectualScore));
  if (deltas.moralScore) profile.moralScore = Math.max(0, Math.min(100, profile.moralScore + deltas.moralScore));
  profile.archetype = detectArchetype(profile);
  saveProfile(profile);
  return profile;
}

export function detectArchetype(profile: UserProfile): Archetype {
  const { emotionalScore: e, intellectualScore: i, moralScore: m } = profile;
  if (i > 70 && m > 50) return "analytical";
  if (e > 60 && i < 40) return "rebel";
  if (e < 30 && i < 30) return "paralyzed";
  if (e > 60 && m > 60) return "empathetic";
  if (i > 60 && m < 40) return "strategic";
  if (e > 50 && i > 50) return "creative";
  return "analytical";
}
