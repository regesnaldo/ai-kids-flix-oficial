"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { type FlipBookLesson, ExplanationBlock } from "./mockData";
import { AnimatedVisualizer, getVisualizerForConcept, VisualizerBlock } from "./AnimatedVisualizer";
import {
  Brain,
  Network,
  Sparkles,
  Bot,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
  Loader2,
  Sparkle,
  Wand2,
  Eye,
  EyeOff
} from "lucide-react";

// Icon mapping
const iconMap = {
  brain: Brain,
  network: Network,
  sparkle: Sparkles,
  robot: Bot,
  lightbulb: Lightbulb,
};

// Animated background particles
function BackgroundParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          initial={{
            x: `${5 + (i * 4) % 90}%`,
            y: `${Math.random() * 100}%`,
            scale: 0
          }}
          animate={{
            y: [`${Math.random() * 100}%`, "-10vh"],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            x: [`${(i * 4) % 90}%`, `${((i * 4) + 20) % 90}%`]
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear"
          }}
          style={{
            background: i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#a855f7" : "#ec4899"
          }}
        />
      ))}
    </div>
  );
}

// Animated Title Component with enhanced effects
function AnimatedTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-12 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative inline-block"
      >
        {/* Multiple glow layers */}
        <motion.div
          className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.h1
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="relative text-6xl md:text-8xl font-black tracking-tight"
        >
          {/* Gradient text with animation */}
          <motion.span
            className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {title}
          </motion.span>
          
          {/* Sparkle effects around title */}
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-cyan-400"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 180]
              }}
              transition={{
                duration: 2,
                delay: i * 0.25 + 0.5,
                repeat: Infinity,
                repeatDelay: 4
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${i % 2 === 0 ? '-10%' : '110%'}`
              }}
            >
              ✨
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-6 text-2xl md:text-3xl text-white/60 font-light"
      >
        {subtitle}
      </motion.p>
      
      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-8 h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"
      />
    </div>
  );
}

// Enhanced Block Card with Visualizer
function BlockCard({ 
  block, 
  index, 
  isActive,
  visualizerRequest
}: { 
  block: ExplanationBlock; 
  index: number;
  isActive: boolean;
  visualizerRequest?: FlipBookLesson["visualizerRequest"];
}) {
  const Icon = iconMap[block.iconType] || Lightbulb;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(Boolean(visualizerRequest?.enabled && index === 0));
  
  // Determine visualizer type based on block content
  const visualizerType = getVisualizerForConcept(block.title + ' ' + block.content);
  
  // Dynamic image position based on content
  const imagePosition = useCallback(() => {
    const text = (block.title + ' ' + block.content).toLowerCase();
    if (text.includes('celular') || text.includes('phone')) return '50% 15%';
    if (text.includes('cachorro') || text.includes('dog')) return '50% 25%';
    if (text.includes('cerebro') || text.includes('neuronio')) return '50% 30%';
    if (text.includes('equipe') || text.includes('team')) return '50% 20%';
    if (text.includes('chef') || text.includes('comida')) return '50% 35%';
    return '50% 28%';
  }, [block.content, block.title]);
  
  const visualizerBlock: VisualizerBlock = {
    id: `${block.id}-viz`,
    title: block.title,
    concept: visualizerRequest?.concept || block.title,
    type: visualizerType,
    universe: visualizerRequest?.universe
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, x: 120, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -120, scale: 0.9 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="relative group">
            {/* Outer glow effect */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              
              {/* Visualizer section (when enabled) */}
              {showVisualizer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <AnimatedVisualizer block={visualizerBlock} isActive={isActive} activeUniverse={visualizerRequest?.universe} />
                </motion.div>
              )}
              
              {/* Image section */}
              {block.imageUrl && (
                <motion.div 
                  className="relative h-52 md:h-72 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Gradient placeholder while loading */}
                  {!imageLoaded && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-purple-900/60 to-pink-900/60"
                      animate={{ 
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    />
                  )}
                  
                  <motion.img
                    src={block.imageUrl}
                    alt={block.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    style={{ objectPosition: imagePosition() }}
                    onLoad={() => setImageLoaded(true)}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: imageLoaded ? 1 : 1.1 }}
                  />
                  
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />
                  
                  {/* Block number badge with animation */}
                  <motion.div 
                    className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-lg"
                    animate={{ 
                      boxShadow: [
                        '0 4px 20px rgba(0,240,255,0.4)',
                        '0 4px 30px rgba(168,85,247,0.6)',
                        '0 4px 20px rgba(0,240,255,0.4)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Visualizer toggle */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowVisualizer(!showVisualizer)}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center gap-2 text-white/80 text-sm hover:bg-white/10 transition-colors"
                  >
                    {showVisualizer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showVisualizer ? 'Ocultar' : 'Ver'} Animação</span>
                  </motion.button>

                  {/* AI badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center gap-1.5 text-xs text-white/70">
                    <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Visual AI</span>
                  </div>
                </motion.div>
              )}
              
              {/* Content section */}
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-5">
                  {/* Animated icon container */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 8, -8, 0],
                      boxShadow: [
                        '0 0 20px rgba(0,240,255,0.3)',
                        '0 0 40px rgba(168,85,247,0.5)',
                        '0 0 20px rgba(0,240,255,0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex-shrink-0 w-18 h-18 md:w-22 md:h-22 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-purple-500/25 flex items-center justify-center border border-cyan-400/40"
                  >
                    <span className="text-4xl md:text-5xl">{block.emoji}</span>
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3"
                    >
                      <Icon className="w-7 h-7 text-cyan-400 flex-shrink-0" />
                      <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text">{block.title}</span>
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg md:text-xl text-white/75 leading-relaxed"
                    >
                      {block.content}
                    </motion.p>
                  </div>
                </div>
                
                {/* Animated bottom border with gradient */}
                <motion.div
                  className="mt-8 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced Summary Card
function SummaryCard({ summary, title }: { summary: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative p-8 bg-gradient-to-br from-purple-900/40 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Sparkle className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
              Resumo Rápido
            </span>
          </div>
          
          <p className="text-2xl text-white/95 leading-relaxed font-light mb-6">
            "{summary}"
          </p>
          
          {/* Animated separator */}
          <div className="relative h-px bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-cyan-500 to-transparent"
              animate={{ 
                x: ['0%', '100%'],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Progress Dots with enhanced animation
function ProgressDots({ current, total, onSelect }: { 
  current: number; 
  total: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 justify-center mt-10">
      {/* Label */}
      <span className="text-white/40 text-sm mr-2">
        {current === -1 ? 'Intro' : `${current + 1}/${total}`}
      </span>
      
      {[...Array(total)].map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onSelect?.(i)}
          className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
            i === current 
              ? 'bg-cyan-400 scale-125' 
              : i < current 
                ? 'bg-purple-500' 
                : 'bg-white/20 hover:bg-white/40'
          }`}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          {i === current && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute inset-0 rounded-full shadow-lg shadow-cyan-400/50" />
            </>
          )}
        </motion.button>
      ))}
    </div>
  );
}

// FIXED: Enhanced Voice Narration with complete sentence reading
function useVoiceNarration() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices().filter(v => 
        v.lang.startsWith('pt') || v.lang.startsWith('en')
      );
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      if (speakTimerRef.current) clearTimeout(speakTimerRef.current);
      speechSynthesis.cancel();
    };
  }, []);
  
  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakTimerRef.current) {
      clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
    utteranceRef.current = null;
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText('');
  }, []);

  // FIXED: Proper TTS with complete sentences, no cuts
  const speak = useCallback((text: string, lang: string = "pt-BR", delayMs = 400) => {
    if (!isSupported || typeof window === "undefined" || !("speechSynthesis" in window) || !text?.trim()) {
      return;
    }

    stop();
    
    // Clean and prepare text - ensure complete sentences
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*/g, '$1 ')
      .trim();
    
    // Ensure text ends with punctuation for proper pausing
    const finalText = cleanText.match(/[.!?]$/) ? cleanText : cleanText + '.';
    
    speakTimerRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(finalText);
      
      // Find best matching voice
      const langRoot = lang.split("-")[0];
      let selectedVoice = 
        voicesRef.current.find(v => v.lang === lang) ||
        voicesRef.current.find(v => v.lang.startsWith(langRoot)) ||
        voicesRef.current.find(v => v.lang.includes('pt')) ||
        voicesRef.current[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Natural speech settings
      utterance.rate = 0.88; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.lang = lang;
      
      // Proper sentence boundaries for natural pauses
      utterance.onboundary = (event) => {
        if (event.name === 'sentence' || event.name === 'word') {
          // Natural pause handling - do not interrupt
        }
      };
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentText(finalText);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText('');
      };
      
      utterance.onerror = (event) => {
        // Fallback with default voice if primary fails
        if (selectedVoice) {
          const fallback = new SpeechSynthesisUtterance(finalText);
          fallback.lang = lang;
          fallback.rate = 0.9;
          fallback.pitch = 1.0;
          fallback.onstart = () => setIsSpeaking(true);
          fallback.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
          };
          fallback.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setIsSupported(false);
          };
          utteranceRef.current = fallback;
          speechSynthesis.cancel();
          speechSynthesis.speak(fallback);
          return;
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }, Math.max(200, delayMs));
  }, [isSupported, stop]);

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    speechSynthesis.pause();
    setIsPaused(true);
  }, []);
  
  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    speechSynthesis.resume();
    setIsPaused(false);
  }, []);
  
  return { 
    speak, 
    pause, 
    resume, 
    stop, 
    isSpeaking, 
    isPaused, 
    isSupported,
    currentText 
  };
}

// Main FlipBookLesson Component with all enhancements
export default function FlipBookLesson({ lesson }: { lesson: FlipBookLesson }) {
  const [currentBlock, setCurrentBlock] = useState(-1);
  const [showTitle, setShowTitle] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [narrationInAutoplay, setNarrationInAutoplay] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(lesson);
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported, currentText } = useVoiceNarration();
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Show title animation then start lesson
  useEffect(() => {
    if (showTitle) {
      const timer = setTimeout(() => setShowTitle(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);
  
  // Auto-play with narration timing
  useEffect(() => {
    if (isAutoPlaying && !showTitle && currentBlock >= 0) {
      autoPlayRef.current = setTimeout(() => {
        if (currentBlock < currentLesson.blocks.length - 1) {
          setCurrentBlock(prev => prev + 1);
        } else {
          setIsAutoPlaying(false);
        }
      }, 10000); // 10 seconds for full narration
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isAutoPlaying, currentBlock, currentLesson.blocks.length, showTitle]);
  
  // Narrate with complete sentences
  useEffect(() => {
    if (showTitle || !isSupported) return;
    if (isAutoPlaying && !narrationInAutoplay) return;
    
    const narrationDelay = 600; // Allow block to animate first
    
    const timer = setTimeout(() => {
      if (currentBlock === -1) {
        speak(currentLesson.summary, "pt-BR", 300);
      } else if (currentBlock >= 0) {
        const block = currentLesson.blocks[currentBlock];
        const voiceText = block.voiceText || `${block.title}. ${block.content}`;
        speak(voiceText, "pt-BR", 300);
      }
    }, narrationDelay);
    
    return () => clearTimeout(timer);
  }, [currentBlock, isAutoPlaying, isSupported, currentLesson, narrationInAutoplay, showTitle, speak]);
  
  // Start lesson after title
  useEffect(() => {
    if (!showTitle && currentBlock === -1) {
      const timer = setTimeout(() => setCurrentBlock(0), 600);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);
  
  // Handle lesson changes
  useEffect(() => {
    if (lesson) {
      setCurrentLesson(lesson);
      setCurrentBlock(-1);
      setShowTitle(true);
      stop();
    }
  }, [lesson, stop]);
  
  const goNext = () => {
    if (currentBlock < currentLesson.blocks.length - 1) {
      setCurrentBlock(prev => prev + 1);
    }
  };
  
  const goPrev = () => {
    if (currentBlock > 0) {
      setCurrentBlock(prev => prev - 1);
    }
  };
  
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };
  
  const toggleNarration = () => {
    if (!isSupported) return;

    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      if (currentBlock === -1) {
        speak(currentLesson.summary, "pt-BR", 300);
      } else {
        const block = currentLesson.blocks[currentBlock];
        speak(block.voiceText || `${block.title}. ${block.content}`, "pt-BR", 300);
      }
    }
  };
  
  const handleBlockSelect = (index: number) => {
    setCurrentBlock(index);
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
      <BackgroundParticles />
      
      {/* Title Animation */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedTitle title={currentLesson.title} subtitle={currentLesson.subtitle} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lesson Content */}
      {!showTitle && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full flex flex-col items-center"
        >
          {/* Summary (first block) */}
          {currentBlock === -1 && (
            <SummaryCard summary={currentLesson.summary} title={currentLesson.title} />
          )}
          
          {/* Block Cards */}
          <div className="w-full mt-10 space-y-6">
            {currentLesson.blocks.map((block, index) => (
              <BlockCard
                key={block.id}
                block={block}
                index={index}
                isActive={currentBlock === index}
                visualizerRequest={currentLesson.visualizerRequest}
              />
            ))}
          </div>
          
          {/* Progress Dots */}
          <ProgressDots 
            current={currentBlock === -1 ? 0 : currentBlock} 
            total={currentLesson.blocks.length}
            onSelect={handleBlockSelect}
          />
          
          {/* Enhanced Controls */}
          <div className="flex items-center gap-4 mt-10 flex-wrap justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goPrev}
              disabled={currentBlock <= 0}
              className="w-14 h-14 rounded-2xl bg-gray-800/80 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoPlay}
              className={`px-8 py-3.5 rounded-2xl font-semibold transition-all flex items-center gap-3 ${
                isAutoPlaying
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/40'
                  : 'bg-gray-800/80 border border-white/15 text-white/80 hover:text-white hover:border-purple-500/50'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isAutoPlaying ? 'Pausar Auto' : 'Auto Play'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goNext}
              disabled={currentBlock >= currentLesson.blocks.length - 1}
              className="w-14 h-14 rounded-2xl bg-gray-800/80 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-7 h-7" />
            </motion.button>
            
            {/* Voice Control */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleNarration}
              disabled={!isSupported}
              className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center ${
                isSpeaking
                  ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-gray-900 shadow-lg shadow-cyan-500/40'
                  : 'bg-gray-800/80 border border-white/15 text-white/70 hover:text-white hover:border-cyan-500/50'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isSpeaking ? (
                isPaused ? (
                  <Play className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6 animate-pulse" />
                )
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </motion.button>

            {/* Autoplay narration toggle */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setNarrationInAutoplay(!narrationInAutoplay)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${
                narrationInAutoplay
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50"
                  : "bg-gray-800/80 text-white/65 border-white/15"
              }`}
            >
              {narrationInAutoplay ? "🔊 Narração Ativa" : "🔇 Narração Silenciosa"}
            </motion.button>
          </div>
          
          {/* Block Counter with narration status */}
          <div className="mt-6 flex items-center gap-4">
            <p className="text-white/45 text-base">
              {currentBlock === -1 ? '📖 Introdução' : `📚 Bloco ${currentBlock + 1} de ${currentLesson.blocks.length}`}
            </p>
            {isSpeaking && (
              <motion.span 
                className="text-cyan-400 text-sm flex items-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
              >
                <Volume2 className="w-4 h-4" />
                Narrando...
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
