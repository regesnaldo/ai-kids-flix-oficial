 'use client';
import { useState, useEffect, useRef } from 'react';
import PageAudioGuide from '@/components/audio/PageAudioGuide';
import ambientEngine, { type Emotion } from '@/cognitive/audio/ambientEngine';
import SceneTransition from '@/components/simulador/SceneTransition';
import { initialLabState } from '@/cognitive/core/labState';
import { applyEmotionSensor } from '@/cognitive/sensors/emotionSensor';
import { detectEmotion as detectAmbientEmotion } from '@/lib/emotion-detector';

type EmotionType = "neutral" | "joy" | "sadness" | "anger" | "fear" | "love" | "curiosity";

const emotionToAmbient: Record<EmotionType, Emotion> = {
  neutral: "neutro",
  joy: "alegria",
  sadness: "tristeza",
  anger: "tensao",
  fear: "tensao",
  love: "alegria",
  curiosity: "neutro",
};

export default function SimuladorPage() {
  const [labState, setLabState] = useState(initialLabState);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{text: string; emotion: EmotionType}>>([]);
  const [breath, setBreath] = useState(0);
  const [particles, setParticles] = useState<Array<{x: string; y: string; size: number; delay: number; duration: number}>>([]);
  const [metrics, setMetrics] = useState({arousal: 30, valence: 50, load: 20});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutro');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const detectEmotion = (t: string): EmotionType => {
    const l = t.toLowerCase();
    if (l.includes("feliz") || l.includes("animado") || l.includes("alegre")) return "joy";
    if (l.includes("triste") || l.includes("sozinho") || l.includes("choro")) return "sadness";
    if (l.includes("raiva") || l.includes("odio") || l.includes("nervoso")) return "anger";
    if (l.includes("medo") || l.includes("panico") || l.includes("ansioso")) return "fear";
    if (l.includes("amor") || l.includes("apaixon") || l.includes("carinho")) return "love";
    if (l.includes("curioso") || l.includes("por que") || l.includes("como")) return "curiosity";
    return "neutral";
  };

  const emotion = detectEmotion(input);
  const colors: Record<EmotionType, string> = { neutral: "#8b5cf6", joy: "#22c55e", sadness: "#3b82f6", anger: "#ef4444", fear: "#a855f7", love: "#ec4899", curiosity: "#14b8a6" };
  const glow = colors[emotion];
  const labels: Record<EmotionType, string> = { neutral: "NEUTRO", joy: "ALEGRIA", sadness: "TRISTEZA", anger: "RAIVA", fear: "MEDO", love: "AMOR", curiosity: "CURIOSIDADE" };

  useEffect(() => { const a = () => { setBreath(Math.sin(Date.now() / 800)); requestAnimationFrame(a); }; a(); }, []);

  useEffect(() => {
    setParticles(Array(25).fill(0).map(() => ({ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, size: 2 + Math.random() * 4, delay: Math.random() * 5, duration: 5 + Math.random() * 10 })));
  }, []);

  useEffect(() => {
    const ba = emotion === 'neutral' ? 30 : emotion === 'joy' ? 70 : emotion === 'sadness' ? 40 : emotion === 'anger' ? 85 : emotion === 'fear' ? 75 : emotion === 'love' ? 65 : 50;
    const bv = emotion === 'neutral' ? 50 : emotion === 'joy' ? 85 : emotion === 'sadness' ? 25 : emotion === 'anger' ? 30 : emotion === 'fear' ? 35 : emotion === 'love' ? 90 : 60;
    const bl = input ? 40 + Math.random() * 30 : 20;
    const iv = setInterval(() => { setMetrics({ arousal: Math.min(100, Math.max(0, ba + (Math.random() - 0.5) * 10)), valence: Math.min(100, Math.max(0, bv + (Math.random() - 0.5) * 10)), load: Math.min(100, Math.max(0, bl + (Math.random() - 0.5) * 15)) }); }, 300);
    return () => clearInterval(iv);
  }, [emotion, input]);

  useEffect(() => {
    if (messages.length > 0) {
      const t = setTimeout(() => { const el = document.getElementById('sim-chat'); if (el) el.scrollTop = el.scrollHeight; }, 150);
      return () => clearTimeout(t);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const em = detectEmotion(input);
    const ambientEmotion = detectAmbientEmotion(input);

    if (ambientEngine.isMutedState()) {
      await ambientEngine.unmute();
    }
    ambientEngine.setEmotion(ambientEmotion);
    setCurrentEmotion(ambientEmotion);

    const newState = applyEmotionSensor(labState, input);
    setLabState(newState);
    setMessages(prev => [...prev, { text: input, emotion: em }]);
    if (messages.length === 0) setAchievements(a => [...a, "Primeira Conexao Neural"]);
    if (em === "joy" && !achievements.includes("Onda de Alegria")) setAchievements(a => [...a, "Onda de Alegria"]);
    if (em === "anger" && !achievements.includes("Tempestade Emocional")) setAchievements(a => [...a, "Tempestade Emocional"]);
    if (em === "curiosity" && !achievements.includes("Mente Exploradora")) setAchievements(a => [...a, "Mente Exploradora"]);
    if (messages.length >= 9 && !achievements.includes("10 Conexoes")) setAchievements(a => [...a, "10 Conexoes Neurais"]);
    setInput('');
  };

  const scale = 1 + breath * 0.008;

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at center, ${glow}15 0%, #020617 50%, #000 100%)`, transition: 'background 0.6s ease', color: '#e5fff7', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <SceneTransition currentEmotion={currentEmotion} />
      <PageAudioGuide pageTitle="Simulador de Consciencia" audioPath="/audio/simulador-welcome.mp3" description="Ative o fluxo de consciencia e observe respostas emocionais." script="Bem-vindo ao Simulador de Consciencia do MENTE.AI. Digite seu estado no campo de texto. Clique em Conectar Consciencia. Observe como NEXUS processa o sinal emocional." />

      {particles.map((pt, i) => (<div key={i} style={{ position: 'absolute', width: `${pt.size}px`, height: `${pt.size}px`, left: pt.x, top: pt.y, background: glow, borderRadius: '50%', filter: 'blur(1px)', animation: `simFloat ${pt.duration}s ease-in-out infinite`, animationDelay: `${pt.delay}s`, pointerEvents: 'none', opacity: 0.3, zIndex: 1 }} />))}

      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${glow}20 0%, transparent 70%)`, filter: 'blur(80px)', transition: 'all 0.6s ease', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 2rem 2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', position: 'relative', zIndex: 10 }}>

        <div id="sim-chat" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1.5rem', padding: '1.5rem', backdropFilter: 'blur(20px)', border: `1px solid ${glow}25`, height: 'calc(100vh - 8rem)', maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
          <h3 style={{ color: glow, marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}><span>Conexoes Neurais</span><span style={{ fontSize: '0.7rem', background: `${glow}20`, padding: '0.2rem 0.6rem', borderRadius: '9999px', border: `1px solid ${glow}30` }}>{messages.length}</span></h3>
          {messages.length === 0 ? (<p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontStyle: 'italic' }}>Aguardando sinal neural...</p>) : (<>{messages.map((msg, i) => (<div key={i} style={{ background: `${colors[msg.emotion]}10`, borderRadius: '0.8rem', padding: '0.8rem', marginBottom: '0.6rem', borderLeft: `3px solid ${colors[msg.emotion]}`, transition: 'all 0.3s ease', animation: 'simFadeIn 0.3s ease' }}><p style={{ color: 'white', margin: '0 0 0.2rem', fontSize: '0.85rem', lineHeight: 1.5 }}>{msg.text}</p><span style={{ color: colors[msg.emotion], fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{labels[msg.emotion]}</span></div>))}</>)}
          {messages.length > 0 && (<button onClick={() => setMessages([])} style={{ width: '100%', padding: '0.6rem', marginTop: '0.8rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${glow}20`, borderRadius: '0.6rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.3s' }}>Limpar Conexoes</button>)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, letterSpacing: '4px', textAlign: 'center', textShadow: `0 0 40px ${glow}40`, margin: 0 }}>Simulador de Consciencia</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>Conecte sua mente ao NEXUS. Cada palavra gera uma onda neural unica.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', width: '100%', maxWidth: '500px' }}>
            {[{ l: "Emocao", v: labels[emotion] }, { l: "Processamento", v: input ? "Ativo" : "Standby" }, { l: "Consciencia", v: messages.length > 5 ? "Expandida" : messages.length > 0 ? "Conectada" : "Latente" }].map((s, i) => (<div key={i} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: `1px solid ${glow}15`, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>{s.l}</p><p style={{ color: glow, fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>{s.v}</p></div>))}
          </div>

          <div style={{ width: '100%', maxWidth: '500px', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.2rem', border: `1px solid ${glow}15` }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.8rem', textAlign: 'center' }}>Metricas Neurais</p>
            {[{ l: "Ativacao", v: metrics.arousal, c: "#ef4444" }, { l: "Valencia", v: metrics.valence, c: "#3b82f6" }, { l: "Carga", v: metrics.load, c: "#8b5cf6" }].map((m, i) => (<div key={i} style={{ marginBottom: i < 2 ? '0.6rem' : 0 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.3rem' }}><span style={{ color: 'rgba(255,255,255,0.5)' }}>{m.l}</span><span style={{ color: m.c, fontFamily: 'monospace' }}>{Math.round(m.v)}%</span></div><div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${m.v}%`, height: '100%', background: `linear-gradient(90deg, ${m.c}60, ${m.c})`, borderRadius: '2px', transition: 'width 0.4s ease' }} /></div></div>))}
          </div>

          {achievements.length > 0 && (<div style={{ width: '100%', maxWidth: '500px', padding: '1rem', background: `${glow}08`, borderRadius: '1rem', border: `1px solid ${glow}15` }}><p style={{ color: glow, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.6rem', fontWeight: 700 }}>Conquistas Desbloqueadas</p>{achievements.map((a, i) => (<div key={i} style={{ padding: '0.4rem 0.8rem', marginBottom: '0.3rem', background: `${glow}10`, borderRadius: '0.5rem', borderLeft: `2px solid ${glow}`, animation: 'simFadeIn 0.4s ease' }}><span style={{ color: 'white', fontSize: '0.75rem' }}>{a}</span></div>))}</div>)}

          <div style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease', width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.04)', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: `0 0 60px ${glow}15, inset 0 0 30px ${glow}05`, border: `1px solid ${glow}20`, backdropFilter: 'blur(20px)' }}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Expresse seu estado neural..." style={{ width: '100%', padding: '0.9rem 1.2rem', fontSize: '1rem', borderRadius: '1rem', border: `1px solid ${glow}30`, background: 'rgba(0,0,0,0.4)', color: 'white', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box', transition: 'border-color 0.3s' }} />
            <button onClick={sendMessage} style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', borderRadius: '1rem', border: 'none', background: `linear-gradient(135deg, ${glow}, ${glow}88)`, color: 'white', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: `0 0 30px ${glow}30`, transition: 'all 0.3s' }}>Conectar Consciencia</button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes simFloat { 0%, 100% { opacity: 0.15; transform: translateY(0) translateX(0); } 25% { opacity: 0.4; transform: translateY(-25px) translateX(12px); } 50% { opacity: 0.2; transform: translateY(-40px) translateX(-8px); } 75% { opacity: 0.5; transform: translateY(-15px) translateX(18px); } }
        @keyframes simFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        #sim-chat::-webkit-scrollbar { width: 4px; }
        #sim-chat::-webkit-scrollbar-track { background: transparent; }
        #sim-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
