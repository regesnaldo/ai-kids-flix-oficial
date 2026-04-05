// src/hooks/useClientRandomPositions.ts
import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useClientRandomPositions(count: number): Position[] {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    // Gera as posições apenas após a montagem no cliente
    const generatedPositions = Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setPositions(generatedPositions);
  }, [count]);

  return positions;
}