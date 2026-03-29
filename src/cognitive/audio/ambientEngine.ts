export type Emotion = "alegria" | "tristeza" | "tensao" | "neutro";

type Listener = () => void;

class AmbientEngineMock {
  private isMuted = true;
  private currentEmotion: Emotion = "neutro";
  private listeners = new Set<Listener>();

  private notify() { this.listeners.forEach(fn => fn()); }
  
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  
  async initialize() { 
    console.log("🔇 Audio mock initialized (no-op)"); 
    return true; 
  }
  
  async unmute() { 
    console.log("🔇 Audio mock unmute (no-op)"); 
    this.isMuted = false; 
    this.notify();
    return true; 
  }
  
  mute() { 
    this.isMuted = true; 
    this.notify(); 
  }
  
  setEmotion(emotion: Emotion) { 
    this.currentEmotion = emotion; 
    this.notify(); 
  }
  
  isMutedState() { return this.isMuted; }
  getCurrentEmotion() { return this.currentEmotion; }
  getDebugInfo() { return { mock: true, isMuted: this.isMuted }; }
}

export const ambientEngine = new AmbientEngineMock();
export default ambientEngine;
