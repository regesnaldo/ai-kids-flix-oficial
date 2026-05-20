'use client'

import { useState, useCallback } from 'react'
import type { VisualStory, StoryScene } from '@/components/visuals/VisualStoryPlayer'

// ─── Types ──────────────────────────────────────────────────────────────────

interface UseVisualStoryReturn {
  /** The complete story object (null while loading) */
  story: VisualStory | null
  /** Current scene data */
  currentScene: StoryScene | null
  /** Current scene index (0-based) */
  currentSceneIndex: number
  /** Whether the API call is in progress */
  isLoading: boolean
  /** Error message if API failed */
  error: string | null
  /** Whether the player modal should be visible */
  isPlaying: boolean
  /** Request a visual story for a topic */
  requestStory: (topic: string, frames?: number, language?: string) => Promise<void>
  /** Go to next scene */
  nextScene: () => void
  /** Go to previous scene */
  prevScene: () => void
  /** Close the player */
  closePlayer: () => void
  /** Replay from beginning */
  replay: () => void
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useVisualStory(): UseVisualStoryReturn {
  const [story, setStory] = useState<VisualStory | null>(null)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const requestStory = useCallback(async (
    topic: string,
    frames = 5,
    language = 'pt-BR'
  ) => {
    setIsLoading(true)
    setError(null)
    setStory(null)
    setCurrentSceneIndex(0)

    try {
      const response = await fetch('/api/visuals/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, frames, language }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Falha ao gerar história visual')
        return
      }

      setStory(data as VisualStory)
      setIsPlaying(true)
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Verifique sua conexão.')
      console.error('[useVisualStory] fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const nextScene = useCallback(() => {
    if (!story) return
    setCurrentSceneIndex(prev => Math.min(prev + 1, story.scenes.length - 1))
  }, [story])

  const prevScene = useCallback(() => {
    setCurrentSceneIndex(prev => Math.max(prev - 1, 0))
  }, [])

  const closePlayer = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const replay = useCallback(() => {
    setCurrentSceneIndex(0)
    setIsPlaying(true)
  }, [])

  return {
    story,
    currentScene: story?.scenes[currentSceneIndex] ?? null,
    currentSceneIndex,
    isLoading,
    error,
    isPlaying,
    requestStory,
    nextScene,
    prevScene,
    closePlayer,
    replay,
  }
}
