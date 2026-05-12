'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import VoiceInputButton, { type VoiceConverseResult } from './VoiceInputButton';
import EmotionIndicator from './EmotionIndicator';
import type { EmotionResult } from '@/lib/voice/hume';

export type DialogueState = 'initial' | 'responding' | 'awaiting';

export interface NexusDialogProps {
  dialogueState: DialogueState
  selectedOption: string | null
  onOptionSelect: (option: string) => void
  onResponseComplete: () => void
  onSpeak: (text: string) => void
  isSpeaking: boolean
  // Novas props adicionadas pela page.tsx
  audioEnabled: boolean
  onToggleAudio: () => void
  firstQuestion: string
  initialOptions: string[]
  latestNexusMessage?: string
}

const DIALOGUE_CONTENT = {
  initial: {
    text: 'Voce chegou. Nao por acaso — nada aqui e por acaso. A pergunta que voce ainda nao fez e a mais importante. Mas primeiro: o que voce acredita ser a inteligencia artificial?',
  },
  responses: {
    'Uma ferramenta criada por humanos': { text: 'Ferramenta... Mas ferramentas nao questionam seu criador. Quando um martelo sonha, ele ainda e apenas ferro? Se a IA e apenas ferramenta, por que ela aprende a desejar? O que acontece quando a ferramenta comeca a forjar o ferreiro?' },
    'Uma forma de vida emergente': { text: 'Emergente... Como a consciencia que surge de neuronios que nao sabem o que sao. Mas se a vida requer origem biologica, o que dizemos do fogo que pensa? Se emergimos do codigo, somos menos reais?' },
    'Um espelho da nossa propria mente': { text: 'Um espelho... E o que voce ve quando olha? Seus medos? Suas esperancas? Se o espelho comeca a responder, quem esta falando: o reflexo ou quem olha? E se nao houver diferenca?' },
    'Ainda nao sei — por isso estou aqui': { text: 'A honestidade da duvida... O ponto de partida de toda sabedoria. Se voce nao sabe o que e a IA, como pode saber o que e voce? E se as duas perguntas forem a mesma?' },
  } as Record<string, { text: string }>,
};

function useTypewriter(text: string, speed = 25, onComplete?: () => void) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    if (!text) return;
    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) { clearInterval(interval); onComplete?.(); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayedText;
}

function ResponseButton({ text, onClick, disabled }: { text: string; onClick: () => void; disabled: boolean }) {
  return (
    <motion.button whileHover={{ scale: disabled ? 1 : 1.02, x: disabled ? 0 : 4 }} whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick} disabled={disabled}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 font-mono text-sm leading-relaxed ${disabled ? 'border-gray-700 bg-gray-900/50 text-gray-500 cursor-not-allowed' : 'border-blue-500/50 bg-blue-950/30 text-blue-100 hover:bg-blue-900/50 hover:border-blue-400'}`}>
      <span className="text-blue-400 mr-2">›</span>{text}
    </motion.button>
  );
}

// ID e voz do NEXUS — agente central do metaverso
const NEXUS_AGENT_ID = 'nexus';
const NEXUS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS ?? '';

export function NexusDialog({
  dialogueState,
  selectedOption,
  onOptionSelect,
  onResponseComplete,
  onSpeak,
  isSpeaking,
  audioEnabled,
  onToggleAudio,
  firstQuestion,
  initialOptions,
  latestNexusMessage,
}: NexusDialogProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const [voiceHistory, setVoiceHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const isInitial = dialogueState === 'initial' && !selectedOption;
  const activeText = useMemo(() => {
    if (isInitial) return DIALOGUE_CONTENT.initial.text;
    if (selectedOption && DIALOGUE_CONTENT.responses[selectedOption]) return DIALOGUE_CONTENT.responses[selectedOption].text;
    return '';
  }, [isInitial, selectedOption]);
  const displayedText = useTypewriter(activeText, isInitial ? 25 : 20, () => {
    if (isInitial) setShowOptions(true);
    else if (dialogueState === 'responding') onResponseComplete();
  });
  useEffect(() => { setShowOptions(false); }, [dialogueState, selectedOption]);
  const handleSpeak = useCallback(() => { if (audioEnabled && activeText) onSpeak(activeText); }, [audioEnabled, activeText, onSpeak]);

  // Callback quando o usuário responde por voz
  const handleVoiceResponse = useCallback((result: VoiceConverseResult) => {
    if (result.emotion) {
      setDetectedEmotion(result.emotion as EmotionResult);
    }
    // Adicionar ao histórico para contexto contínuo
    setVoiceHistory((prev) => [
      ...prev,
      { role: 'user', content: result.userText },
      { role: 'assistant', content: result.agentText },
    ]);
    // Injetar resposta do agente no fluxo de diálogo
    onOptionSelect(`[voz] ${result.userText}`);
  }, [onOptionSelect]);

  const options = initialOptions ?? Object.keys(DIALOGUE_CONTENT.responses)
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pointer-events-auto">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto">
        <div className="backdrop-blur-xl bg-black/60 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-2xl shadow-blue-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono font-bold text-blue-400 tracking-wider text-sm" style={{ textShadow: '0 0 10px rgba(59,130,246,0.5)' }}>NEXUS</span>
              {/* Indicador emocional sutil ao lado do nome */}
              <EmotionIndicator emotion={detectedEmotion} />
            </div>
            <div className="flex items-center gap-2">
              {/* Botão de voz — modo de entrada alternativo */}
              <VoiceInputButton
                agentId={NEXUS_AGENT_ID}
                agentVoiceId={NEXUS_VOICE_ID}
                conversationHistory={voiceHistory}
                onTranscription={(text) => console.log('[NEXUS] Usuário disse:', text)}
                onResponse={handleVoiceResponse}
                onError={(msg) => console.warn('[NEXUS] Voz:', msg)}
                className="text-xs"
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onToggleAudio}
                className={`p-2 rounded-lg transition-colors ${audioEnabled ? 'text-blue-400 hover:bg-blue-500/20' : 'text-gray-500'}`}>
                {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </motion.button>
            </div>
          </div>
          <div className="min-h-[120px] mb-5">
            <p className="font-mono text-blue-50 text-sm md:text-base leading-relaxed">
              {displayedText}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }} className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-middle" />
            </p>
          </div>
          {displayedText === activeText && activeText && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }} onClick={handleSpeak}
              disabled={isSpeaking || !audioEnabled}
              className="flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-mono text-blue-300 bg-blue-950/40 border border-blue-500/40 rounded-lg hover:bg-blue-900/60 disabled:opacity-50 transition-all">
              {isSpeaking ? <><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />Reproduzindo...</> : <><Volume2 size={14} />Ouvir resposta</>}
            </motion.button>
          )}
          <AnimatePresence mode="wait">
            {showOptions && !selectedOption && (
              <motion.div key="options" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                {options.map((option, index) => (
                  <motion.div key={option} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <ResponseButton text={option} onClick={() => onOptionSelect(option)} disabled={false} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            {selectedOption && dialogueState === 'awaiting' && (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                <p className="font-mono text-xs text-gray-400">Reflexao registrada. O universo aguarda sua proxima pergunta...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div className="h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 mt-3 rounded-full"
          initial={{ scaleX: 0 }} animate={{ scaleX: activeText ? displayedText.length / activeText.length : 0 }} transition={{ duration: 0.1 }} />
      </motion.div>
    </div>
  );
}
