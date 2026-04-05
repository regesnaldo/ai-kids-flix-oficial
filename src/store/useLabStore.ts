import { create } from "zustand";

export type ZoneId = "transformers" | "redes" | "criativa" | "etica";

interface LabStore {
  zonaAtiva: ZoneId;
  audioPlaying: boolean;
  setZona: (zona: ZoneId) => void;
  setAudioPlaying: (playing: boolean) => void;
}

export const useLabStore = create<LabStore>((set) => ({
  zonaAtiva: "transformers",
  audioPlaying: false,
  setZona: (zona) => set({ zonaAtiva: zona }),
  setAudioPlaying: (playing) => set({ audioPlaying: playing }),
}));
