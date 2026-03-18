'use client';
import { useState, useEffect, useMemo } from 'react';
import type { EmotionalState, EmotionInput } from '@/cognitive/core/emotionalEngine';
import type { AttentionState, SensoryInput } from '@/cognitive/core/attentionEngine';
import type { CognitiveState } from '@/cognitive/core/cognitiveOrchestrator';
import { useUserStore } from '@/store/useUserStore';
import Image from 'next/image';

type EmotionType = "neutral" | "joy" | "sadness" | "anger" | "fear" | "love" | "curiosity";

export default function Page() {
  const { getGuideAgent } = useUserStore();
  const guideAgent = useMemo(() => getGuideAgent(), [getGuideAgent]);
  
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, emotion: EmotionType}>>([]);
  const [breath, setBreath] = useState(0);
  const [crystals, setCrystals] = useState<Array<{left: string; top: string; delay: number}>>([]);
  const [tendrils, setTendrils] = useState<Array<{x: string; delay: number; duration: number}>>([]);
  const [particles, setParticles] = useState<Array<{x: string; y: string; size: number; delay: number; duration: number}>>([]);
  const [metrics, setMetrics] = useState<{arousal: number; valence: number; load: number}>({arousal: 30, valence: 50, load: 20});
  const [emotionState, setEmotionState] = useState<EmotionalState | null>(null);
  const [attentionState, setAttentionState] = useState<AttentionState | null>(null);
  const [cognitiveState, setCognitiveState] = useState<CognitiveState | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [cardsVisible, setCardsVisible] = useState([false, false, false, false]); 
  const [metricsVisible, setMetricsVisible] = useState([false, false, false]); 
  const [isMobile, setIsMobile] = useState(false); 
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null); 
  const [audioFeedback, setAudioFeedback] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastVisit, setLastVisit] = useState<string | null>(null); 
  const [zenMode, setZenMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1); // 1 = normal, 0.5 = lento, 2 = rápido
  const [infoDensity, setInfoDensity] = useState<'min' | 'med' | 'max'>('max'); // 'min' = mínimo (só input), 'med' = médio (input + emoção), 'max' = máximo (tudo)

  const detectEmotion = (t: string): EmotionType => {
    const l = t.toLowerCase();
    if (l.includes("feliz")) return "joy";
    if (l.includes("triste")) return "sadness";
    if (l.includes("raiva")) return "anger";
    if (l.includes("medo")) return "fear";
    if (l.includes("amor")) return "love";
    if (l.includes("curioso")) return "curiosity";
    return "neutral";
  };

  const emotion = detectEmotion(text);
  const colors: Record<EmotionType, string> = {
    neutral: "#8b5cf6", joy: "#22c55e", sadness: "#3b82f6",
    anger: "#ef4444", fear: "#a855f7", love: "#ec4899", curiosity: "#14b8a6"
  };
  const glow = colors[emotion];

  const emotionLabels: Record<EmotionType, string> = {
    neutral: "NEUTRO", joy: "ALEGRIA", sadness: "TRISTEZA",
    anger: "RAIVA", fear: "MEDO", love: "AMOR", curiosity: "CURIOSIDADE"
  };

  useEffect(() => {
    const animate = () => { setBreath(Math.sin(Date.now() / 800)); requestAnimationFrame(animate); };
    animate();
  }, []);

  // Feedback visual de digitação
  useEffect(() => {
    if (text.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [text]);

  useEffect(() => {
    setCrystals(Array(8).fill(0).map((_, i) => ({ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, delay: 3 + i * 0.5 })));
  }, []);

  useEffect(() => {
    setTendrils(Array(12).fill(0).map((_, i) => ({ x: `${8 + i * 8}%`, delay: i * 0.3, duration: 2 + Math.random() * 2 })));
  }, []);

  useEffect(() => {
    setParticles(Array(20).fill(0).map((_, i) => ({ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, size: 2 + Math.random() * 4, delay: Math.random() * 5, duration: 5 + Math.random() * 10 })));
  }, []);

  useEffect(() => {
    const baseArousal = emotion === 'neutral' ? 30 : emotion === 'joy' ? 70 : emotion === 'sadness' ? 40 : emotion === 'anger' ? 85 : emotion === 'fear' ? 75 : emotion === 'love' ? 65 : 50;
    const baseValence = emotion === 'neutral' ? 50 : emotion === 'joy' ? 85 : emotion === 'sadness' ? 25 : emotion === 'anger' ? 30 : emotion === 'fear' ? 35 : emotion === 'love' ? 90 : 60;
    const baseLoad = text ? 40 + Math.random() * 30 : 20;
    const interval = setInterval(() => {
      setMetrics({
        arousal: Math.min(100, Math.max(0, baseArousal + (Math.random() - 0.5) * 10)),
        valence: Math.min(100, Math.max(0, baseValence + (Math.random() - 0.5) * 10)),
        load: Math.min(100, Math.max(0, baseLoad + (Math.random() - 0.5) * 15))
      });
    }, 200);
    return () => clearInterval(interval);
  }, [emotion, text]);

  // Após o useEffect de métricas
  useEffect(() => {
    if (!audioContext || !audioEnabled) return;
      
    const baseFreq = {
      neutral: 110, joy: 440, sadness: 220,
      anger: 165, fear: 330, love: 392, curiosity: 262
    }[emotion] || 110;
      
    const audio = (window as any)._labAudio;
    if (audio?.oscillator) {
      audio.oscillator.frequency.setTargetAtTime(baseFreq, audioContext.currentTime, 0.1);
    }
  }, [emotion, audioContext, audioEnabled]);

  useEffect(() => {
    if (!audioContext || !audioEnabled) return;
    
    // Debounce para evitar trigger em digitação parcial
    const timer = setTimeout(() => {
      playEmotionEffect(emotion, emotionState?.intensity || 0);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [emotion, emotionState, audioContext, audioEnabled]);

  useEffect(() => {
    if (!text.trim()) return;
    const processCognition = async () => {
      try {
        const simulatedEmotionState: EmotionalState = { 
          dominantEmotion: emotion as any, 
          intensity: Math.max(0.5, metrics.arousal / 100), // Garantir mínimo 0.5 para ativar efeitos
          targetColor: { r: 128, g: 128, b: 128 }, 
          emotionalMemory: [], 
          lastUpdate: Date.now(), 
          stability: 0.8 
        };
        const simulatedAttentionState: AttentionState = { currentFocus: { type: 'internal', target: 'text', priority: 0.8, stability: 0.9 }, previousFocus: null, attentionMemory: [], globalArousal: metrics.arousal / 100, lastShiftTime: Date.now() };
        const simulatedCognitiveState: CognitiveState = { emotional: simulatedEmotionState, attention: simulatedAttentionState, emotionalArousal: metrics.arousal / 100, attentionalValence: metrics.valence / 100, cognitiveLoad: metrics.load / 100, lastUnifiedUpdate: Date.now() };
        setEmotionState(simulatedEmotionState);
        setAttentionState(simulatedAttentionState);
        setCognitiveState(simulatedCognitiveState);
        checkAchievements(simulatedCognitiveState, simulatedEmotionState);
      } catch (error) { console.error('Erro ao processar cognicao:', error); }
    };
    const debounce = setTimeout(processCognition, 300);
    return () => clearTimeout(debounce);
  }, [text, emotion, metrics]);

  const handleSend = () => { if (!text.trim()) return; setMessages([...messages, { text, emotion }]); setText(""); };
  const handleClear = () => { setMessages([]); };

  // Handlers com feedback tático
  const handleClearWithFeedback = () => {
    setMessages([]);
  };

  const checkAchievements = (state: CognitiveState, emotion: EmotionalState) => {
    const newAchievements: string[] = [];
    const currentEmotion = emotion.dominantEmotion;
    if (currentEmotion === 'joy' && emotion.intensity > 0.8 && !achievements.some(a => a.includes('Alegria Contagiante'))) newAchievements.push('Alegria Contagiante (80%+)');
    if (currentEmotion === 'anger' && emotion.intensity > 0.8 && !achievements.some(a => a.includes('Fúria Controlada'))) newAchievements.push('Fúria Controlada (80%+)');
    if (currentEmotion === 'sadness' && emotion.intensity > 0.8 && !achievements.some(a => a.includes('Melancolia Profunda'))) newAchievements.push('Melancolia Profunda (80%+)');
    if (currentEmotion === 'fear' && emotion.intensity > 0.8 && !achievements.some(a => a.includes('Ansiedade Elevada'))) newAchievements.push('Ansiedade Elevada (80%+)');
    if (currentEmotion === 'curiosity' && emotion.intensity > 0.8 && !achievements.some(a => a.includes('Mente Exploradora'))) newAchievements.push('Mente Exploradora (80%+)');
    if (state.emotionalArousal > 0.8 && !achievements.some(a => a.includes('Intensidade Emocional'))) newAchievements.push('Intensidade Emocional (Ativação 80%+)');
    if (emotion.intensity > 0.8 && achievements.length === 0) newAchievements.push('Primeira Emoção Detectada');
    if (newAchievements.length > 0) setAchievements(prev => [...prev, ...newAchievements]);
  };

  const clearAchievements = () => { setAchievements([]); };

  const playEmotionEffect = (emotion: EmotionType, intensity: number) => {
    // Só toca se áudio ativo E intensidade suficiente
    if (!audioContext || !audioEnabled || intensity < 0.5) return; // Threshold reduzido de 0.7 para 0.5
      
    const now = audioContext.currentTime;
      
    // Gain node para fade suave (evita cliques)
    const effectGain = audioContext.createGain();
    effectGain.gain.setValueAtTime(0, now);
    effectGain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    effectGain.connect(audioContext.destination);
      
    // Configurações COMPLETAS para todas as emoções
    const configs: Record<EmotionType, { freq: number; type: OscillatorType; duration: number; decay: number; enabled: boolean }> = {
      neutral:   { freq: 0, type: 'sine', duration: 0, decay: 0, enabled: false },
      joy:       { freq: 880, type: 'sine', duration: 0.4, decay: 0.3, enabled: true },   // ✅ Sino brilhante
      sadness:   { freq: 110, type: 'triangle', duration: 1.2, decay: 0.8, enabled: true }, // ✅ Pad grave
      anger:     { freq: 82, type: 'sawtooth', duration: 0.6, decay: 0.4, enabled: true },  // ✅ Baixo tenso
      fear:      { freq: 660, type: 'square', duration: 0.3, decay: 0.5, enabled: true },   // ✅ Oscilante
      love:      { freq: 523, type: 'sine', duration: 0.5, decay: 0.4, enabled: true },      // ✅ Harmônico (substituindo surprise que não existe no EmotionType)
      curiosity: { freq: 523, type: 'sine', duration: 0.5, decay: 0.4, enabled: true }      // ✅ Harmônico
    };
      
    const config = configs[emotion];
    if (!config || !config.enabled || config.duration === 0) return;
      
    // Criar e tocar oscilador
    const effectOsc = audioContext.createOscillator();
    effectOsc.type = config.type;
    effectOsc.frequency.setValueAtTime(config.freq, now);
    effectOsc.connect(effectGain);
      
    // Tocar com fade-out suave
    effectOsc.start(now);
    effectGain.gain.linearRampToValueAtTime(0, now + config.duration + config.decay);
    effectOsc.stop(now + config.duration + config.decay + 0.1);
      
    // Cleanup
    setTimeout(() => {
      effectOsc.disconnect();
      effectGain.disconnect();
    }, (config.duration + config.decay + 0.2) * 1000);
      
    // Feedback visual opcional
    setAudioFeedback(1);
    setTimeout(() => setAudioFeedback(0), 250);
  };

  // Inicializar áudio apenas após interação do usuário
  const initAudio = async () => {
    if (audioContext) return;
    try {
      const ctx = new AudioContext();
      setAudioContext(ctx);
      setAudioEnabled(true);
        
      // Criar oscilador base (drone espacial)
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // Volume baixo
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
        
      // Guardar referência para parar depois se necessário
      (window as any)._labAudio = { oscillator, gainNode };
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
  };

  // Auto-scroll definitivo no chat
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        const el = document.getElementById('chat-messages-container');
        if (el) { el.scrollTop = el.scrollHeight; }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Montagem com stagger
  useEffect(() => {
    setMounted(true);
    setTimeout(() => setCardsVisible([true, false, false, false]), 200);
    setTimeout(() => setCardsVisible([true, true, false, false]), 300);
    setTimeout(() => setCardsVisible([true, true, true, false]), 400);
    setTimeout(() => setCardsVisible([true, true, true, true]), 500);
    setTimeout(() => setMetricsVisible([true, false, false]), 600);
    setTimeout(() => setMetricsVisible([true, true, false]), 750);
    setTimeout(() => setMetricsVisible([true, true, true]), 900);
  }, []);

  // Streak Counter Logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('lab_lastVisit');
    const storedStreak = parseInt(localStorage.getItem('lab_streak') || '0', 10);
      
    if (stored && stored !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
        
      if (stored === yesterday.toDateString()) {
        setStreak(storedStreak + 1);
        localStorage.setItem('lab_streak', String(storedStreak + 1));
      } else {
        setStreak(1);
        localStorage.setItem('lab_streak', '1');
      }
    } else if (!stored) {
      setStreak(1);
      localStorage.setItem('lab_streak', '1');
    } else {
      setStreak(storedStreak || 1);
    }
      
    setLastVisit(today);
    localStorage.setItem('lab_lastVisit', today);
  }, []);

  // Persistência de Preferências
  useEffect(() => {
    const storedZen = localStorage.getItem('lab_zenMode') === 'true';
    const storedSpeed = parseFloat(localStorage.getItem('lab_animationSpeed') || '1');
    const storedDensity = localStorage.getItem('lab_infoDensity') as 'min' | 'med' | 'max' || 'max';
    
    if (storedZen) setZenMode(true);
    if (storedSpeed !== 1) setAnimationSpeed(storedSpeed);
    if (storedDensity !== 'max') setInfoDensity(storedDensity);
  }, []);

  useEffect(() => {
    localStorage.setItem('lab_zenMode', String(zenMode));
  }, [zenMode]);

  useEffect(() => {
    localStorage.setItem('lab_animationSpeed', String(animationSpeed));
  }, [animationSpeed]);

  useEffect(() => {
    localStorage.setItem('lab_infoDensity', infoDensity);
  }, [infoDensity]);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tecla Zen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') {
        // Só ativa se não estiver digitando no input
        if (document.activeElement?.tagName !== 'INPUT') {
          setZenMode(prev => !prev);
        }
      }
    };
      
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Partículas reativas à digitação
  useEffect(() => {
    if (text.length > 0) {
      document.querySelectorAll('[data-particle]').forEach((el: any) => {
        el.style.opacity = 0.7 + (text.length % 5) * 0.06;
      });
    }
  }, [text]);

  // Tendrils reativos ao arousal
  useEffect(() => {
    document.querySelectorAll('[data-tendril]').forEach((el: any) => {
      if (metrics.arousal > 70) {
        el.style.opacity = 0.35; el.style.strokeWidth = 2;
      } else {
        el.style.opacity = 0.15; el.style.strokeWidth = 1;
      }
    });
  }, [metrics.arousal]);

  const scale = 1 + breath * 0.01;

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at center, ${glow}${zenMode ? '10' : '25'} 0%, #000 100%)`, transition: `background ${0.4 / animationSpeed}s ease`, padding: "2rem", paddingTop: "1rem", fontFamily: "system-ui, sans-serif", color: "white", position: "relative" }}>
      {!zenMode && crystals.length > 0 && crystals.map((crystal, i) => (<div key={i} style={{ position: "absolute", width: "150px", height: "150px", left: crystal.left, top: crystal.top, background: `radial-gradient(circle, ${glow}40 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(30px)", animation: `pulse ${crystal.delay / animationSpeed}s ease-in-out infinite`, pointerEvents: "none", zIndex: 0 }} />))}
      {!zenMode && tendrils.length > 0 && (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.15, zIndex: 1 }}>
          {tendrils.map((tendril, i) => (
            <line 
              key={i} 
              data-tendril 
              x1={tendril.x} 
              y1="0%" 
              x2={tendril.x} 
              y2="100%" 
              stroke={glow} 
              strokeWidth="1" 
              style={{ 
                filter: `drop-shadow(0 0 8px ${glow})`, 
                animation: `tendril ${tendril.duration / animationSpeed}s ease-in-out ${tendril.delay}s infinite`, 
                transition: "opacity 0.3s ease, stroke-width 0.3s ease"
              }} 
            />
          ))}
        </svg>
      )}
      {!zenMode && particles.length > 0 && particles.map((particle, i) => (
        <div 
          key={i} 
          data-particle 
          style={{ 
            position: "absolute", 
            width: `${particle.size}px`, 
            height: `${particle.size}px`, 
            left: particle.x, 
            top: particle.y, 
            background: glow, 
            borderRadius: "50%", 
            filter: "blur(1px)", 
            animation: `float ${particle.duration / animationSpeed}s ease-in-out ${particle.delay}s infinite`, 
            pointerEvents: "none", 
            opacity: 0.4, 
            zIndex: 2,
            transition: "opacity 0.3s ease"
          }} 
        />
      ))}
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gap: "2rem", position: "relative", zIndex: 10 }}>
        <div id="chat-messages-container" style={{ 
          position: isMobile ? "fixed" : "sticky",
          left: isMobile ? "0" : "auto",
          bottom: isMobile ? "0" : "auto",
          top: isMobile ? "auto" : "100px", 
          width: isMobile ? "100%" : "280px",
          background: isMobile ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.08)", 
          borderRadius: isMobile ? "1.5rem 1.5rem 0 0" : "1.5rem", 
          padding: zenMode ? "0.8rem" : "1.5rem", 
          backdropFilter: "blur(20px)", 
          border: isMobile ? `none` : `1px solid ${glow}40`, 
          borderTop: isMobile ? `2px solid ${glow}60` : `1px solid ${glow}40`,
          height: zenMode ? "120px" : (isMobile ? "200px" : "calc(100vh - 180px)"),
          opacity: zenMode ? 0.6 : 1,
          overflowY: "auto", 
          overflowX: "hidden",
          alignSelf: "start",
          zIndex: 100,
          transition: "all 0.4s ease"
        }}>
          {/* Guia Ativo */}
          {guideAgent && !zenMode && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: `${glow}15`, borderRadius: "1rem", border: `1px solid ${glow}30` }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: "0.5rem", overflow: "hidden", marginBottom: "0.5rem" }}>
                <Image 
                  src={`/agents/${guideAgent.id}.png`} 
                  alt={guideAgent.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <p style={{ fontSize: "0.65rem", color: glow, fontWeight: "bold", textTransform: "uppercase", marginBottom: "0.2rem" }}>Guia Ativo</p>
              <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{guideAgent.name}</p>
            </div>
          )}

          <h3 style={{ color: glow, marginBottom: zenMode ? "0.5rem" : "1rem", fontSize: zenMode ? "0.8rem" : "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {!zenMode && <span>💬 Conexões</span>}
              {streak > 1 && !zenMode && (
                <span style={{ 
                  fontSize: "0.7rem", 
                  background: `linear-gradient(90deg, ${glow}40, ${glow}20)`, 
                  padding: "0.2rem 0.5rem", 
                  borderRadius: "9999px", 
                  color: glow, 
                  fontWeight: "bold", 
                  animation: "pulse 2s ease-in-out infinite" 
                }}>
                  🔥 {streak} dias
                </span>
              )}
              {/* Toggle de Áudio */}
              <button 
                onClick={initAudio} 
                style={{ 
                  background: audioEnabled ? `${glow}30` : "rgba(255,255,255,0.1)", 
                  border: `1px solid ${glow}40`, 
                  borderRadius: "9999px", 
                  padding: zenMode ? "0.2rem 0.4rem" : "0.4rem 0.8rem", 
                  color: audioEnabled ? glow : "rgba(255,255,255,0.7)", 
                  cursor: "pointer", 
                  fontSize: zenMode ? "0.7rem" : "0.9rem", 
                  transition: "all 0.2s ease", 
                  marginLeft: "0.5rem",
                  transform: audioFeedback ? "scale(1.2)" : "scale(1)",
                  boxShadow: audioFeedback ? `0 0 15px ${glow}` : "none"
                }} 
                title={audioEnabled ? "Áudio ativado" : "Clique para ativar áudio ambiente"}
              >
                {audioEnabled ? "🔊" : "🔇"}
              </button>
              {/* Toggle Zen */}
              <button 
                onClick={() => setZenMode(prev => !prev)} 
                style={{ 
                  background: zenMode ? `${glow}30` : "rgba(255,255,255,0.1)", 
                  border: `1px solid ${glow}40`, 
                  borderRadius: "9999px", 
                  padding: zenMode ? "0.2rem 0.4rem" : "0.4rem 0.6rem", 
                  color: zenMode ? glow : "rgba(255,255,255,0.7)", 
                  cursor: "pointer", 
                  fontSize: zenMode ? "0.7rem" : "0.85rem", 
                  marginLeft: "0.3rem", 
                  transition: "all 0.2s ease" 
                }} 
                title={zenMode ? "Sair do Modo Zen (pressione Z)" : "Entrar no Modo Zen (pressione Z)"}
              >
                🧘
              </button>
            </div>
            {!zenMode && (
              <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.1)", padding: "0.25rem 0.75rem", borderRadius: "9999px", color: glow, fontWeight: "bold" }}>
                {messages.length}
              </span>
            )}
          </h3>
          {messages.length === 0 ? (<p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{!zenMode && "Aguardando..."}</p>) : (<>{messages.map((msg, i) => (<div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "1rem", padding: zenMode ? "0.5rem" : "0.9rem", marginBottom: "0.7rem", borderLeft: `3px solid ${colors[msg.emotion]}` }}><p style={{ color: "white", marginBottom: "0.25rem", fontSize: zenMode ? "0.8rem" : "1rem" }}>{msg.text}</p>{!zenMode && <span style={{ color: glow, fontSize: "0.7rem", textTransform: "uppercase" }}>{emotionLabels[msg.emotion]}</span>}</div>))}{!zenMode && <button onClick={handleClearWithFeedback} style={{ width: "100%", padding: "0.75rem", marginTop: "4rem", background: "rgba(255,255,255,0.1)", border: `1px solid ${glow}40`, borderRadius: "0.75rem", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"; e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.transform = "translateX(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = `${glow}40`; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "translateX(0)"; }}>Limpar Conversa</button>}</>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "white", fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "2rem", textAlign: "center", textShadow: `0 0 35px ${glow}`, transition: "all 0.4s ease" }}>Laboratório de Inteligência Viva</h1>
          {!zenMode && (infoDensity === 'med' || infoDensity === 'max') && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
              gap: isMobile ? "0.5rem" : "0.75rem", 
              marginBottom: "1.8rem",
              width: "100%",
              maxWidth: "500px"
            }}>
              {[{ l: "Estado", v: emotionLabels[emotion], title: "Estado Emocional" },{ l: "Processamento", v: text ? "Ativo" : "Inicial", title: "Processamento" },{ l: "Criatividade", v: text ? "Fluindo" : "Latente", title: "Criatividade" },{ l: "Evolução", v: "Iniciando", title: "Evolução" }].map((s, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: "0.8rem 1.2rem", 
                    background: "rgba(255,255,255,0.06)", 
                    borderRadius: "9999px", 
                    border: `1px solid ${glow}30`, 
                    textAlign: "center", 
                    cursor: "help",
                  opacity: cardsVisible[i] ? 1 : 0,
                  transform: cardsVisible[i] ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`
                }} 
                title={s.title}
                >
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>{s.l}</p>
                  <p style={{ color: glow, fontWeight: "bold", fontSize: "0.85rem" }}>
                    {s.v}
                    {s.l === "Estado" && emotionState && (
                      <span style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>
                        {(emotionState.intensity * 100).toFixed(0)}% confiança
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
          {!zenMode && infoDensity === 'max' && achievements.length > 0 && (
            <div style={{ 
              width: "100%", 
              maxWidth: "500px", 
              margin: "1.5rem auto 0", 
              padding: "1.5rem", 
              background: "rgba(255,255,255,0.05)", 
              borderRadius: "1.5rem", 
              border: `1px solid ${glow}25`, 
              backdropFilter: "blur(10px)",
              animation: mounted ? "popBounce 0.4s ease 0.3s both" : "none"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ color: glow, fontSize: "0.9rem", fontWeight: "bold" }}>Conquistas Desbloqueadas</h4>
                <button onClick={clearAchievements} style={{ background: "transparent", border: `1px solid ${glow}40`, color: "rgba(255,255,255,0.7)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.75rem" }}>Limpar</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {achievements.map((achievement, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: "0.75rem 1rem", 
                      background: `linear-gradient(90deg, ${glow}20 0%, transparent 100%)`, 
                      borderRadius: "0.75rem", 
                       borderLeft: `3px solid ${glow}`, 
                       animation: `popBounce 0.4s ease ${i * 0.15}s both, badgeFloat 3s ease-in-out infinite`, 
                      willChange: "transform, opacity"
                    }}
                  >
                    <span style={{ color: "white", fontSize: "0.85rem" }}>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!zenMode && infoDensity === 'max' && (
            <div style={{ width: "100%", maxWidth: "500px", margin: "2rem auto 0", padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "1.5rem", border: `1px solid ${glow}25`, backdropFilter: "blur(10px)" }}>
              <h4 style={{ color: glow, fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center", fontWeight: "bold" }}>Métricas Cognitivas</h4>
              {[{ label: "Ativação Emocional", value: metrics.arousal },{ label: "Tom Emocional", value: metrics.valence },{ label: "Carga Mental", value: metrics.load }].map((m, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? "1rem" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.8rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{m.label}</span>
                    <span style={{ color: glow }}>{Math.round(m.value)}%</span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ 
                      width: metricsVisible[i] ? `${m.value}%` : "0%", 
                      height: "100%", 
                      background: `linear-gradient(90deg, ${glow}60, ${glow})`, 
                      borderRadius: "4px", 
                      transition: "width 0.5s ease" 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ 
            transform: `scale(${zenMode ? 1.1 : scale})`, 
            transition: "transform 0.3s ease", 
            width: "100%", 
            maxWidth: "480px", 
            marginTop: isMobile ? "1rem" : "2rem", 
            marginBottom: isMobile ? "220px" : "0",
            background: "rgba(255,255,255,0.08)", 
            borderRadius: "2rem", 
            padding: isMobile ? "1.5rem" : "2rem", 
            boxShadow: isTyping ? `0 0 60px ${glow}50, 0 0 20px ${glow}30` : `0 0 80px ${glow}30`, 
            border: `2px solid ${glow}${isTyping ? '70' : '50'}`, 
            backdropFilter: "blur(30px)" 
          }}>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSend()} 
              placeholder="Expresse seu estado..." 
              style={{ 
                width: "100%", 
                padding: isMobile ? "1.2rem 1.5rem" : "0.8rem 1.2rem", 
                fontSize: isMobile ? "1.2rem" : "1.1rem", 
                minHeight: isMobile ? "56px" : "auto",
                borderRadius: "1.25rem", 
                border: `2px solid ${glow}`, 
                background: isTyping ? `rgba(${parseInt(glow.slice(1,3), 16)}, ${parseInt(glow.slice(3,5), 16)}, ${parseInt(glow.slice(5,7), 16)}, 0.15)` : "rgba(255,255,255,0.1)",
                color: "white", 
                outline: "none", 
                marginBottom: "1.6rem", 
                textAlign: "left", 
                boxSizing: "border-box", 
                paddingLeft: "1.5rem",
                transition: "all 0.3s ease",
                animation: isTyping ? "inputPulse 1.5s ease-in-out infinite" : "none"
              }} 
            />
            <button 
              onClick={handleSend} 
              style={{ 
                width: "100%", 
                padding: "1.3rem", 
                fontSize: "1.1rem", 
                borderRadius: "1.25rem", 
                border: "none", 
                background: glow, 
                color: "white", 
                fontWeight: "bold", 
                cursor: "pointer", 
                boxShadow: `0 0 40px ${glow}65`,
                transition: "all 0.2s ease",
                transform: "scale(1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 0 60px ${glow}85`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 0 40px ${glow}65`;
              }}
            >Conectar Consciência</button>
          </div>
        </div>
      </div>

      {/* Controles de Personalização */}
      <div style={{ 
        position: "fixed", 
        bottom: "2rem", 
        right: "2rem", 
        display: "flex", 
        flexDirection: "column", 
        gap: "1rem", 
        zIndex: 1000 
      }}>
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          backdropFilter: "blur(10px)", 
          borderRadius: "1rem", 
          padding: "1rem", 
          border: `1px solid ${glow}30`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>⚡ Velocidade</span>
            <span style={{ fontSize: "0.75rem", color: glow, fontWeight: "bold" }}>{animationSpeed}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))} 
            style={{ 
              width: "150px", 
              cursor: "pointer" 
            }} 
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginTop: "0.3rem" }}>
            <span>Lento</span>
            <span>Rápido</span>
          </div>
        </div>

        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          backdropFilter: "blur(10px)", 
          borderRadius: "1rem", 
          padding: "0.8rem", 
          border: `1px solid ${glow}30`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>👁️ Ver</span>
            <button 
              onClick={() => setInfoDensity(prev => prev === 'min' ? 'med' : prev === 'med' ? 'max' : 'min')} 
              style={{ 
                background: `${glow}30`, 
                border: `1px solid ${glow}40`, 
                borderRadius: "0.5rem", 
                padding: "0.3rem 0.6rem", 
                color: glow, 
                cursor: "pointer", 
                fontSize: "0.75rem", 
                fontWeight: "bold", 
                transition: "all 0.2s ease" 
              }} 
            >
              {infoDensity === 'min' ? 'Mínimo' : infoDensity === 'med' ? 'Médio' : 'Máximo'}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popBounce { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes badgeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes pulse { 0%, 100% { opacity: 0.28; transform: scale(1); } 50% { opacity: 0.68; transform: scale(1.22); } }
        @keyframes tendril { 0%, 100% { opacity: 0.08; stroke-width: 1; } 50% { opacity: 0.25; stroke-width: 2; } }
        @keyframes float { 0%, 100% { opacity: 0.2; transform: translateY(0px) translateX(0px); } 25% { opacity: 0.5; transform: translateY(-30px) translateX(15px); } 50% { opacity: 0.3; transform: translateY(-50px) translateX(-10px); } 75% { opacity: 0.6; transform: translateY(-20px) translateX(20px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes inputPulse { 0%, 100% { box-shadow: 0 0 40px ${glow}40; } 50% { box-shadow: 0 0 70px ${glow}70; } }
        @keyframes clearShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
}