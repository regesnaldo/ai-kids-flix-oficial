const PREFIXES = ["NEX","CYP","AUR","KAO","ETH","CIP","LYR","TER","VOL","PRI","STR","JAN"];
const SUFFIXES = ["PLORER","RONAUT","WALKER","SEEKER","RUNNER","CODER","SAGE","PILOT","SCOUT","FORGE"];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

/** Gen sci-fi username from seed (userId or email). Deterministic. */
export function generateUsername(seed: string): string {
  const h = hashCode(seed);
  const prefix = PREFIXES[h % PREFIXES.length];
  const suffix = SUFFIXES[Math.floor(h / PREFIXES.length) % SUFFIXES.length];
  return prefix + suffix;
}

/** Get stored username from localStorage, generate if not exists. */
export function getOrCreateUsername(userId: number | string, email?: string): string {
  const key = 'mente_ai_username';
  try {
    const stored = localStorage.getItem(key);
    if (stored) return stored;
  } catch {}
  const seed = String(userId) + (email || '');
  const name = generateUsername(seed);
  try { localStorage.setItem(key, name); } catch {}
  return name;
}
