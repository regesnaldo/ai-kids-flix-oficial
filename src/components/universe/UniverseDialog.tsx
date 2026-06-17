'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface UniverseDialogProps {
  dialogueState: 'awaiting' | 'responding' | 'speaking'
  selectedOption: string | null
  onOptionSelect: (option: string) => void
  onResponseComplete: () => void
  onSpeak: (text: string) => void
  isSpeaking: boolean
  audioEnabled: boolean
  onToggleAudio: () => void
  firstQuestion: string
  initialOptions: string[]
  latestUniverseMessage?: string
  themeColors: {
    primary: string
    accent: string
    background: string
  }
}

export default function UniverseDialog({
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
  latestUniverseMessage,
  themeColors,
}: UniverseDialogProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [showFirstResponse, setShowFirstResponse] = useState(false)

  useEffect(() => {
    if (dialogueState === 'awaiting' && !showFirstResponse) {
      const timer = setTimeout(() => {
        setShowFirstResponse(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [dialogueState, showFirstResponse])

  useEffect(() => {
    if (dialogueState === 'awaiting' && selectedOption) {
      const timer = setTimeout(() => {
        setShowOptions(true)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setShowOptions(false)
    }
  }, [dialogueState, selectedOption])

  useEffect(() => {
    if (dialogueState === 'speaking' && latestUniverseMessage) {
      const timer = setTimeout(() => {
        onResponseComplete()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [dialogueState, latestUniverseMessage, onResponseComplete])

  return (
    <div className="pointer-events-auto flex flex-col items-center justify-end h-full pb-8 px-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {dialogueState === 'responding' && (
            <motion.div
              key="responding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div
                className="inline-block px-6 py-3 rounded-xl text-lg"
                style={{
                  backgroundColor: `${themeColors.primary}20`,
                  border: `1px solid ${themeColors.primary}40`,
                  color: themeColors.primary,
                }}
              >
                <span className="animate-pulse">Pensando...</span>
              </div>
            </motion.div>
          )}

          {dialogueState === 'speaking' && latestUniverseMessage && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <button
                onClick={() => onSpeak(latestUniverseMessage)}
                disabled={isSpeaking}
                className="inline-block px-6 py-4 rounded-xl text-lg"
                style={{
                  backgroundColor: `${themeColors.primary}15`,
                  border: `1px solid ${themeColors.primary}30`,
                  color: themeColors.primary,
                }}
              >
                {isSpeaking ? '🔊 Reproduzindo...' : '🔊 Ouvir'}
              </button>
            </motion.div>
          )}

          {dialogueState === 'awaiting' && showFirstResponse && !selectedOption && (
            <motion.div
              key="first-question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div
                className="px-6 py-4 rounded-xl text-xl text-center"
                style={{
                  backgroundColor: `${themeColors.primary}10`,
                  border: `1px solid ${themeColors.primary}20`,
                  color: themeColors.primary,
                }}
              >
                {firstQuestion}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {initialOptions.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={() => onOptionSelect(option)}
                    className="px-5 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${themeColors.primary}20`,
                      border: `1px solid ${themeColors.primary}40`,
                      color: themeColors.primary,
                    }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {dialogueState === 'awaiting' && showOptions && selectedOption && (
            <motion.div
              key="followup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Você: {selectedOption}
              </div>

              <button
                onClick={onToggleAudio}
                className="text-xs opacity-50 hover:opacity-100"
                style={{ color: themeColors.primary }}
              >
                {audioEnabled ? '🔊 Som ativado' : '🔇 Som desligado'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}