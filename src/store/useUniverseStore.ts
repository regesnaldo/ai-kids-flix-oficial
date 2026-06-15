import { create } from 'zustand'

export interface UniverseMessage {
  role: 'universe' | 'user'
  content: string
  timestamp: number
}

export type IntroStep = 
  | 'fade-in' 
  | 'particles' 
  | 'voice' 
  | 'question' 
  | 'done'

export type DialogueState = 
  | 'awaiting' 
  | 'responding' 
  | 'speaking'

export interface UniverseProfile {
  archetypeLabel: string
  turnCount: number
  emotionalDim: string
  intellectualDim: string
  moralDim: string
  lastChoices: string[]
}

interface UniverseState {
  introSeen: boolean
  introStep: IntroStep
  dialogueState: DialogueState
  selectedOption: string | null
  isSpeaking: boolean
  audioEnabled: boolean
  profile: UniverseProfile
  messages: UniverseMessage[]
  
  markIntroSeen: () => void
  setIntroStep: (step: IntroStep) => void
  setDialogueState: (state: DialogueState) => void
  setSelectedOption: (option: string | null) => void
  setIsSpeaking: (speaking: boolean) => void
  setAudioEnabled: (enabled: boolean) => void
  updateProfile: (update: Partial<UniverseProfile>) => void
  addMessage: (message: UniverseMessage) => void
}

export const useUniverseStore = create<UniverseState>()((set) => ({
  introSeen: false,
  introStep: 'fade-in',
  dialogueState: 'awaiting',
  selectedOption: null,
  isSpeaking: false,
  audioEnabled: true,
  profile: {
    archetypeLabel: 'creative',
    turnCount: 0,
    emotionalDim: 'curiosidade',
    intellectualDim: 'intuitivo',
    moralDim: 'proteger',
    lastChoices: [],
  },
  messages: [],

  markIntroSeen: () => set({ introSeen: true, introStep: 'done' }),
  
  setIntroStep: (step: IntroStep) => set({ introStep: step }),
  
  setDialogueState: (state: DialogueState) => set({ dialogueState: state }),
  
  setSelectedOption: (option: string | null) => set({ selectedOption: option }),
  
  setIsSpeaking: (speaking: boolean) => set({ isSpeaking: speaking }),
  
  setAudioEnabled: (enabled: boolean) => set({ audioEnabled: enabled }),
  
  updateProfile: (update: Partial<UniverseProfile>) => set((state) => ({
    profile: { ...state.profile, ...update }
  })),
  
  addMessage: (message: UniverseMessage) => set((state) => ({
    messages: [...state.messages, message]
  })),
}))