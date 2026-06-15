// CLIENT ONLY — runs in browser only
// Handles localStorage cache for learned answers

const CACHE_KEY = "mente_ai_lab_cache";
const CACHE_VERSION = "v1";
const MAX_CACHE_SIZE = 50; // keep last 50 answers

export function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findInLocalCache(question: string) {
  try {
    const normalized = normalizeQuestion(question);
    const raw = localStorage.getItem(`${CACHE_KEY}_${CACHE_VERSION}`);
    if (!raw) return null;
    const localCache = JSON.parse(raw);
    return localCache[normalized] || null;
  } catch {
    return null;
  }
}

export function saveToLocalCache(question: string, answer: unknown) {
  try {
    const normalized = normalizeQuestion(question);
    const raw = localStorage.getItem(`${CACHE_KEY}_${CACHE_VERSION}`) || "{}";
    const localCache = JSON.parse(raw);

    localCache[normalized] = {
      ...(answer as Record<string, unknown>),
      source: "learned",
      savedAt: Date.now(),
    };

    // Keep only last MAX_CACHE_SIZE entries
    const keys = Object.keys(localCache);
    if (keys.length > MAX_CACHE_SIZE) {
      const oldest = keys
        .map((k) => ({ key: k, ts: localCache[k]?.savedAt || 0 }))
        .sort((a, b) => a.ts - b.ts);
      for (let i = 0; i < oldest.length - MAX_CACHE_SIZE; i++) {
        delete localCache[oldest[i].key];
      }
    }

    localStorage.setItem(`${CACHE_KEY}_${CACHE_VERSION}`, JSON.stringify(localCache));
  } catch (e) {
    console.error("[client-cache] Save failed:", e);
  }
}

/** Monitor unanswered questions for cache expansion */
export function logUnansweredQuestion(question: string) {
  try {
    const raw = localStorage.getItem("mente_ai_unanswered") || "[]";
    const unanswered = JSON.parse(raw);
    unanswered.push({ question: normalizeQuestion(question), timestamp: Date.now() });
    // Keep only last 100
    const trimmed = unanswered.slice(-100);
    localStorage.setItem("mente_ai_unanswered", JSON.stringify(trimmed));
  } catch (error) { console.error('[MENTE.AI] Error in client-cache.ts:', error); }
}

/** Check which questions are available offline */
export function getLocalQuestions(): string[] {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}_${CACHE_VERSION}`);
    if (!raw) return [];
    return Object.keys(JSON.parse(raw));
  } catch {
    return [];
  }
}
