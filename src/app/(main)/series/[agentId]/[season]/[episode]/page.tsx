"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Play, Sparkles, Zap, Volume2, VolumeX } from "lucide-react";
import { allAgents } from "@/data/agents";
import { useDeepSeek } from "@/hooks/useDeepSeek";
import { useGoogleTTS } from "@/hooks/useGoogleTTS";
import { useAppStore } from "@/store/useAppStore";
import { useSession } from "@/providers/SessionProvider";
import { PaywallBanner } from "@/components/home/PaywallBanner";
import { queueConquest } from "@/components/gamification/ConquestNotification";
import { useGamification } from "@/components/gamification/GamificationProvider";
import { getStaticScreenplay } from "@/data/static-screenplays";

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Choice {
  pergunta: string;
  opcoes: [string, string, string];
  continuacoes: [string, string, string];
}

interface Screenplay {
  abertura: string;
  narrativa: string;
  pausas: Choice[];
  encerramento: string;
  videoUrl?: string;
}

type Phase = "loading" | "abertura" | "video" | "narrativa" | "pausa" | "continuacao" | "encerramento" | "fim";

function useTypewriter(text: string, speed: number = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    const tick = () => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };

    tick();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  return { displayed, done };
}

/* ─── Main Page ──────────────────────────────────────────────────────── */

export default function ScreenplayPlayerPage() {
  const params = useParams<{
    agentId: string;
    season: string;
    episode: string;
  }>();
  const router = useRouter();
  const agentId = params.agentId;
  const season = parseInt(params.season, 10);
  const episode = parseInt(params.episode, 10);

  const agent = allAgents.find((a) => a.id === agentId);
  const { generate, loading: genLoading } = useDeepSeek();
  const { play: speakTTS, stop: stopTTS, state: ttsState } = useGoogleTTS();
  const { user } = useSession();

  const setLogosActive = useAppStore((s) => s.setLogosActive);
  const { setPlaybackActive } = useGamification();

  // ── Paywall: bloqueia episódios 2+ para usuários FREE ─────
  const isPremium = user?.plan && user.plan !== "FREE" && user.planStatus === "active";
  const isPaywalled = episode > 1 && !isPremium;

  const [screenplay, setScreenplay] = useState<Screenplay | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [currentPauseIdx, setCurrentPauseIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [continuationText, setContinuationText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  // Hide HUD during episode playback
  useEffect(() => {
    setPlaybackActive(true);
    return () => setPlaybackActive(false);
  }, [setPlaybackActive]);

  // Para o TTS ao mudar de cena/phase (evita áudio fantasma)
  useEffect(() => {
    stopTTS();
  }, [phase, stopTTS]);

  // Award XP and save progress when episode completes
  useEffect(() => {
    if (phase !== "fim" || xpAwarded > 0) return;
    // Trigger LOGOS gate every 3 episodes
    if (episode % 3 === 0) {
      setLogosActive(true, `Temporada ${season}, Episódio ${episode}`, agentId, `s${season}e${episode}`);
    }
    (async () => {
      try {
        const res = await fetch("/api/progress/complete", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId,
            season,
            episode,
            choicesMade: selectedChoice !== null,
            firstOfDay: true,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setXpAwarded(data.xpAwarded || 50);
          setShowCompletionToast(true);
          setTimeout(() => setShowCompletionToast(false), 4000);
          queueConquest({
            id: `${agentId}_s${season}_e${episode}`,
            xp: data.xpAwarded || 50,
            message: "Episódio concluído!",
            agent: agent?.name,
            season,
            episode,
          });
        }
      } catch (error) {
        console.error("[EPISODE] Erro ao salvar progresso:", error);
      }
    })();
  }, [phase, xpAwarded, agentId, season, episode, selectedChoice, agent]);

  // Typewriter for each phase
  const { displayed: displayedAbertura, done: aberturaDone } = useTypewriter(
    screenplay?.abertura || "",
    25
  );
  const { displayed: displayedNarrativa, done: narrativaDone } =
    useTypewriter(
      phase === "narrativa" || phase === "continuacao"
        ? phase === "continuacao"
          ? continuationText
          : screenplay?.narrativa || ""
        : "",
      20
    );
  const { displayed: displayedEncerramento, done: encerramentoDone } =
    useTypewriter(
      phase === "encerramento" ? screenplay?.encerramento || "" : "",
      22
    );

  // Phase transitions
  useEffect(() => {
    if (phase === "abertura" && aberturaDone && screenplay) {
      const nextPhase = screenplay.videoUrl ? "video" : "narrativa";
      const timer = setTimeout(() => setPhase(nextPhase), 800);
      return () => clearTimeout(timer);
    }
    if (phase === "narrativa" && narrativaDone && screenplay) {
      const timer = setTimeout(() => {
        if (screenplay.pausas && screenplay.pausas.length > 0) {
          setPhase("pausa");
        } else {
          setPhase("encerramento");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (phase === "continuacao" && narrativaDone && screenplay) {
      const timer = setTimeout(() => {
        const nextPause = currentPauseIdx + 1;
        if (screenplay.pausas && nextPause < screenplay.pausas.length) {
          setCurrentPauseIdx(nextPause);
          setPhase("pausa");
        } else {
          setPhase("encerramento");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
    if (phase === "encerramento" && encerramentoDone) {
      const timer = setTimeout(() => setPhase("fim"), 1500);
      return () => clearTimeout(timer);
    }
  }, [
    phase,
    aberturaDone,
    narrativaDone,
    encerramentoDone,
    screenplay,
    currentPauseIdx,
  ]);

  // Load screenplay — content API first, DeepSeek fallback
  const loadScreenplay = useCallback(async () => {
    if (!agent) return;
    setError(null);

    // 1. Try Knowledge Asset Layer first
    try {
      const res = await fetch(
        `/api/series/content?agent=${agent.id}&season=${season}&ep=${episode}`,
        { credentials: "include" },
      );
      if (res.ok) {
        const apiData = await res.json();
        const src = res.headers.get("X-Content-Source");
        // If we got cached or draft content, use it
        if (apiData.asset?.content) {
          const content = apiData.asset.content as Screenplay;
          if (content.abertura) {
            setScreenplay(content);
            setPhase("abertura");
            return;
          }
        }
        // If generated by DeepSeek via API, it's already in the response
        if (src === "generated" && apiData.asset?.content?.abertura) {
          setScreenplay(apiData.asset.content as Screenplay);
          setPhase("abertura");
          return;
        }
      }
    } catch {
      // API unavailable — fall through to static seed
    }

    // 2. Static seed fallback (no DB dependency)
    try {
      const staticData = getStaticScreenplay(agent.id, season, episode);
      if (staticData?.abertura) {
        if (process.env.NODE_ENV === 'development') console.log('[EPISODE] STATIC SEED HIT —', agent.id, season, episode);
        setScreenplay(staticData);
        setPhase("abertura");
        return;
      }
    } catch {
      // Fall through to DeepSeek
    }

    // 3. Fallback: direct DeepSeek generation
    const data = await generate<Screenplay>({
      agentId: agent.id,
      season,
      episode,
      type: "roteiro",
      system: `Você é ${agent.name}. ${agent.personality.approach}
Tom: ${agent.personality.tone}. Valores: ${agent.personality.values.join(", ")}.
Dimensão: ${agent.dimension}. Nível: ${agent.level}.

Você está escrevendo um ROTEIRO CINEMATOGRÁFICO INTERATIVO em PORTUGUÊS BRASILEIRO.

Formato EXATO da resposta JSON:
{
  "abertura": "CENA DE ABERTURA cinematográfica. Descreva o ambiente, atmosfera, luzes. Use linguagem visual rica. 150-300 caracteres.",
  "narrativa": "NARRATIVA PRINCIPAL. Conteúdo educacional em formato de história. Explique o conceito como se estivesse conversando com um aprendiz curioso. Use analogias da vida real. 400-800 caracteres.",
  "pausas": [
    {
      "pergunta": "Pergunta interativa para o aprendiz. Faça ele refletir sobre o que aprendeu.",
      "opcoes": ["Opção A - resposta intuitiva", "Opção B - resposta curiosa", "Opção C - resposta criativa"],
      "continuacoes": ["Continuação se escolher A (200-300 caracteres)", "Continuação se escolher B (200-300 caracteres)", "Continuação se escolher C (200-300 caracteres)"]
    },
    {
      "pergunta": "Segunda pergunta interativa. Mais profunda que a primeira.",
      "opcoes": ["Opção A", "Opção B", "Opção C"],
      "continuacoes": ["Continuação A", "Continuação B", "Continuação C"]
    }
  ],
  "encerramento": "ENCERRAMENTO. Gancho para o próximo episódio. Deixe o aprendiz curioso. 150-250 caracteres."
}

REGRAS:
- Escreva TUDO em português brasileiro natural, sem formalidades
- Use linguagem simples. Evite academicismo.
- As pausas DEVEM ter EXATAMENTE 3 opções cada
- As continuações DEVEM ser coerentes com a opção escolhida
- NÃO use markdown, asteriscos ou formatação especial
- NÃO mencione "JSON" ou "resposta" no texto`,
      prompt: `Escreva o Episódio ${episode} da Temporada ${season} da sua série.
Você é ${agent.name}.
Seu objetivo é ensinar sobre ${agent.laboratoryTask.slice(0, 100)}.
Escreva como se estivesse falando diretamente com um jovem aprendiz no MENTE.AI.
Use analogias simples do dia a dia.
Seja cinematográfico, imersivo, inspirador.`,
      jsonMode: true,
      temperature: 0.95,
    });

    if (data?.abertura) {
      setScreenplay(data);
      setPhase("abertura");
    } else {
      setError("O roteiro deste episódio ainda não está disponível. Execute o seed de episódios ou aguarde a geração automática.");
    }
  }, [agent, season, episode, generate]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log('[EPISODE] Loading:', agentId, season, episode);
    loadScreenplay();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle choice selection
  const handleChoice = (choiceIdx: number) => {
    if (!screenplay) return;
    const currentPause = screenplay.pausas?.[currentPauseIdx];
    if (!currentPause) return;

    setSelectedChoice(choiceIdx);
    setContinuationText(currentPause.continuacoes[choiceIdx]);
    setPhase("continuacao");
  };

  // Navigation
  const hasPrev = episode > 1;
  const hasNext = true; // Always show next (up to 10)
  const goPrev = () =>
    router.push(`/series/${agentId}/${season}/${episode - 1}`);
  const goNext = () =>
    router.push(`/series/${agentId}/${season}/${episode + 1}`);

  if (!agent) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#050510" }}
      >
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Agente Não Encontrado
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            O agente <code className="text-gray-500">{agentId}</code> não está no catálogo.
          </p>
          <Link
            href="/series"
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Voltar para Séries
          </Link>
        </div>
      </main>
    );
  }

  if (isPaywalled) {
    return (
      <main className="min-h-screen" style={{ background: "#050510" }}>
        <PaywallBanner
          agentId={agentId}
          season={season}
          episode={episode}
          agentColor={agent?.color}
        />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#050510" }}
    >
      {/* Ambient background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${agent.color}15 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 70%, ${agent.color}08 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Top nav bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/series/${agent.id}/${season}`}
            className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            Episódios
          </Link>
          <span className="text-gray-600 text-sm">•</span>
          <span className="text-gray-500 text-sm">
            T{season} E{episode}
          </span>
        </div>
        <span className="text-xs font-bold" style={{ color: agent.color }}>
          {agent.name}
        </span>
      </nav>

      {/* Main cinematic area */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-8 pb-32">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mb-6"
              >
                <Sparkles size={48} style={{ color: agent.color }} />
              </motion.div>
              <h2 className="text-white text-xl font-bold mb-2">
                Gerando episódio...
              </h2>
              <p className="text-gray-500 text-sm text-center max-w-md">
                {agent.name} está escrevendo um roteiro cinematográfico
                interativo para você. Isso pode levar alguns segundos.
              </p>
              {error && (
                <button
                  onClick={loadScreenplay}
                  className="mt-6 px-6 py-3 rounded-lg text-sm font-bold transition"
                  style={{
                    background: `${agent.color}20`,
                    color: agent.color,
                    border: `1px solid ${agent.color}30`,
                  }}
                >
                  Tentar novamente
                </button>
              )}
            </motion.div>
          )}

          {/* Opening scene */}
          {phase === "abertura" && (
            <motion.div
              key="abertura"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${agent.color}20` }}
                >
                  <Play size={18} style={{ color: agent.color }} />
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  Cena de Abertura
                </span>
              </div>
              <motion.p
                className="text-white/90 text-lg md:text-xl leading-relaxed tracking-wide"
                style={{
                  fontFamily: "var(--font-display)",
                  textShadow: `0 0 20px ${agent.color}10`,
                }}
              >
                {displayedAbertura}
                {!aberturaDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block ml-1"
                    style={{ color: agent.color }}
                  >
                    ▌
                  </motion.span>
                )}
              </motion.p>
            </motion.div>
          )}

          {/* Video Player */}
          {phase === "video" && screenplay?.videoUrl && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black mb-6"
            >
              {screenplay.videoUrl.includes("youtube") || screenplay.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={screenplay.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/") + "?autoplay=1"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={screenplay.videoUrl}
                  autoPlay
                  controls
                  playsInline
                  preload="metadata"
                  onEnded={() => setPhase("narrativa")}
                  className="w-full h-full object-cover"
                >
                  Seu navegador não suporta vídeo HTML5.
                </video>
              )}
              <button
                onClick={() => setPhase("narrativa")}
                className="absolute bottom-4 right-4 px-4 py-2 text-sm font-bold rounded-lg bg-black/70 text-white hover:bg-black/90 transition"
              >
                Pular vídeo →
              </button>
            </motion.div>
          )}

          {/* Narrative / Continuation */}
          {(phase === "narrativa" || phase === "continuacao") && (
            <motion.div
              key="narrativa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${agent.color}15` }}
                >
                  <span
                    className="text-lg font-black"
                    style={{ color: agent.color }}
                  >
                    {agent.name.charAt(0)}
                  </span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: agent.color }}
                >
                  {agent.name}
                </span>
                <button
                  onClick={() => speakTTS(displayedNarrativa || screenplay?.narrativa || "", agent.id)}
                  disabled={ttsState === "loading"}
                  className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-white/5 ${
                    ttsState === "error" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ color: ttsState === "error" ? "#ef4444" : agent.color }}
                  title={
                    ttsState === "error"
                      ? "Áudio indisponível no momento"
                      : ttsState === "loading"
                      ? "Carregando áudio..."
                      : "Ouvir narração"
                  }
                  aria-label="Ouvir narração"
                >
                  {ttsState === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : ttsState === "error" ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} className={ttsState === "playing" ? "animate-pulse" : ""} />
                  )}
                </button>
                {phase === "continuacao" && selectedChoice !== null && (
                  <span className="text-xs text-gray-500 ml-2">
                    Resposta à sua escolha
                  </span>
                )}
              </div>
              <motion.p className="text-white/85 text-base md:text-lg leading-relaxed">
                {displayedNarrativa}
                {!narrativaDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block ml-1"
                    style={{ color: agent.color }}
                  >
                    ▌
                  </motion.span>
                )}
              </motion.p>
            </motion.div>
          )}

          {/* Interactive pause */}
          {phase === "pausa" && screenplay?.pausas?.[currentPauseIdx] && (
            <motion.div
              key={`pausa-${currentPauseIdx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `${agent.color}20`,
                    border: `1px solid ${agent.color}30`,
                  }}
                >
                  <span className="text-lg">⚡</span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: agent.color }}
                >
                  Pausa Interativa
                </span>
              </div>

              <motion.p className="text-white text-lg font-bold leading-relaxed">
                {screenplay.pausas[currentPauseIdx].pergunta}
              </motion.p>

              <div className="space-y-3 mt-4">
                {screenplay.pausas[currentPauseIdx].opcoes.map(
                  (opcao, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChoice(idx)}
                      className="w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 group"
                      style={{
                        borderColor: "rgba(255,255,255,0.08)",
                        background: "#0d0d1f",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${agent.color}40`;
                        e.currentTarget.style.background = `${agent.color}08`;
                        e.currentTarget.style.boxShadow = `0 0 20px ${agent.color}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                        e.currentTarget.style.background = "#0d0d1f";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `${agent.color}15`,
                            color: agent.color,
                          }}
                        >
                          {["A", "B", "C"][idx]}
                        </span>
                        <span className="text-gray-300 text-sm group-hover:text-white transition">
                          {opcao}
                        </span>
                      </div>
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Closing */}
          {phase === "encerramento" && (
            <motion.div
              key="encerramento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${agent.color}10` }}
                >
                  <span className="text-lg">🔚</span>
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  Encerramento
                </span>
              </div>
              <motion.p className="text-white/80 text-lg leading-relaxed italic">
                {displayedEncerramento}
                {!encerramentoDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block ml-1"
                    style={{ color: agent.color }}
                  >
                    ▌
                  </motion.span>
                )}
              </motion.p>
            </motion.div>
          )}

          {/* Episode complete */}
          {phase === "fim" && (
            <motion.div
              key="fim"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background: `${agent.color}20`,
                  border: `2px solid ${agent.color}40`,
                }}
              >
                <Sparkles size={28} style={{ color: agent.color }} />
              </motion.div>
              <h2 className="text-white text-2xl font-bold mb-2">
                Episódio {episode} Concluído
              </h2>
              {xpAwarded > 0 && (
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="text-lg font-bold mb-4 flex items-center justify-center gap-2"
                  style={{ color: "var(--neon-cyan)" }}
                >
                  <Zap size={20} /> +{xpAwarded} XP
                </motion.p>
              )}
              <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                {screenplay?.encerramento?.slice(0, 120)}
              </p>

              <div className="flex items-center justify-center gap-4">
                {hasPrev && (
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition border border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <ChevronLeft size={18} />
                    Anterior
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition"
                    style={{
                      background: agent.color,
                      color: "#fff",
                      boxShadow: `0 4px 20px ${agent.color}30`,
                    }}
                  >
                    Próximo Episódio
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>

              <Link
                href={`/series/${agent.id}/${season}`}
                className="inline-block mt-4 text-xs text-gray-500 hover:text-gray-300 transition"
              >
                Voltar para lista de episódios
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Toast */}
      <AnimatePresence>
        {showCompletionToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl"
              style={{
                background: "rgba(5,5,20,0.95)",
                border: `1px solid ${agent?.color || "#00f0ff"}40`,
                backdropFilter: "blur(16px)",
              }}
            >
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-white font-bold text-sm">Episódio Concluído!</p>
                <p className="text-xs" style={{ color: agent?.color || "#00f0ff" }}>
                  +{xpAwarded} XP
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
