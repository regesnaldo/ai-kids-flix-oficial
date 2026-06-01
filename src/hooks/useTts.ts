'use client'

import { useCallback, useRef } from 'react'

export function useTts(voiceId?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!text?.trim()) return
    try {
      const res = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice_id: voiceId || undefined,
        }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      const audio = new Audio(url)
      audioRef.current = audio
      return new Promise((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve() }
        audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve() }
        audio.play().catch(() => { URL.revokeObjectURL(url); audioRef.current = null; resolve() })
      })
    } catch (err) {
      console.warn('[useTts] Failed to speak:', err)
    }
  }, [voiceId])

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
  }, [])

  return { speak, stop }
}
