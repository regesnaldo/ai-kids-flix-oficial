'use client';

export function calculateMatch(progress: number, level: number, affinity: number): number {
  const match = (progress * 0.4) + (level * 3 * 0.3) + (affinity * 0.3);
  return Math.min(Math.round(match), 99);
}

export function useMatchCalculator() {
  const calculate = (progress: number, level: number = 1, affinity: number = 50) => {
    return calculateMatch(progress, level, affinity);
  };
  return { calculate };
}
