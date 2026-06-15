// ⚠️ SERVER ONLY — do not import in client components
// This file imports prebuilt-cache.json which is several hundred KB.
// Importing on the client would destroy bundle size and page load performance.

import prebuiltCache from "@/data/prebuilt-cache.json";

export function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Exact match in prebuilt cache */
export function findInPrebuilt(question: string) {
  const normalized = normalizeQuestion(question);
  const cache = prebuiltCache as Record<string, unknown>;
  return cache[normalized] || null;
}

/** Fuzzy match — finds similar questions (threshold 0.5) */
export function findSimilar(question: string, threshold = 0.5) {
  const normalized = normalizeQuestion(question);
  const words = normalized.split(" ");
  const cache = prebuiltCache as Record<string, unknown>;

  let bestMatch: { key: string; value: unknown; score: number } | null = null;
  let bestScore = 0;

  for (const [key, value] of Object.entries(cache)) {
    const keyWords = key.split(" ");
    const commonWords = words.filter((w) => keyWords.includes(w));
    const score = commonWords.length / Math.max(words.length, keyWords.length);

    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = { key, value, score };
    }
  }

  return bestMatch;
}
