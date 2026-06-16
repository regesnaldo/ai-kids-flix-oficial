"use client";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, Play, X, Star, Zap } from "lucide-react";
import { getEpisodeById, getSeasonById } from "@/constants/catalog";

interface ChatTurn { role: "user" | "assistant"; content: string; }

import { getWatchMap, saveWatchMap } from "@/lib/watch-progress";
import type { WatchState } from "@/lib/watch-progress";

function getAgentImage(agentId: string): string {
  return `/images/agentes/${agentId.toLowerCase()}.png`;
}

function AudioButton({ text }: { text: string }) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleClick() {
    if (loading) return;
    if (playing && audioRef.current) { audioRef.current.pause(); setPlaying(false); return; }
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); setPlaying(true); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/elevenlabs/speak", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = document.createElement("audio");
      audio.src = url;
      audio.addEventListener("canplaythrough", () => { setLoading(false); setPlaying(true); void audio.play(); });
      audio.addEventListener("ended", () => { setPlaying(false); URL.revokeObjectURL(url); });
      audio.addEventListener("error", () => { setLoading(false); setPlaying(false); URL.revokeObjectURL(url); });
      audioRef.current = audio;
      audio.load();
    } catch { setLoading(false); setPlaying(false); }
  }

  return (
    <button onClick={handleClick} className="flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xs transition"
      style={{ borderColor: "rgba(59,130,246,0.3)", background: playing ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.05)", color: playing ? "#3B82F6" : "#888" }}>
      {loading ? "..." : playing ? "||" : "\u25B6"}
    </button>
  );
}

function PlayerContent() {
  const router = useRouter();
  const params = useSearchParams();
  const rawEpisode = params.get("episode") || "S01E01";
  const episodeId = /^S\d{2}E\d{2}$/i.test(rawEpisode.trim()) ? rawEpisode.trim().toUpperCase() : "S01E01";

  const episode = useMemo(() => getEpisodeById(episodeId), [episodeId]);
  const season = useMemo(() => getSeasonById(episodeId.slice(0, 3)), [episodeId]);
  const resolved = episode ?? getEpisodeById("S01E01")!;
  const resolvedSeason = season ?? getSeasonById("S01")!;

  const videoUrl = (resolved?.videoUrl || "").trim();
  const hasVideo = videoUrl.length > 0;
  const agentId = resolved.agentId || "NEXUS";
  const episodes = resolvedSeason?.episodes || [];

  const currentIdx = episodes.findIndex(e => e.id === episodeId);
  const prevEpisode = currentIdx > 0 ? episodes[currentIdx - 1] : null;
  const nextEpisode = currentIdx >= 0 && currentIdx < episodes.length - 1 ? episodes[currentIdx + 1] : null;

  const [watchMap, setWatchMap] = useState<Record<string, WatchState>>({});
  const [activeTab, setActiveTab] = useState<"video" | "chat">(hasVideo ? "video" : "chat");
  const [chatMessages, setChatMessages] = useState<ChatTurn[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setWatchMap(getWatchMap()); }, []);

  const progress = watchMap[episodeId]?.watchedPct ?? 0;
  const completed = watchMap[episodeId]?.completed ?? false;
  const progressPct = Math.round(progress * 100);

  function updateProgress(pct: number, done?: boolean) {
    setWatchMap(prev => {
      const next = { ...prev, [episodeId]: { watchedPct: done ? 1 : pct, completed: done ?? (pct >= 1), updatedAt: Date.now() } };
      saveWatchMap(next);
      return next;
    });
  }

  const onVideoTime = () => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    updateProgress(v.currentTime / v.duration);
  };

  const onVideoEnd = () => {
    updateProgress(1, true);
    setShowComplete(true);
  };

  useEffect(() => {
    setChatMessages([]);
    setChatCompleted(false);
    setShowComplete(false);
    setActiveTab(hasVideo ? "video" : "chat");
    if (!hasVideo) {
      setChatMessages([{ role: "assistant", content: `Olá! Eu sou o NEXUS. Vamos explorar "${resolved.title}" juntos?` }]);
    }
  }, [episodeId, hasVideo, resolved.title]);

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatSending) return;
    const history = [...chatMessages, { role: "user" as const, content: text }];
    setChatMessages(history);
    setChatInput("");
    setChatSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: "nexus", messages: history.map(m => ({ role: m.role, content: m.content })), stream: false }),
      });
      const data = await res.json();
      const reply = typeof data?.reply === "string" ? data.reply : "Vamos continuar. O que você quer explorar agora?";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch { setChatMessages(prev => [...prev, { role: "assistant", content: "Não consegui conectar agora. Tente novamente." }]); }
    finally { setChatSending(false); }
  }

  function finishChat() {
    updateProgress(1, true);
    setChatCompleted(true);
    setShowComplete(true);
  }

  function goToEpisode(id: string) {
    router.push(`/player?episode=${encodeURIComponent(id)}`);
  }

  const xpReward = resolved.xpReward || 0;
  const completedCount = episodes.filter(e => watchMap[e.id]?.completed).length;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-gray-400 hover:text-white transition">
            <ChevronLeft size={20} />
          </Link>
          <Link href="/" className="text-lg font-bold">
            <span className="text-white">MENTE</span><span className="text-red-500">.AI</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> {completedCount}/{episodes.length}</span>
          <span className="flex items-center gap-1"><Zap size={14} style={{ color: "#00D9FF" }} /> {xpReward} XP</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Episode Header */}
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-shrink-0 w-28 h-28 rounded-md overflow-hidden bg-[#1A1A1A]">
            <Image src={getAgentImage(agentId)} alt={agentId} width={112} height={112} className="object-cover"
              style={{ width: '112px', height: '112px' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }} unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
              <span>{resolvedSeason?.title || "Série"}</span>
              <span>•</span>
              <span>{episodeId}</span>
              {completed && <span className="text-green-400 font-semibold">✓ Concluído</span>}
            </div>
            <h1 className="text-2xl font-bold text-white">{resolved.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{resolved.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>{resolved.durationMinutes} min</span>
              <span>{xpReward} XP</span>
              <span className="uppercase">{resolved.type}</span>
            </div>
            {progressPct > 0 && !completed && (
              <div className="mt-3 h-1 w-full max-w-xs bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: "#00D9FF" }} />
              </div>
            )}
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          {hasVideo && (
            <button onClick={() => setActiveTab("video")}
              className={`pb-3 text-sm font-semibold transition border-b-2 ${activeTab === "video" ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
              Assistir
            </button>
          )}
          <button onClick={() => setActiveTab("chat")}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${activeTab === "chat" ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
            Conversar com NEXUS
          </button>
        </div>

        {/* Video Player */}
        {activeTab === "video" && hasVideo && (
          <div className="rounded-lg overflow-hidden bg-black mb-6">
            <video ref={videoRef} className="w-full aspect-video" controls playsInline preload="auto"
              onTimeUpdate={onVideoTime} onEnded={onVideoEnd}>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        )}

        {/* Chat Interface */}
        {activeTab === "chat" && (
          <div className="rounded-lg overflow-hidden border border-white/10 mb-6" style={{ background: "#0a0a1a" }}>
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${m.role === "user" ? "bg-blue-500/20 text-blue-50" : "bg-white/10 text-white"}`}>
                    <div className="flex items-start gap-2">
                      {m.role === "assistant" && <AudioButton text={m.content} />}
                      <span>{m.content}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  placeholder="Digite sua mensagem..." disabled={chatCompleted}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none" />
                <button onClick={sendChat} disabled={chatSending || !chatInput.trim() || chatCompleted}
                  className="px-5 py-3 rounded-lg text-sm font-bold transition"
                  style={{ background: chatCompleted ? "rgba(0,217,255,0.1)" : "rgba(0,217,255,0.2)", color: "#00D9FF", border: "1px solid rgba(0,217,255,0.3)" }}>
                  {chatSending ? "..." : "Enviar"}
                </button>
                {!chatCompleted && chatMessages.length > 1 && (
                  <button onClick={finishChat} className="px-4 py-3 rounded-lg text-sm font-bold text-green-400 border border-green-400/30 bg-green-500/10">
                    Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Completion Overlay */}
        {showComplete && (
          <div className="rounded-lg border border-green-400/30 p-6 text-center mb-6" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), transparent)" }}>
            <Check size={40} className="text-green-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Episódio Concluído!</h2>
            <p className="text-gray-400 mb-4">+{xpReward} XP ganhos</p>
            <div className="flex gap-3 justify-center">
              {nextEpisode ? (
                <button onClick={() => goToEpisode(nextEpisode.id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm bg-white text-black hover:bg-white/90 transition">
                  Próximo Episódio <ChevronRight size={18} />
                </button>
              ) : null}
              <Link href="/aulas" className="px-6 py-3 rounded-lg font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition">
                Voltar às aulas
              </Link>
            </div>
          </div>
        )}

        {/* Episode Navigation */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
          {prevEpisode ? (
            <button onClick={() => goToEpisode(prevEpisode.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
              <ChevronLeft size={18} /> Anterior
            </button>
          ) : <div />}
          <div className="flex gap-2">
            {episodes.slice(0, 10).map((ep, i) => {
              const isCurrent = ep.id === episodeId;
              const isDone = watchMap[ep.id]?.completed;
              return (
                <button key={ep.id} onClick={() => goToEpisode(ep.id)}
                  className={`w-8 h-8 rounded text-xs font-bold transition ${isCurrent ? "bg-white text-black" : isDone ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          {nextEpisode ? (
            <button onClick={() => goToEpisode(nextEpisode.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
              Próximo <ChevronRight size={18} />
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (<Suspense fallback={<div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">Carregando...</div>}><PlayerContent /></Suspense>);
}