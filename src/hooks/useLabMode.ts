"use client";

import { useState, useCallback } from "react";
import type { LabMode } from "@/types/lab";

export function useLabMode() {
  const [mode, setMode] = useState<LabMode>("fast");

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "fast" ? "complete" : "fast"));
  }, []);

  return { mode, setMode, toggleMode };
}
