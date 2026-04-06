'use client';

/**
 * /universo/nexus — Universo NEXUS — Piloto do Metaverso MENTE.AI
 *
 * Fluxo completo:
 *  1. Intro cinematográfica (NexusCinematicIntro)
 *  2. Ambiente 3D com partículas + core (NexusScene via Three.js/R3F)
 *  3. Chat vivo com NEXUS via /api/nexus/chat (Agent Bible v1.0)
 *  4. TTS ElevenLabs com voz exclusiva do NEXUS
 *  5. Áudio ambiente cosmos (nexusAmbient — Web Audio API isolada)
 */

import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Minimize2 } from 'lucide-react';
import dynamic from 'next/dynamic';

import { NexusScene } from '@/components/universo/NexusScene';
import NexusCinematicIntro from '@/components/universo/NexusCinematicIntro';
import { nexusAmbient } from '@/cognitive/audio/nexusAmbient';

// Importação dinâmica para evitar SSR do canvas
const NexusDialogLive = dynamic(
  () => import('@/components/universo/NexusDialogLive'),
  { ssr: false, loading: () => null },
);

// ─── Constantes ──────────────────────────────────────────────────────────────
const NEXUS_VOICE_ID =
  process.env.NEXT_PUBLIC_NEXUS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function NexusUniversePage() {
  // Estado da jornada
  const [introConcluida, setIntroConcluida] = useState(false);
  const [primeiraEscolha, setPrimeiraEscolha] = useState<string | null>(null);

  // Áudio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Áudio ambiente — inicia após intro (exige interação do usuário)
  useEffect(() => {
    if (!introConcluida || !audioEnabled) return;

    nexusAmbient.start().then(() => setAmbientPlaying(true));
    const unsub = nexusAmbient.subscribe((s) => setAmbientPlaying(s === 'playing'));
    return () => {
      unsub();
      nexusAmbient.stop();
    };
  }, [introConcluida, audioEnabled]);

  // Atualiza volume do ambiente quando audioEnabled muda
  useEffect(() => {
    if (audioEnabled) nexusAmbient.unmute();
    else nexusAmbient.mute();
  }, [audioEnabled]);

  // ── Conclusão da intro ─────────────────────────────────────────────────────
  const handleIntroComplete = useCallback((escolha: string) => {
    setPrimeiraEscolha(escolha);
    setIntroConcluida(true);
  }, []);

  // ── TTS ElevenLabs ─────────────────────────────────────────────────────────
  const handleSpeak = useCallback(
    async (text: string) => {
      if (isSpeaking || !audioEnabled) return;
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

      setIsSpeaking(true);
      // Abaixa áudio ambiente durante TTS
      nexusAmbient.setVolume(0.05);

      try {
        const res = await fetch('/api/elevenlabs/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice_id: NEXUS_VOICE_ID,
            model_id: 'eleven_monolingual_v1',
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          await audio.play();
          audio.onended = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            setIsSpeaking(false);
            // Restaura áudio ambiente
            if (audioEnabled) nexusAmbient.setVolume(0.18);
          };
        } else {
          setIsSpeaking(false);
          if (audioEnabled) nexusAmbient.setVolume(0.18);
        }
      } catch {
        setIsSpeaking(false);
        if (audioEnabled) nexusAmbient.setVolume(0.18);
      }
    },
    [isSpeaking, audioEnabled],
  );

  const toggleAudio = useCallback(() => {
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
    setAudioEnabled((prev) => !prev);
  }, [isSpeaking]);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">

      {/* ── Intro Cinematográfica ─────────────────────────────────────────── */}
      {!introConcluida && (
        <NexusCinematicIntro
          onComplete={handleIntroComplete}
          onSkip={() => handleIntroComplete('Ainda não sei — por isso estou aqui')}
          voiceId={NEXUS_VOICE_ID}
          audioEnabled={audioEnabled}
        />
      )}

      {/* ── Cena 3D (sempre carregando em background) ─────────────────────── */}
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

      {/* ── Gradiente cinematográfico ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-5 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* ── HUD superior ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {introConcluida && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-6"
          >
            {/* Identidade */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, #60A5FA, #1E3A8A)',
                  boxShadow: '0 0 16px rgba(59,130,246,0.5)',
                }}
              >
                <span className="text-white font-black text-xs">NX</span>
              </div>
              <div>
                <p className="font-mono font-black text-blue-300 text-sm tracking-widest">NEXUS</p>
                <p className="text-blue-500/60 text-xs font-mono">O Arquiteto do Conhecimento</p>
              </div>
              {ambientPlaying && (
                <div className="flex gap-0.5 ml-1 items-end h-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-blue-400/40 rounded-full"
                      animate={{ height: ['4px', `${6 + i * 3}px`, '4px'] }}
                      transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">
              {/* Toggle áudio */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleAudio}
                className="p-2 rounded-lg transition-colors backdrop-blur-sm"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  color: audioEnabled ? '#60A5FA' : '#374151',
                }}
                title={audioEnabled ? 'Silenciar' : 'Ativar áudio'}
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </motion.button>

              {/* Voltar */}
              <motion.a
                href="/home"
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                title="Voltar ao início"
              >
                <Minimize2 size={16} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Vivo com NEXUS ────────────────────────────────────────────── */}
      <AnimatePresence>
        {introConcluida && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <NexusDialogLive
              primeiraEscolha={primeiraEscolha}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              audioEnabled={audioEnabled}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
