/**
 * ─── AGENT TONES ────────────────────────────────────────────────────────────
 * Sons procedurais por agente usando Tone.js.
 * Cada agente tem frequência única definida no canon de presença.
 * Uso: hover no MemoryGalaxy dispara tom do agente.
 * Progressive enhancement — silencioso se AudioContext bloqueado.
 */

'use client'

import * as Tone from 'tone'
import { getAgentFrequency } from '@/canon/agents/presence'

let initialized = false

async function ensureAudio(): Promise<boolean> {
  try {
    if (Tone.getContext().state !== 'running') {
      await Tone.start()
    }
    initialized = true
    return true
  } catch {
    return false
  }
}

/**
 * Toca o tom do agente por 300ms.
 * Volume baixo — é sutil, não intrusivo.
 * Chame no onMouseEnter do nó do agente.
 */
export async function playAgentTone(agentId: string): Promise<void> {
  const ready = await ensureAudio()
  if (!ready) return

  const frequency = getAgentFrequency(agentId)

  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.3,
      release: 0.5,
    },
    volume: -18, // sutil — não intrusivo
  }).toDestination()

  synth.triggerAttackRelease(frequency, '0.3')

  // Limpa após tocar
  setTimeout(() => synth.dispose(), 1000)
}

/**
 * Toca tom de desbloqueio — acorde suave ascendente.
 * Chame quando agente ativo é clicado.
 */
export async function playUnlockTone(agentId: string): Promise<void> {
  const ready = await ensureAudio()
  if (!ready) return

  const frequency = getAgentFrequency(agentId)

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.8 },
    volume: -15,
  }).toDestination()

  // Acorde: frequência base + terça + quinta
  synth.triggerAttackRelease(
    [frequency, frequency * 1.25, frequency * 1.5],
    '0.5'
  )

  setTimeout(() => synth.dispose(), 1500)
}

/**
 * Toca som de bloqueio — tom descendente.
 * Chame quando agente bloqueado é clicado.
 */
export async function playBlockedTone(): Promise<void> {
  const ready = await ensureAudio()
  if (!ready) return

  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 },
    volume: -20,
  }).toDestination()

  synth.triggerAttackRelease(220, '0.2')
  setTimeout(() => synth.dispose(), 800)
}
