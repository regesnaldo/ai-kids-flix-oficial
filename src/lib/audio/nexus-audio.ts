/**
 * ─── NEXUS AUDIO ENGINE ───────────────────────────────────────────
 *
 * Tone.js audio engine for the NEXUS Cosmos scene.
 * Exports: initAudio, createAmbientDrone, playNucleusHover,
 *          playNucleusClick, stopAmbientDrone, NexusDroneHandle
 *
 * Direction: Damien Chazelle — sound as narrative, silence as impact.
 * Low frequencies: sine C1 + G1 as ambient drone.
 * Interaction: sine G2 (hover), MetalSynth G3 (click).
 * Fade in: attack envelope 4-6s. Fade out: Volume ramp + triggerRelease.
 *
 * Lazy-loads Tone.js to avoid bloating initial bundle.
 */

export interface NexusDroneHandle {
  drone1: { triggerRelease: (time?: string) => void }
  drone2: { triggerRelease: (time?: string) => void }
  stop: (fadeOutMs?: number) => Promise<void>
}

let toneStarted = false

export async function initAudio(): Promise<void> {
  if (toneStarted) return
  const { start } = await import('tone')
  await start()
  toneStarted = true
}

export async function createAmbientDrone(): Promise<NexusDroneHandle> {
  const { Synth, Reverb, Volume } = await import('tone')
  if (!toneStarted) await initAudio()

  const vol = new Volume(-20).toDestination()
  const reverb = new Reverb({ decay: 8, wet: 0.8 }).connect(vol)

  const drone1 = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 4, decay: 0, sustain: 1, release: 6 },
  }).connect(reverb)

  const drone2 = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 6, decay: 0, sustain: 1, release: 8 },
  }).connect(reverb)

  drone1.triggerAttack('C1')
  setTimeout(() => drone2.triggerAttack('G1'), 2000)

  const stop = async (fadeOutMs = 2000): Promise<void> => {
    drone1.triggerRelease()
    drone2.triggerRelease()
    await new Promise(resolve => setTimeout(resolve, fadeOutMs))
  }

  return { drone1, drone2, stop }
}

export async function playNucleusHover(): Promise<void> {
  const { Synth, Reverb } = await import('tone')
  if (!toneStarted) await initAudio()

  const reverb = new Reverb({ decay: 2, wet: 0.5 }).toDestination()
  const synth = new Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 1 },
    volume: -25,
  }).connect(reverb)

  synth.triggerAttackRelease('G2', '0.3')
}

export async function playNucleusClick(): Promise<void> {
  const { MetalSynth, Reverb } = await import('tone')
  if (!toneStarted) await initAudio()

  const reverb = new Reverb({ decay: 6, wet: 0.9 }).toDestination()
  const metal = new MetalSynth({
    envelope: { attack: 0.001, decay: 0.4, release: 4 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
    volume: -18,
  }).connect(reverb)

  metal.triggerAttackRelease('G3', '32n')
}

export async function stopAmbientDrone(
  drone: NexusDroneHandle | null,
  fadeOutMs = 2000
): Promise<void> {
  if (!drone) return
  await drone.stop(fadeOutMs)
}
