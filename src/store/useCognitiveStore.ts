import { create } from 'zustand'
import { type AgentId, AGENT_ORDER } from '@/canon/agents/canon'

export type UserMood =
  | 'curious'
  | 'confused'
  | 'engaged'
  | 'frustrated'
  | 'excited'
  | 'neutral'

export interface InteractionRecord {
  agentId: AgentId
  role: 'user' | 'assistant'
  timestamp: number
}

export interface CognitiveState {
  userMood: UserMood
  curiosityLevel: number
  confusionLevel: number
  engagementLevel: number
  activeAgent: AgentId
  previousAgents: AgentId[]
  sessionStart: number
  messageCount: number
  interactionHistory: InteractionRecord[]
  pipelinePhase: 'idle' | 'running' | 'paused' | 'complete'
}

export interface CognitiveActions {
  setUserMood: (mood: UserMood) => void
  setCognitiveLevels: (levels: Partial<Pick<CognitiveState, 'curiosityLevel' | 'confusionLevel' | 'engagementLevel'>>) => void
  setActiveAgent: (agent: AgentId) => void
  recordInteraction: (agentId: AgentId, role: 'user' | 'assistant') => void
  setPipelinePhase: (phase: CognitiveState['pipelinePhase']) => void
  decayTick: () => void
  resetSession: () => void
}

function buildInitialState(): CognitiveState {
  return {
    userMood: 'neutral',
    curiosityLevel: 0.5,
    confusionLevel: 0,
    engagementLevel: 0.3,
    activeAgent: AGENT_ORDER[0],
    previousAgents: [],
    sessionStart: Date.now(),
    messageCount: 0,
    interactionHistory: [],
    pipelinePhase: 'idle',
  }
}

export const useCognitiveStore = create<CognitiveState & CognitiveActions>(
  (set, get) => ({
    ...buildInitialState(),

    setUserMood: (userMood) => set({ userMood }),

    setCognitiveLevels: (levels) =>
      set((s) => {
        const HYSTERESIS_THRESHOLD = 0.05
        const next: Partial<CognitiveState> = {}
        if (
          levels.curiosityLevel !== undefined &&
          Math.abs(levels.curiosityLevel - s.curiosityLevel) > HYSTERESIS_THRESHOLD
        ) {
          next.curiosityLevel = levels.curiosityLevel
        }
        if (
          levels.confusionLevel !== undefined &&
          Math.abs(levels.confusionLevel - s.confusionLevel) > HYSTERESIS_THRESHOLD
        ) {
          next.confusionLevel = levels.confusionLevel
        }
        if (
          levels.engagementLevel !== undefined &&
          Math.abs(levels.engagementLevel - s.engagementLevel) > HYSTERESIS_THRESHOLD
        ) {
          next.engagementLevel = levels.engagementLevel
        }
        return next
      }),

    setActiveAgent: (activeAgent) =>
      set((s) => ({
        activeAgent,
        previousAgents:
          s.activeAgent !== activeAgent
            ? [...s.previousAgents, s.activeAgent].slice(-10)
            : s.previousAgents,
      })),

    recordInteraction: (agentId, role) =>
      set((s) => ({
        messageCount: s.messageCount + 1,
        interactionHistory: [
          ...s.interactionHistory,
          { agentId, role, timestamp: Date.now() },
        ].slice(-100),
      })),

    setPipelinePhase: (pipelinePhase) => set({ pipelinePhase }),

    decayTick: () =>
      set((s) => ({
        confusionLevel: Math.max(0, +(s.confusionLevel - 0.02).toFixed(2)),
        curiosityLevel: Math.max(0.1, Math.min(1, +(s.curiosityLevel - 0.01).toFixed(2))),
        engagementLevel: Math.max(0.05, +(s.engagementLevel - 0.015).toFixed(2)),
      })),

    resetSession: () =>
      set({ ...buildInitialState(), sessionStart: Date.now() }),
  })
)
