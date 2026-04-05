/**
 * ambientEngine.ts - Motor de áudio ambiente do Laboratório MENTE.AI
 * 
 * Usa Tone.js para áudio ambiente com inicialização controlada pelo usuário
 * para evitar erros de autoplay policy dos browsers modernos.
 */

import * as Tone from "tone";

export type Emotion = "alegria" | "tristeza" | "tensao" | "neutro";

type Listener = () => void;

class AmbientEngine {
  private isMuted = true;
  private currentEmotion: Emotion = "neutro";
  private listeners = new Set<Listener>();
  private isInitialized = false;
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private volume: Tone.Volume | null = null;

  private notify() { 
    this.listeners.forEach(fn => fn()); 
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { 
      this.listeners.delete(listener); 
    };
  }

  /**
   * Inicializa o motor de áudio APÓS interação do usuário
   * Isso evita o erro "NotSupportedError: Failed to load because no supported source was found"
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Aguarda o Tone.js estar pronto
      await Tone.start();
      
      // Cria cadeia de áudio: Synth -> Volume -> Reverb -> Master
      this.volume = new Tone.Volume(-10).toDestination();
      this.reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).connect(this.volume);
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "fmsine" },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 1 }
      }).connect(this.reverb);

      this.isInitialized = true;
      console.log("🎵 Audio ambiente inicializado com sucesso");
      return true;
    } catch (error) {
      console.error("❌ Erro ao inicializar áudio ambiente:", error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Toca uma nota ou acorde baseado na emoção atual
   * Deve ser chamado APÓS initialize()
   */
  async playEmotion(emotion: Emotion) {
    if (!this.isInitialized || this.isMuted || !this.synth) {
      console.warn("Áudio não inicializado ou mutado");
      return;
    }

    const emotionNotes: Record<Emotion, string[]> = {
      neutro: ["C4", "E4", "G4"],
      alegria: ["C4", "E4", "G4", "B4"],
      tristeza: ["A3", "C4", "E4"],
      tensao: ["C4", "D#4", "G4"]
    };

    const notes = emotionNotes[emotion] || emotionNotes.neutro;
    this.synth.triggerAttackRelease(notes, "2n");
    
    this.currentEmotion = emotion;
    this.notify();
  }

  async unmute() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    this.isMuted = false;
    if (this.volume) {
      this.volume.volume.value = -10;
    }
    this.notify();
    console.log("🔊 Áudio desmutado");
    return true;
  }

  mute() {
    this.isMuted = true;
    if (this.volume) {
      this.volume.volume.value = -Infinity;
    }
    this.notify();
    console.log("🔇 Áudio mutado");
  }

  setEmotion(emotion: Emotion) {
    this.currentEmotion = emotion;
    if (!this.isMuted && this.isInitialized) {
      this.playEmotion(emotion);
    }
  }

  isMutedState() { 
    return this.isMuted; 
  }

  getCurrentEmotion() { 
    return this.currentEmotion; 
  }

  isInitializedState() {
    return this.isInitialized;
  }

  getDebugInfo() { 
    return { 
      isInitialized: this.isInitialized,
      isMuted: this.isMuted,
      currentEmotion: this.currentEmotion,
      hasTone: typeof Tone !== 'undefined'
    }; 
  }

  /**
   * Limpa todos os recursos de áudio
   */
  async dispose() {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    if (this.reverb) {
      this.reverb.dispose();
      this.reverb = null;
    }
    if (this.volume) {
      this.volume.dispose();
      this.volume = null;
    }
    this.isInitialized = false;
    console.log("🔇 Áudio dispose");
  }
}

export const ambientEngine = new AmbientEngine();
export default ambientEngine;
