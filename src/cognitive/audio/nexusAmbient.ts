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
}

export function pararNexusAmbient() {
  loop?.stop();
  loop?.dispose();
  loop = null;
  synth?.dispose();
  synth = null;
}

