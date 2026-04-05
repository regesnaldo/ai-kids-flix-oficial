'use client';

import { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { NexusScene } from '@/components/universo/NexusScene';
import { NexusDialog, DialogueState } from '@/components/universo/NexusDialog';
import { Loader } from '@react-three/drei';

export default function NexusUniversePage() {
  const [dialogueState, setDialogueState] = useState<DialogueState>('initial');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleOptionSelect = useCallback((option: string) => {
    setSelectedOption(option);
    setDialogueState('responding');
  }, []);

  const handleResponseComplete = useCallback(() => {
    setDialogueState('awaiting');
  }, []);

  const handleSpeak = useCallback(async (text: string) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      const response = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice_id: process.env.NEXT_PUBLIC_NEXUS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB',
          model_id: 'eleven_monolingual_v1'
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        await audio.play();
        audio.onended = () => setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <NexusScene />
          </Suspense>
        </Canvas>
        <Loader 
          containerStyles={{ background: '#000' }}
          innerStyles={{ background: '#3B82F6' }}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <NexusDialog
          dialogueState={dialogueState}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          onResponseComplete={handleResponseComplete}
          onSpeak={handleSpeak}
          isSpeaking={isSpeaking}
        />
      </div>

      <div className="absolute inset-0 z-5 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </main>
  );
}
