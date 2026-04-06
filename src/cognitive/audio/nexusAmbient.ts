/**
 * nexusAmbient.ts — Motor de Áudio Ambiente do Universo NEXUS — MENTE.AI
 *
 * Gera um cosmos sonoro para o NEXUS:
 * - drones suaves
 * - pulsos rítmicos discretos
 * - transições lentas para sensação contemplativa
 */

import * as Tone from "tone";

let synth: Tone.PolySynth | null = null;
let loop: Tone.Loop | null = null;
let volume = 0.18;
let muted = false;
let state: "idle" | "playing" = "idle";
const listeners = new Set<(nextState: "idle" | "playing") => void>();

function emit(nextState: "idle" | "playing") {
  state = nextState;
  listeners.forEach((listener) => listener(nextState));
}

function applyVolume() {
  if (!synth) return;
  synth.volume.value = muted ? -40 : Tone.gainToDb(Math.max(0.0001, volume));
}

export async function iniciarNexusAmbient() {
  if (synth || loop) return;
  await Tone.start();

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 2, decay: 1, sustain: 0.4, release: 4 },
  }).toDestination();

  const notas = ["C3", "G3", "D4", "A3"];
  let idx = 0;

  loop = new Tone.Loop((time) => {
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

