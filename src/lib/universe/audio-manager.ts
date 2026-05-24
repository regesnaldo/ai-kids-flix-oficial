/**
 * ─── AUDIO MANAGER — Singleton Runtime Audio System ───────────────────────────
 *
 * Rules:
 *   - Singleton architecture — one AudioContext for the entire app
 *   - Lazy initialization — AudioContext created on first user interaction
 *   - NO autoplay — audio only reacts through events
 *   - NO audio logic inside React components
 *   - Audio signatures map to procedural sound generation via Tone.js
 *   - Each planet has a distinct sonic identity
 */

import * as Tone from "tone";
import { planetRegistry, type PlanetId, type AudioSignature } from "./planet-registry";
import { universeBus } from "./event-bus";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type AudioState = "idle" | "active" | "suspended";

interface ActiveSound {
  signature: AudioSignature;
  dispose: () => void;
  volume: Tone.Volume;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** Master output gain (ambient — barely audible) */
const MASTER_GAIN = 0.08;

/** Crossfade duration in seconds */
const CROSSFADE_S = 2;

// ─── SINGLETON ────────────────────────────────────────────────────────────────

class AudioManager {
  private state: AudioState = "idle";
  private initialized = false;
  private masterVolume: Tone.Volume | null = null;
  private reverb: Tone.Reverb | null = null;
  private activeSounds = new Map<PlanetId, ActiveSound>();

  /**
   * Initialize the audio system.
   * MUST be called from a user gesture handler (click, keypress).
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await Tone.start();
      this.masterVolume = new Tone.Volume(MASTER_GAIN).toDestination();

      // Shared reverb for spatial depth
      this.reverb = new Tone.Reverb({ decay: 3, wet: 0.15 });
      this.reverb.connect(this.masterVolume);

      this.state = "active";
      this.initialized = true;
      this.subscribeToEvents();
    } catch (err) {
      console.warn("[AudioManager] Init failed:", err);
    }
  }

  /** Resume a suspended context. */
  async resume(): Promise<void> {
    if (this.state === "suspended" && Tone.getContext().state === "suspended") {
      await Tone.getContext().resume();
      this.state = "active";
    }
  }

  /** Suspend audio (save resources). */
  async suspend(): Promise<void> {
    if (this.state === "active") {
      await Tone.getContext().suspend();
      this.state = "suspended";
    }
  }

  /** Set master volume (0–1). */
  setVolume(value: number): void {
    if (this.masterVolume) {
      this.masterVolume.volume.rampTo(
        Tone.gainToDb(Math.max(0, Math.min(1, value))),
        0.5
      );
    }
  }

  getState(): AudioState {
    return this.state;
  }

  isAvailable(): boolean {
    return this.initialized;
  }

  /**
   * Play a procedural audio signature for a planet.
   * Crossfades if another planet is already playing.
   */
  playSignature(planetId: PlanetId): void {
    if (!this.initialized || !this.masterVolume) return;

    const planet = planetRegistry[planetId];
    const signature = planet.audioSignature;

    // void is silence — stop anything playing and return
    if (signature === "void") {
      this.fadeOutActive();
      return;
    }

    // Crossfade if another planet is active
    this.fadeOutActive();

    const sound = this.createSignature(planetId, signature);
    this.activeSounds.set(planetId, sound);

    // Fade in
    sound.volume.volume.value = -60;
    sound.volume.volume.rampTo(-6, CROSSFADE_S);
  }

  /** Stop audio for a specific planet with fade out. */
  stopSignature(planetId: PlanetId): void {
    const sound = this.activeSounds.get(planetId);
    if (sound) {
      sound.volume.volume.rampTo(-60, 1);
      setTimeout(() => {
        sound.dispose();
        this.activeSounds.delete(planetId);
      }, 1100);
    }
  }

  /** Stop all audio immediately. */
  stopAll(): void {
    for (const [, sound] of this.activeSounds) {
      sound.dispose();
    }
    this.activeSounds.clear();
  }

  // ── CROSSFADE ───────────────────────────────────────────────────────────

  private fadeOutActive(): void {
    for (const [id, sound] of this.activeSounds) {
      sound.volume.volume.rampTo(-60, CROSSFADE_S);
      setTimeout(() => {
        sound.dispose();
        this.activeSounds.delete(id);
      }, CROSSFADE_S * 1000 + 100);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNATURE GENERATORS
  // ═══════════════════════════════════════════════════════════════════════════

  private createSignature(
    planetId: PlanetId,
    signature: AudioSignature
  ): ActiveSound {
    const volume = new Tone.Volume(-6);
    volume.connect(this.masterVolume!);

    // Optional: route through reverb for spatial depth
    const reverbSend = new Tone.Volume(-12);
    reverbSend.connect(this.reverb!);
    volume.connect(reverbSend);

    let dispose: () => void;

    switch (signature) {
      case "low-hum":
        dispose = this.buildLowHum(volume);
        break;
      case "pulse":
        dispose = this.buildPulse(volume);
        break;
      case "harmonic":
        dispose = this.buildHarmonic(volume);
        break;
      case "dissonant":
        dispose = this.buildDissonant(volume);
        break;
      case "bass-drone":
        dispose = this.buildBassDrone(volume);
        break;
      case "crystal":
        dispose = this.buildCrystal(volume);
        break;
      case "static":
        dispose = this.buildStatic(volume);
        break;
      case "choir":
        dispose = this.buildChoir(volume);
        break;
      case "rhythmic":
        dispose = this.buildRhythmic(volume);
        break;
      case "digital":
        dispose = this.buildDigital(volume);
        break;
      case "organic":
        dispose = this.buildOrganic(volume);
        break;
      case "void":
        dispose = () => {}; // silence — nothing to dispose
        break;
      default:
        dispose = () => {};
    }

    return { signature, dispose, volume };
  }

  // ── NEXUS: low-hum — deep grounding sine ────────────────────────────────
  private buildLowHum(output: Tone.Volume): () => void {
    const osc = new Tone.Oscillator({
      type: "sine",
      frequency: 55,
      volume: -12,
    }).connect(output);
    osc.start();

    // Subtle LFO on frequency for organic movement
    const lfo = new Tone.LFO({
      frequency: 0.1,
      min: 54.5,
      max: 55.5,
    }).connect(osc.frequency);
    lfo.start();

    return () => {
      osc.stop();
      osc.dispose();
      lfo.stop();
      lfo.dispose();
    };
  }

  // ── VOLT: pulse — rhythmic low-frequency electric ───────────────────────
  private buildPulse(output: Tone.Volume): () => void {
    const osc = new Tone.Oscillator({
      type: "square",
      frequency: 40,
      volume: -20,
    }).connect(output);

    // Rhythmic amplitude modulation
    const lfo = new Tone.LFO({
      frequency: 1.5,
      min: -30,
      max: -8,
    }).connect(osc.volume as any);
    lfo.start();

    osc.start();

    return () => {
      osc.stop();
      osc.dispose();
      lfo.stop();
      lfo.dispose();
    };
  }

  // ── LYRA: harmonic — layered sine waves (fundamental + octave + fifth) ──
  private buildHarmonic(output: Tone.Volume): () => void {
    const fundamentals = [130.81, 261.63, 392.0]; // C3, C4, G4
    const oscillators: Tone.Oscillator[] = [];
    const lfos: Tone.LFO[] = [];

    for (const freq of fundamentals) {
      const osc = new Tone.Oscillator({
        type: "sine",
        frequency: freq,
        volume: -18,
      }).connect(output);
      osc.start();
      oscillators.push(osc);

      // Gentle pitch drift for choral warmth
      const lfo = new Tone.LFO({
        frequency: 0.08 + Math.random() * 0.04,
        min: freq - 0.5,
        max: freq + 0.5,
      }).connect(osc.frequency);
      lfo.start();
      lfos.push(lfo);
    }

    return () => {
      for (const osc of oscillators) {
        osc.stop();
        osc.dispose();
      }
      for (const lfo of lfos) {
        lfo.stop();
        lfo.dispose();
      }
    };
  }

  // ── KAOS: dissonant — detuned sawtooths creating tension ────────────────
  private buildDissonant(output: Tone.Volume): () => void {
    const osc1 = new Tone.Oscillator({
      type: "sawtooth",
      frequency: 110,
      volume: -22,
    }).connect(output);

    const osc2 = new Tone.Oscillator({
      type: "sawtooth",
      frequency: 113, // +3Hz detune = beating/tension
      volume: -22,
    }).connect(output);

    // Slow filter sweep for evolving texture
    const filter = new Tone.Filter({
      type: "lowpass",
      frequency: 400,
      rolloff: -12,
    });
    osc1.disconnect(output);
    osc2.disconnect(output);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(output);

    const filterLfo = new Tone.LFO({
      frequency: 0.05,
      min: 200,
      max: 800,
    }).connect(filter.frequency);
    filterLfo.start();

    osc1.start();
    osc2.start();

    return () => {
      osc1.stop();
      osc1.dispose();
      osc2.stop();
      osc2.dispose();
      filterLfo.stop();
      filterLfo.dispose();
      filter.dispose();
    };
  }

  // ── AXIOM: bass-drone — sub-bass foundation with filtered noise ─────────
  private buildBassDrone(output: Tone.Volume): () => void {
    // Sub-bass sine
    const osc = new Tone.Oscillator({
      type: "sine",
      frequency: 32.7, // C1
      volume: -14,
    }).connect(output);
    osc.start();

    // Filtered noise for texture
    const noise = new Tone.Noise("pink").start();
    const noiseFilter = new Tone.Filter({
      type: "lowpass",
      frequency: 150,
      rolloff: -24,
    });
    const noiseVol = new Tone.Volume(-30);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseVol);
    noiseVol.connect(output);

    return () => {
      osc.stop();
      osc.dispose();
      noise.stop();
      noise.dispose();
      noiseFilter.dispose();
      noiseVol.dispose();
    };
  }

  // ── PRISM: crystal — FM bell-like tones with shimmer ────────────────────
  private buildCrystal(output: Tone.Volume): () => void {
    const fm = new Tone.FMSynth({
      harmonicity: 3.01,
      modulationIndex: 5,
      oscillator: { type: "sine" },
      modulation: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0,
        release: 1.2,
      },
      volume: -18,
    }).connect(output);

    // Trigger bell-like tones on a loop
    const notes = ["C5", "E5", "G5", "B5", "C6", "B5", "G5", "E5"];
    let index = 0;

    const loop = new Tone.Loop((time) => {
      fm.triggerAttackRelease(notes[index % notes.length], "8n", time);
      index++;
    }, "4n");

    // Random octave jumps for unpredictability
    const interval = setInterval(() => {
      index += Math.floor(Math.random() * 3);
    }, 4000);

    loop.start(0);

    return () => {
      loop.stop();
      loop.dispose();
      fm.dispose();
      clearInterval(interval);
    };
  }

  // ── JANUS: static — filtered noise, liminal space ───────────────────────
  private buildStatic(output: Tone.Volume): () => void {
    const noise = new Tone.Noise("pink").start();

    const bandpass = new Tone.Filter({
      type: "bandpass",
      frequency: 1000,
      Q: 2,
    });

    const noiseVol = new Tone.Volume(-24);
    noise.connect(bandpass);
    bandpass.connect(noiseVol);
    noiseVol.connect(output);

    // Slow bandpass sweep
    const sweepLfo = new Tone.LFO({
      frequency: 0.03,
      min: 400,
      max: 2000,
    }).connect(bandpass.frequency);
    sweepLfo.start();

    // Occasional crackle via gain modulation
    const crackleLfo = new Tone.LFO({
      frequency: 0.2,
      min: -35,
      max: -20,
    }).connect(noiseVol.volume as any);
    crackleLfo.start();

    return () => {
      noise.stop();
      noise.dispose();
      bandpass.dispose();
      noiseVol.dispose();
      sweepLfo.stop();
      sweepLfo.dispose();
      crackleLfo.stop();
      crackleLfo.dispose();
    };
  }

  // ── ETHOS: choir — layered voices with slow drift ───────────────────────
  private buildChoir(output: Tone.Volume): () => void {
    const voices = [
      { freq: 196, detune: 0 },    // G3
      { freq: 246.94, detune: 2 },  // B3
      { freq: 293.66, detune: -1 }, // D4
      { freq: 392, detune: 1 },     // G4
    ];

    const oscillators: Tone.Oscillator[] = [];
    const lfos: Tone.LFO[] = [];

    for (const voice of voices) {
      const osc = new Tone.Oscillator({
        type: "sine",
        frequency: voice.freq,
        volume: -22,
        detune: voice.detune,
      }).connect(output);
      osc.start();
      oscillators.push(osc);

      // Slow amplitude drift for breathing effect
      const ampLfo = new Tone.LFO({
        frequency: 0.06 + Math.random() * 0.04,
        min: -28,
        max: -18,
      }).connect(osc.volume as any);
      ampLfo.start();
      lfos.push(ampLfo);
    }

    return () => {
      for (const osc of oscillators) {
        osc.stop();
        osc.dispose();
      }
      for (const lfo of lfos) {
        lfo.stop();
        lfo.dispose();
      }
    };
  }

  // ── AURORA: rhythmic — percussive pattern with evolving texture ──────────
  private buildRhythmic(output: Tone.Volume): () => void {
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      volume: -18,
    }).connect(output);

    const hat = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0 },
      volume: -24,
    }).connect(output);

    // Kick pattern: 1 . 3 . | 1 . 3 4
    const kickLoop = new Tone.Loop((time) => {
      kick.triggerAttackRelease("C2", "8n", time);
    }, "2n").start(0);

    // Hat pattern: 1 & 2 & 3 & 4 &
    const hatLoop = new Tone.Loop((time) => {
      hat.triggerAttackRelease("8n", time);
    }, "8n").start("4n");

    // Reverb send for depth
    const verb = new Tone.Reverb({ decay: 2, wet: 0.3 });
    verb.connect(output);
    kick.connect(verb);
    hat.connect(verb);

    return () => {
      kickLoop.stop();
      kickLoop.dispose();
      hatLoop.stop();
      hatLoop.dispose();
      kick.dispose();
      hat.dispose();
      verb.dispose();
    };
  }

  // ── CIPHER: digital — arpeggiated square pattern ────────────────────────
  private buildDigital(output: Tone.Volume): () => void {
    const synth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.1,
        release: 0.05,
      },
      volume: -22,
    }).connect(output);

    // Minor pentatonic arpeggio
    const notes = ["C4", "Eb4", "F4", "G4", "Bb4", "G4", "F4", "Eb4"];
    let index = 0;

    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease(notes[index % notes.length], "16n", time);
      index++;
    }, "8n");

    // High-pass filter for digital crispness
    const hpFilter = new Tone.Filter({
      type: "highpass",
      frequency: 300,
      rolloff: -12,
    });
    synth.disconnect(output);
    synth.connect(hpFilter);
    hpFilter.connect(output);

    loop.start(0);

    return () => {
      loop.stop();
      loop.dispose();
      synth.dispose();
      hpFilter.dispose();
    };
  }

  // ── TERRA: organic — filtered noise with natural envelope ────────────────
  private buildOrganic(output: Tone.Volume): () => void {
    const noise = new Tone.Noise("brown").start();

    const lowpass = new Tone.Filter({
      type: "lowpass",
      frequency: 250,
      rolloff: -12,
    });

    const noiseVol = new Tone.Volume(-26);
    noise.connect(lowpass);
    lowpass.connect(noiseVol);
    noiseVol.connect(output);

    // Slow organic filter movement (wind/earth feel)
    const lfo1 = new Tone.LFO({
      frequency: 0.04,
      min: 120,
      max: 400,
    }).connect(lowpass.frequency);
    lfo1.start();

    // Secondary modulation for complexity
    const lfo2 = new Tone.LFO({
      frequency: 0.11,
      min: 180,
      max: 320,
    }).connect(lowpass.frequency);
    lfo2.start();

    // Volume swell
    const swellLfo = new Tone.LFO({
      frequency: 0.06,
      min: -35,
      max: -22,
    }).connect(noiseVol.volume as any);
    swellLfo.start();

    return () => {
      noise.stop();
      noise.dispose();
      lowpass.dispose();
      noiseVol.dispose();
      lfo1.stop();
      lfo1.dispose();
      lfo2.stop();
      lfo2.dispose();
      swellLfo.stop();
      swellLfo.dispose();
    };
  }

  // ── EVENT SUBSCRIPTION ──────────────────────────────────────────────────

  private subscribeToEvents(): void {
    // Planet activation triggers audio
    universeBus.subscribe("PLANET_ACTIVATED", (event) => {
      this.playSignature(event.planetId);
    });

    // Planet completion stops its audio
    universeBus.subscribe("PLANET_COMPLETED", (event) => {
      this.stopSignature(event.planetId);
    });

    // Audio state toggle
    universeBus.subscribe("AUDIO_STATE_CHANGED", (event) => {
      if (event.active) {
        this.resume();
      } else {
        this.suspend();
      }
    });
  }
}

/** Singleton — entire app shares one audio manager */
export const audioManager = new AudioManager();
