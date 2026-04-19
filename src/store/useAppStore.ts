import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ALL_AGENTS } from '@/canon/agents/all-agents';
import type { AgentDefinition } from '@/canon/agents/all-agents';

export type ZoneId = 'transformers' | 'redes' | 'criativa' | 'etica';

interface AppState {
  guideAgentId: string | null;
  setGuideAgent: (agentId: string) => void;
  getGuideAgent: () => AgentDefinition | undefined;
  clearGuideAgent: () => void;

  zonaAtiva: ZoneId;
  audioPlaying: boolean;
  setZona: (zona: ZoneId) => void;
  setAudioPlaying: (playing: boolean) => void;

  particleSpeed: number;
  setParticleSpeed: (value: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      guideAgentId: null,
      setGuideAgent: (agentId) => set({ guideAgentId: agentId }),
      getGuideAgent: () => {
        const id = get().guideAgentId;
        if (!id) return undefined;
        return ALL_AGENTS.find((agent) => agent.id === id);
      },
      clearGuideAgent: () => set({ guideAgentId: null }),

      zonaAtiva: 'transformers',
      audioPlaying: false,
      setZona: (zona) => set({ zonaAtiva: zona }),
      setAudioPlaying: (playing) => set({ audioPlaying: playing }),

      particleSpeed: 1,
      setParticleSpeed: (value) => set({ particleSpeed: value }),
    }),
    {
      name: 'mente-ai-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        guideAgentId: state.guideAgentId,
        zonaAtiva: state.zonaAtiva,
        particleSpeed: state.particleSpeed,
      }),
    }
  )
);