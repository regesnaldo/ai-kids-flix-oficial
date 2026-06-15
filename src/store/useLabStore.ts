import { create } from 'zustand'
import { type AgentId, AGENTS } from '@/canon/agents/canon'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  agentId: AgentId
  content: string
  timestamp: number
}

export type SceneMood = 'idle' | 'thinking' | 'speaking' | 'transition'

interface LabState {
  sceneMood: SceneMood
  activeAgent: AgentId
  sceneColor: string
  chatIntensity: number

  messages: ChatMessage[]
  isChatLoading: boolean

  setSceneMood: (mood: SceneMood) => void
  setActiveAgent: (agent: AgentId) => void
  pulseChat: () => void
  addMessage: (msg: ChatMessage) => void
  setChatLoading: (v: boolean) => void
}

export const useLabStore = create<LabState>((set) => ({
  sceneMood: 'idle',
  activeAgent: 'nexus',
  sceneColor: '#00f5ff',
  chatIntensity: 0,

  messages: [],
  isChatLoading: false,

  setSceneMood: (sceneMood) => set({ sceneMood }),

  setActiveAgent: (activeAgent) =>
    set({ activeAgent, sceneColor: AGENTS[activeAgent].identity.color }),

  pulseChat: () => {
    set({ chatIntensity: Date.now() })
  },

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, msg].slice(-200),
    })),

  setChatLoading: (isChatLoading) => set({ isChatLoading }),
}))
