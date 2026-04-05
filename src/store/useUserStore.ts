import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ALL_AGENTS } from '@/canon/agents/all-agents';
import type { AgentDefinition } from '@/canon/agents/all-agents';

interface UserState {
  guideAgentId: string | null;
  setGuideAgent: (agentId: string) => void;
  getGuideAgent: () => AgentDefinition | undefined;
  clearGuideAgent: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      guideAgentId: null,
      
      setGuideAgent: (agentId) => set({ guideAgentId: agentId }),
      
      getGuideAgent: () => {
        const id = get().guideAgentId;
        if (!id) return undefined;
        return ALL_AGENTS.find(agent => agent.id === id);
      },
      
      clearGuideAgent: () => set({ guideAgentId: null }),
    }),
    {
      name: 'mente-ai-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
