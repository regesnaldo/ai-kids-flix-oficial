// Teste rápido de Web Audio API
export function testAudioSupport(): { supported: boolean; details: string } {
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  
  if (!AudioContextClass) {
    return { supported: false, details: "Web Audio API não disponível" };
  }
  
  try {
    const ctx = new AudioContextClass();
    return { 
      supported: true, 
      details: `Sample rate: ${ctx.sampleRate}Hz, State: ${ctx.state}` 
    };
  } catch (e: any) {
    return { supported: false, details: `Erro: ${e.message || e}` };
  }
}
