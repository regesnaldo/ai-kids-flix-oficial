import * as Tone from "tone";

export type Emotion = "alegria" | "tristeza" | "tensao" | "neutro";

interface EmotionConfig {
  bpm: number;
  frequency: [number, number];
  volume: number;
  waveform: "sine" | "triangle" | "sawtooth" | "square";
  attack: number;
  decay: number;
  release: number;
}

const emotionConfigs: Record<Emotion, EmotionConfig> = {
  alegria: {
    bpm: 120,
    frequency: [800, 1200],
    volume: -10,
    waveform: "sine",
    attack: 0.1,
    decay: 0.2,
    release: 1,
  },
  tristeza: {
    bpm: 60,
    frequency: [200, 400],
    volume: -20,
    waveform: "triangle",
    attack: 0.3,
    decay: 0.3,
    release: 1.5,
  },
  tensao: {
    bpm: 90,
    frequency: [400, 800],
    volume: -8,
    waveform: "sawtooth",
    attack: 0.1,
    decay: 0.2,
    release: 0.8,
  },
  neutro: {
    bpm: 80,
    frequency: [300, 600],
    volume: -25,
    waveform: "sine",
    attack: 0.2,
    decay: 0.3,
    release: 1,
  },
};

type Listener = () => void;

class AmbientEngine {
  private synth: Tone.PolySynth | null = null;
  private loop: Tone.Loop | null = null;
  private isMuted = true;
  private currentEmotion: Emotion = "neutro";
  private isInitialized = false;
  private listeners = new Set<Listener>();

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async initialize() {
    if (this.isInitialized) return;

    await Tone.start();

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.5,
        release: 1,
      },
    }).toDestination();

    this.synth.volume.value = -25;
    this.isInitialized = true;
  }

  async unmute() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    this.isMuted = false;
    this.startAmbientLoop();
    this.notify();
  }

  mute() {
    this.isMuted = true;
    this.stopAmbientLoop();
    this.notify();
  }

  setEmotion(emotion: Emotion) {
    this.currentEmotion = emotion;
    if (!this.isMuted) {
      this.updateSynthForEmotion(emotion);
    }
    this.notify();
  }

  private updateSynthForEmotion(emotion: Emotion) {
    if (!this.synth) return;

    const config = emotionConfigs[emotion];
    this.synth.set({
      oscillator: { type: config.waveform },
      envelope: {
        attack: config.attack,
        decay: config.decay,
        sustain: 0.5,
        release: config.release,
      },
    });
    this.synth.volume.value = config.volume;
    Tone.Transport.bpm.rampTo(config.bpm, 0.25);
  }

  private startAmbientLoop() {
    if (!this.synth || this.loop) return;

    this.updateSynthForEmotion(this.currentEmotion);
    this.loop = new Tone.Loop((time) => {
      const config = emotionConfigs[this.currentEmotion];
      const [min, max] = config.frequency;
      const freq = min + Math.random() * (max - min);
      this.synth?.triggerAttackRelease(freq, "8n", time);
    }, "2n").start(0);

    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
    }
  }

  private stopAmbientLoop() {
    if (this.loop) {
      this.loop.stop();
      this.loop.dispose();
      this.loop = null;
    }
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
    }
  }

  isMutedState() {
    return this.isMuted;
  }

  getCurrentEmotion() {
    return this.currentEmotion;
  }
}

export const ambientEngine = new AmbientEngine();
export default ambientEngine;
