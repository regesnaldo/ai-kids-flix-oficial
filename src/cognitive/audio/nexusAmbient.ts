/**
 * nexusAmbient.ts — Motor de Áudio Ambiente do Universo NEXUS — MENTE.AI
 *
 * Gera um cosmos sonoro para o NEXUS:
 * - drones suaves
 * - pulsos rítmicos discretos
 * - transições lentas para sensação contemplativa
 */

// Tone.js é importado de forma lazy para evitar erros de SSR no Next.js
// (ver Bug #04 no CLAUDE.md — Tone.js causa NotSupportedError no servidor)
type ToneModule = typeof import("tone");

let toneInstance: ToneModule | null = null;

async function getTone(): Promise<ToneModule> {
  if (!toneInstance) {
    toneInstance = await import("tone");
  }
  return toneInstance;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let synth: any | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loop: any | null = null;
let volume = 0.18;
let muted = false;
let state: "idle" | "playing" = "idle";
const listeners = new Set<(nextState: "idle" | "playing") => void>();

function emit(nextState: "idle" | "playing") {
  state = nextState;
  listeners.forEach((listener) => listener(nextState));
}

function gainToDb(gain: number): number {
  return 20 * Math.log10(Math.max(0.0001, gain));
}

function applyVolume() {
  if (!synth) return;
  synth.volume.value = muted ? -40 : gainToDb(volume);
}

export async function iniciarNexusAmbient() {
  if (synth || loop) return;
  const Tone = await getTone();
  await Tone.start();

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 2, decay: 1, sustain: 0.4, release: 4 },
  }).toDestination();

  const notas = ["C3", "G3", "D4", "A3"];
  let idx = 0;

  loop = new Tone.Loop((time: number) => {
    if (!synth) return;
    synth.triggerAttackRelease(notas[idx % notas.length], "2n", time, 0.12);
    idx += 1;
  }, "1m");

  loop.start(0);
  Tone.Transport.bpm.value = 56;
  Tone.Transport.start();
  applyVolume();
  emit("playing");
}

export function pararNexusAmbient() {
  loop?.stop();
  loop?.dispose();
  loop = null;
  synth?.dispose();
  synth = null;
  emit("idle");
}

export const nexusAmbient = {
  async start() {
    await iniciarNexusAmbient();
  },
  stop() {
    pararNexusAmbient();
  },
  setVolume(nextVolume: number) {
    volume = Math.max(0, Math.min(1, nextVolume));
    applyVolume();
  },
  mute() {
    muted = true;
    applyVolume();
  },
  unmute() {
    muted = false;
    applyVolume();
  },
  subscribe(listener: (nextState: "idle" | "playing") => void) {
    listeners.add(listener);
    listener(state);
    return () => {
      listeners.delete(listener);
    };
  },
};

