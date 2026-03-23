"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import ambientEngine from "@/cognitive/audio/ambientEngine";

export default function AudioController() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(ambientEngine.isMutedState());
    return ambientEngine.subscribe(() => {
      setIsMuted(ambientEngine.isMutedState());
    });
  }, []);

  const handleToggle = async () => {
    if (isMuted) {
      await ambientEngine.unmute();
      return;
    }
    ambientEngine.mute();
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-[150] rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3 shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] active:scale-95"
      title={isMuted ? "Ativar som ambiente" : "Desativar som ambiente"}
      aria-label={isMuted ? "Ativar áudio" : "Desativar áudio"}
      type="button"
    >
      {isMuted ? (
        <VolumeX className="h-6 w-6 text-white" />
      ) : (
        <Volume2 className="h-6 w-6 text-white" />
      )}
    </button>
  );
}
