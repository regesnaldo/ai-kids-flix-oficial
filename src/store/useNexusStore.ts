import { create } from "zustand";

interface NexusStore {
  particleSpeed: number;
  setParticleSpeed: (speed: number) => void;
}

export const useNexusStore = create<NexusStore>((set) => ({
  particleSpeed: 0.3,
  setParticleSpeed: (speed) => set({ particleSpeed: speed }),
}));