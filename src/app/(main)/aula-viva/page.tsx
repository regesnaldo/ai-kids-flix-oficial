"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlipBookLesson from "@/components/features/aula-viva/FlipBookLesson";
import { getLessonFromPrompt, FlipBookLesson as FlipBookLessonType } from "@/components/features/aula-viva/mockData";
import { 
  Sparkles, 
  Loader2, 
  Send, 
  Mic, 
  Zap,
  BookOpen,
  RefreshCw,
  Brain
} from "lucide-react";

// Suggested prompts for the user
const suggestedPrompts = [
  "Explique redes neurais como se eu tivesse 7 anos",
  "O que é machine learning de forma simples?",
  "Como a IA generativa funciona na prática?",
  "O que são agentes de IA e como eles decidem?",
  "Quero entender os fundamentos de IA"
];

// Loading animation component
function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-12 md:py-16"
    >
      {/* Central orb */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 mb-7 md:mb-8">
        {/* Outer rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-neon-cyan/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
        
        {/* Central glow */}
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple"
          style={{
            boxShadow: '0 0 40px rgba(0,240,255,0.5), 0 0 80px rgba(168,85,247,0.3)'
          }}
        />
        
        {/* Icon in center */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </motion.div>
      </div>
      
      {/* Loading text */}
      <div className="text-center">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg md:text-xl font-medium text-white/85 tracking-wide"
        >
          Criando sua aula personalizada
        </motion.p>
        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          className="text-sm md:text-base text-white/60 mt-2"
        >
          Estruturando explicações, exemplos e narrativa de voz...
        </motion.p>
      </div>
      
      {/* Floating particles */}
      <div className="flex gap-2 mt-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-neon-cyan"
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Prompt input component
function PromptInput({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (prompt: string) => void; 
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      (window as any).recognitionInstance = recognition;
    }
  }, []);
  
  const toggleListening = () => {
    const recognition = (window as any).recognitionInstance;
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main input container */}
          <div className="relative bg-gradient-to-br from-cyber-panel to-cyber-dark/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" />
            
            <div className="p-4 md:p-6">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte qualquer coisa sobre IA... Ex.: 'Explique redes neurais como se eu tivesse 7 anos'"
                className="w-full bg-transparent text-white placeholder-white/40 resize-none outline-none text-base md:text-xl min-h-[72px] md:min-h-[84px] max-h-[220px] leading-relaxed"
                rows={2}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              
              {/* Actions row */}
              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-all ${
                      isListening 
                        ? 'bg-neon-pink text-white animate-pulse shadow-lg shadow-neon-pink/30' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                    disabled={isLoading}
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!input.trim() || isLoading}
                  className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple font-semibold text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neon-cyan/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Criando aula...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Gerar Aula</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// Suggested prompts section
function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      className="w-full max-w-3xl mx-auto mt-7 md:mt-8"
    >
      <p className="text-white/55 text-sm mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Sugestões para começar:
      </p>
      
      <div className="flex flex-wrap gap-3">
        {suggestedPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(prompt)}
            className="w-full sm:w-auto justify-center sm:justify-start px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/75 text-sm hover:bg-white/10 hover:text-white hover:border-neon-cyan/30 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}</span>
            <span className="sm:hidden">{prompt.split(' ').slice(0, 3).join(' ')}...</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Premium header component
function PremiumHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-10 md:mb-12 px-1"
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 mb-5 md:mb-6"
      >
        <Zap className="w-4 h-4 text-neon-cyan" />
        <span className="text-sm font-medium text-neon-cyan">Experiência Premium</span>
      </motion.div>
      
      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight"
      >
        <span className="bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent">
          AULA VIVA IA
        </span>
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-base sm:text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed"
      >
        Faça uma pergunta sobre IA e receba uma aula viva com explicações visuais,
        narrativa por voz e progressão guiada, em linguagem simples e envolvente.
      </motion.p>
      
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
      />
    </motion.div>
  );
}

// Main page component
export default function AulaVivaPage() {
  const [lesson, setLesson] = useState<FlipBookLessonType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  
  const generateLesson = (prompt: string) => {
    setIsLoading(true);
    setShowLesson(false);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      const newLesson = getLessonFromPrompt(prompt);
      setLesson(newLesson);
      setIsLoading(false);
      setShowLesson(true);
    }, 2500);
  };
  
  const resetLesson = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setLesson(null);
    setShowLesson(false);
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, #0a0e27 0%, #050816 50%, #0a0a1a 100%)'
          }}
        />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-neon-purple/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-br from-neon-pink/5 to-transparent rounded-full blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-6 md:py-12 lg:py-16">
        {/* Header */}
        <PremiumHeader />
        
        {/* Lesson view or prompt input */}
        <AnimatePresence mode="wait">
          {showLesson && lesson ? (
            <motion.div
              key="lesson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Back button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetLesson}
                className="mb-6 md:mb-8 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/75 hover:text-white hover:border-neon-cyan/30 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Nova Aula</span>
              </motion.button>
              
              {/* The lesson component */}
              <FlipBookLesson lesson={lesson} />
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingAnimation />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <PromptInput onSubmit={generateLesson} isLoading={isLoading} />
              <SuggestedPrompts onSelect={generateLesson} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom decorative element */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </div>
  );
}
