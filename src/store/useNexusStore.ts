import { create } from 'zustand';

interface NexusState {
  particleSpeed: number;
  setParticleSpeed: (value: number) => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  particleSpeed: 1,
  setParticleSpeed: (value) => set({ particleSpeed: value }),
}));
