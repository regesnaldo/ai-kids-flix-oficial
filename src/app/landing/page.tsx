"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, ArrowRight, Brain, Zap, Users, Star, ChevronDown } from "lucide-react";

const DEMO_QUESTIONS = [
  "O que é inteligência artificial?",
  "Como uma IA aprende?",
  "Qual é a diferença entre IA e um programa normal?",
];

const NEXUS_RESPONSES = [
  "Imagine que você está ensinando uma criança a reconhecer gatos. Você mostra milhares de fotos e diz 'isso é um gato' ou 'isso não é um gato'. Uma inteligência artificial aprende do mesmo jeito! Só que em vez de alguns milhares de exemplos, ela pode ver milhões — e em segundos. Não é mágica: é padrão. É matemática. É você ensinando uma máquina a ver o mundo como você vê.",
  "Pense em como você aprendeu a andar de bicicleta. Você caiu, tentou de novo, ajustou o equilíbrio. Uma IA aprende de forma parecida! Ela faz uma previsão, compara com a resposta certa, calcula o erro, e se ajusta. Isso se chama 'backpropagation' — mas você pode chamar de 'tentativa e erro turbinado'. A diferença é que a IA pode fazer isso bilhões de vezes em minutos.",
  "Um programa tradicional é como uma receita de bolo: você segue os passos exatamente e sempre obtém o mesmo resultado. Se você pedir '2+2', ele sempre responde '4'. Uma IA é diferente: você não programa regras, você mostra exemplos. Em vez de dizer 'gato tem 4 patas, bigodes e mia', você mostra 10 mil fotos de gatos. A IA descobre sozinha o que é um gato — e depois reconhece até gatos que nunca viu antes. É a diferença entre decorar e aprender.",
];

export default function LandingPage() {
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "nexus"; content: string }>>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  function handleAskQuestion(q: string) {
    if (isTyping || questionIndex >= 3) return;

    const userMsg = { role: "user" as const, content: q };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const nexusMsg = { role: "nexus" as const, content: NEXUS_RESPONSES[questionIndex] };
      setChatMessages((prev) => [...prev, nexusMsg]);
      setIsTyping(false);

      const next = questionIndex + 1;
      setQuestionIndex(next);

      if (next >= 3) {
        setTimeout(() => setShowCTA(true), 1000);
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen" style={{ background: "#030712" }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.08) 0%, transparent 60%)" }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(0,240,255,0.03)" }} />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(168,85,247,0.03)" }} />
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl relative z-10"
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider"
              style={{ background: "rgba(0,240,255,0.1)", color: "#00f0ff", border: "1px solid rgba(0,240,255,0.2)" }}>
              <Sparkles size={14} />
              METAVERSO EDUCACIONAL DE IA
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)", textShadow: "0 0 40px rgba(0,240,255,0.15)" }}>
            Não apenas use<br />
            <span style={{ color: "#00f0ff" }}>Inteligência Artificial.</span><br />
            Entenda-a.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            12 universos. 12 agentes de IA. Uma jornada cinematográfica
            para dominar a tecnologia que está transformando o mundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setHasStarted(true);
                setTimeout(() => {
                  const el = document.getElementById("demo-chat");
                  el?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105 animate-pulse"
              style={{
                background: "linear-gradient(135deg, #00f0ff, #a855f7)",
                color: "#fff",
                boxShadow: "0 0 32px rgba(0,240,255,0.3)",
              }}
            >
              Comece sua jornada
              <ArrowRight size={18} className="inline ml-2" />
            </button>
            <Link
              href="/cadastro"
              className="px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,240,255,0.3)",
                color: "#00f0ff",
              }}
            >
              Criar conta grátis
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mt-12 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-gray-600" />
              <span>12 agentes de IA</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-gray-600" />
              <span>+50 episódios</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-gray-600" />
              <span>4.9 ★</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 text-gray-600"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── DEMO CHAT ────────────────────────────────────────── */}
      <section id="demo-chat" className="max-w-2xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border"
          style={{ background: "rgba(10,10,30,0.8)", borderColor: "rgba(0,240,255,0.15)", backdropFilter: "blur(16px)" }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(0,240,255,0.1)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,240,255,0.15)" }}>
              <Sparkles size={14} style={{ color: "#00f0ff" }} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Converse com o NEXUS</p>
              <p className="text-gray-500 text-xs">Demo gratuita — 3 perguntas</p>
            </div>
          </div>

          {/* Messages */}
          <div className="px-5 py-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            {!hasStarted && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm mb-4">
                  Clique em &ldquo;Comece sua jornada&rdquo; para experimentar o NEXUS.
                </p>
                <p className="text-gray-600 text-xs">
                  Você pode fazer 3 perguntas grátis sem criar conta.
                </p>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user" ? "rgba(0,240,255,0.1)" : "rgba(255,255,255,0.05)",
                    color: msg.role === "user" ? "#00f0ff" : "#d1d5db",
                    border: `1px solid ${msg.role === "user" ? "rgba(0,240,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-gray-500 text-xs animate-pulse">NEXUS está escrevendo...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Question buttons / CTA */}
          <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(0,240,255,0.1)" }}>
            <AnimatePresence mode="wait">
              {showCTA ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-white font-bold text-sm mb-2">
                    Para continuar sua jornada e ganhar XP, crie sua conta grátis.
                  </p>
                  <Link
                    href="/cadastro"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #00f0ff, #a855f7)",
                      color: "#fff",
                      boxShadow: "0 0 24px rgba(0,240,255,0.3)",
                    }}
                  >
                    Criar conta grátis
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ) : hasStarted && questionIndex < 3 ? (
                <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-gray-500 text-xs mb-3">
                    Escolha uma pergunta ({3 - questionIndex} restantes):
                  </p>
                  {DEMO_QUESTIONS.slice(questionIndex).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskQuestion(q)}
                      disabled={isTyping}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                      style={{
                        background: "rgba(0,240,255,0.05)",
                        border: "1px solid rgba(0,240,255,0.15)",
                        color: "#e5e7eb",
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── JSON-LD Structured Data ─────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "MENTE.AI",
            description: "Metaverso educacional de inteligência artificial com 12 agentes interativos. Aprenda IA de forma cinematográfica e imersiva.",
            url: "https://mente-ai.vercel.app",
            knowsAbout: ["Inteligência Artificial", "Machine Learning", "Deep Learning", "Redes Neurais"],
            areaServed: "Brasil",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "MENTE.AI",
            url: "https://mente-ai.vercel.app",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "BRL",
            },
          }),
        }}
      />
    </div>
  );
}
