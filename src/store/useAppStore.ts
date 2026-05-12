import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ALL_AGENTS } from '@/canon/agents/all-agents';
import type { AgentDefinition } from '@/canon/agents/all-agents';

export type ZoneId = 'transformers' | 'redes' | 'criativa' | 'etica';

// ── Intro cinematográfica ─────────────────────────────────────────────────────
export type IntroStep = 'fade-in' | 'particles' | 'voice' | 'question' | 'done';

// ── Diálogo ───────────────────────────────────────────────────────────────────
// Must match NexusDialog.DialogueState exactly
export type DialogueState = 'initial' | 'responding' | 'awaiting';

// ── Mensagens ─────────────────────────────────────────────────────────────────
export interface NexusMessage {
  role: 'user' | 'nexus';
  content: string;
  timestamp: number;
}

// ── Perfil unificado do usuário ───────────────────────────────────────────────
// Contém tanto dimensões numéricas (scoring interno) quanto strings (nexus-orchestrator)
export interface NexusProfile {
  archetypeLabel: string;
  turnCount: number;
  // Dimensões numéricas — usadas para classificação de arquétipo
  emotional: number;
  intellectual: number;
  moral: number;
  // Dimensões categóricas — usadas por nexus-orchestrator para adaptar prompts
  emotionalDim: string;    // 'medo' | 'rebeldia' | 'empatia' | 'curiosidade'
  intellectualDim: string; // 'logico' | 'intuitivo'
  moralDim: string;        // 'proteger' | 'expandir'
  lastChoices: string[];   // últimas 10 escolhas para detecção de estagnação
}

// UserProfile é o mesmo tipo — nexus-orchestrator e nexus/page.tsx usam este alias
export type UserProfile = NexusProfile;

const DEFAULT_PROFILE: NexusProfile = {
  archetypeLabel: 'explorador',
  turnCount: 0,
  emotional: 0,
  intellectual: 0,
  moral: 0,
  emotionalDim: '',
  intellectualDim: '',
  moralDim: '',
  lastChoices: [],
};

interface AppState {
  // ── Guide agent ────────────────────────────────────────────────────────────
  guideAgentId: string | null;
  setGuideAgent: (agentId: string) => void;
  getGuideAgent: () => AgentDefinition | undefined;
  clearGuideAgent: () => void;

  // ── Lab zone & audio ───────────────────────────────────────────────────────
  zonaAtiva: ZoneId;
  audioPlaying: boolean;
  setZona: (zona: ZoneId) => void;
  setAudioPlaying: (playing: boolean) => void;

  particleSpeed: number;
  setParticleSpeed: (value: number) => void;

  // ── Intro cinematográfica do NEXUS ─────────────────────────────────────────
  introSeen: boolean;
  introStep: IntroStep;
  markIntroSeen: () => void;
  setIntroStep: (step: IntroStep) => void;

  // ── Estado do diálogo ──────────────────────────────────────────────────────
  dialogueState: DialogueState;
  selectedOption: string | null;
  setDialogueState: (state: DialogueState) => void;
  setSelectedOption: (option: string | null) => void;

  // ── Áudio do NEXUS ─────────────────────────────────────────────────────────
  isSpeaking: boolean;
  audioEnabled: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;

  // ── Perfil invisível ───────────────────────────────────────────────────────
  profile: NexusProfile;
  updateProfile: (option: string) => void;

  // ── Histórico de mensagens ─────────────────────────────────────────────────
  messages: NexusMessage[];
  addMessage: (message: NexusMessage) => void;
  clearMessages: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Guide agent ──────────────────────────────────────────────────────
      guideAgentId: null,
      setGuideAgent: (agentId) => set({ guideAgentId: agentId }),
      getGuideAgent: () => {
        const id = get().guideAgentId;
        if (!id) return undefined;
        return ALL_AGENTS.find((agent) => agent.id === id);
      },
      clearGuideAgent: () => set({ guideAgentId: null }),

      // ── Lab zone & audio ─────────────────────────────────────────────────
      zonaAtiva: 'transformers',
      audioPlaying: false,
      setZona: (zona) => set({ zonaAtiva: zona }),
      setAudioPlaying: (playing) => set({ audioPlaying: playing }),

      particleSpeed: 1,
      setParticleSpeed: (value) => set({ particleSpeed: value }),

      // ── Intro cinematográfica ────────────────────────────────────────────
      introSeen: false,
      introStep: 'fade-in',
      markIntroSeen: () => set({ introSeen: true, introStep: 'done' }),
      setIntroStep: (step) => set({ introStep: step }),

      // ── Estado do diálogo ────────────────────────────────────────────────
      dialogueState: 'initial',
      selectedOption: null,
      setDialogueState: (state) => set({ dialogueState: state }),
      setSelectedOption: (option) => set({ selectedOption: option }),

      // ── Áudio ────────────────────────────────────────────────────────────
      isSpeaking: false,
      audioEnabled: true,
      setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

      // ── Perfil invisível ─────────────────────────────────────────────────
      profile: DEFAULT_PROFILE,
      updateProfile: (option) =>
        set((state) => {
          const lower = option.toLowerCase();

          // Numeric scoring
          const emotional =
            state.profile.emotional +
            (/(emoc|sent|empath|medo|feliz|triste|empat)/.test(lower) ? 1 : 0);
          const intellectual =
            state.profile.intellectual +
            (/(logic|analít|razão|dado|estrat|analítico|intelectual)/.test(lower) ? 1 : 0);
          const moral =
            state.profile.moral +
            (/(ética|moral|justo|proteç|responsab|humanidade)/.test(lower) ? 1 : 0);

          const turnCount = state.profile.turnCount + 1;

          // Archetype label from numeric scores
          const archetypeLabel =
            emotional >= intellectual && emotional >= moral
              ? 'empático'
              : intellectual >= moral
                ? 'analítico'
                : 'ético';

          // Derive string dims from option text (for nexus-orchestrator prompt adaptation)
          const emotionalDim = /(medo|hesit|mied)/.test(lower)
            ? 'medo'
            : /(rebel|provoc|questio)/.test(lower)
              ? 'rebeldia'
              : /(empat|cuidad|humanidade)/.test(lower)
                ? 'empatia'
                : /(curios|explorar|aprender|descobr)/.test(lower)
                  ? 'curiosidade'
                  : state.profile.emotionalDim;

          const intellectualDim = /(ferramenta|dado|lógic|analít|precis|estrut)/.test(lower)
            ? 'logico'
            : /(poesia|metáfor|sentir|intuiç|imagem)/.test(lower)
              ? 'intuitivo'
              : state.profile.intellectualDim;

          const moralDim = /(proteç|segur|limit|humanidade|responsab)/.test(lower)
            ? 'proteger'
            : /(expand|poder|crescer|futuro|potenc)/.test(lower)
              ? 'expandir'
              : state.profile.moralDim;

          // Keep last 10 choices for stagnation detection
          const lastChoices = [...state.profile.lastChoices, option].slice(-10);

          return {
            profile: {
              ...state.profile,
              emotional, intellectual, moral,
              turnCount, archetypeLabel,
              emotionalDim, intellectualDim, moralDim,
              lastChoices,
            },
          };
        }),

      // ── Mensagens ────────────────────────────────────────────────────────
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'mente-ai-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        guideAgentId: state.guideAgentId,
        zonaAtiva: state.zonaAtiva,
        particleSpeed: state.particleSpeed,
        introSeen: state.introSeen,
        audioEnabled: state.audioEnabled,
        profile: state.profile,
        messages: state.messages,
      }),
    }
  )
);
