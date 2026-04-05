"use client";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Check, ChevronDown, FlaskConical, Gamepad2, Lock, Play, Settings, Star, Target, X } from "lucide-react";
import { getEpisodeById, getSeasonById } from "@/constants/catalog";

interface InteractiveQuestion { question: string; options: string[]; }

type WatchState = {
  watchedPct: number;
  completed: boolean;
  updatedAt: number;
};

const WATCH_STORAGE_KEY = "mente_ai_watch_progress_v1";
const VISIT_STORAGE_KEY = "mente_ai_last_visit_v1";

function AudioButton({ text }: { text: string }) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleClick() {
    if (loading) return;
    if (playing && audioRef.current) { audioRef.current.pause(); setPlaying(false); return; }
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); setPlaying(true); return; }
    setLoading(true);
    const audio = document.createElement("audio");
    audio.src = "/api/tts?text=" + encodeURIComponent(text);
    audio.addEventListener("canplaythrough", function h() { audio.removeEventListener("canplaythrough", h); setLoading(false); setPlaying(true); audio.play(); });
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("error", () => { setLoading(false); setPlaying(false); });
    audioRef.current = audio;
    audio.load();
  }

  return (
    <button onClick={handleClick} title="Ouvir pergunta" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(59,130,246,0.3)", background: playing ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.05)", color: loading ? "#555" : playing ? "#3B82F6" : "#888", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
      {loading ? "..." : playing ? "||" : "\u25B6"}
    </button>
  );
}

function PlayerContent() {
  const searchParams = useSearchParams();
  const rawSeriesTitle = searchParams.get("series") || "MENTE.AI";
  const rawEpisodeParam = searchParams.get("episode") || "Episodio 1";
  const episodeId = useMemo(() => {
    const trimmed = rawEpisodeParam.trim();
    if (/^S\d{2}E\d{2}$/i.test(trimmed)) return trimmed.toUpperCase();
    return null;
  }, [rawEpisodeParam]);

  const episodeFromCatalog = useMemo(() => {
    if (!episodeId) return null;
    return getEpisodeById(episodeId) ?? null;
  }, [episodeId]);

  const seasonFromCatalog = useMemo(() => {
    if (!episodeId) return null;
    const seasonId = episodeId.slice(0, 3);
    return getSeasonById(seasonId) ?? null;
  }, [episodeId]);

  const seriesTitle = seasonFromCatalog?.title ?? rawSeriesTitle;
  const episodeTitle = episodeFromCatalog?.title ?? rawEpisodeParam;
  const episodeDescription = episodeFromCatalog?.description ?? "";

  const [questions, setQuestions] = useState<InteractiveQuestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [syncPulse, setSyncPulse] = useState(false);
  const [resumeOverlay, setResumeOverlay] = useState(false);
  const [watchMap, setWatchMap] = useState<Record<string, WatchState>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const quizArmedRef = useRef(true);
  const quizTriggerAtRef = useRef<number | null>(null);
  const [missionOpen, setMissionOpen] = useState(false);
  const [commanderPulse, setCommanderPulse] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [introBlack, setIntroBlack] = useState(true);
  const [introIn, setIntroIn] = useState(false);

  async function generateQuestions() {
    setLoading(true); setSelected(null);
    try {
      const res = await fetch("/api/interaction", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seriesTitle, episodeTitle, ageGroup: "adult", seed: Math.random() }) });
      const data = await res.json();
      if (Array.isArray(data.content)) setQuestions(data.content);
      else if (data.question) setQuestions([data]);
    } catch { console.error("Erro ao gerar perguntas"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    try {
      const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, WatchState>;
      if (parsed && typeof parsed === "object") setWatchMap(parsed);
    } catch (_e) {
      void _e;
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    try {
      const raw = globalThis.localStorage?.getItem(VISIT_STORAGE_KEY);
      const last = raw ? Number(raw) : NaN;
      if (Number.isFinite(last) && now - last >= 24 * 60 * 60 * 1000) {
        setCommanderPulse(true);
        globalThis.setTimeout(() => setCommanderPulse(false), 1500);
      }
      globalThis.localStorage?.setItem(VISIT_STORAGE_KEY, String(now));
    } catch (_e) {
      void _e;
    }
  }, []);

  useEffect(() => {
    setIntroBlack(true);
    setIntroIn(false);
    const t1 = globalThis.setTimeout(() => setIntroBlack(false), 500);
    const t2 = globalThis.setTimeout(() => setIntroIn(true), 900);
    return () => {
      globalThis.clearTimeout(t1);
      globalThis.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (!missionOpen) return;
    if (questions.length > 0) return;
    generateQuestions();
  }, [missionOpen]);

  const updateEpisodeProgress = (id: string, patch: Partial<WatchState>) => {
    setWatchMap((prevMap) => {
      const prev = prevMap[id] ?? { watchedPct: 0, completed: false, updatedAt: Date.now() };
      const merged: WatchState = {
        watchedPct: patch.watchedPct ?? prev.watchedPct,
        completed: patch.completed ?? prev.completed,
        updatedAt: Date.now(),
      };
      const next = { ...prevMap, [id]: merged };
      try {
        globalThis.localStorage?.setItem(WATCH_STORAGE_KEY, JSON.stringify(next));
      } catch (_e) {
        void _e;
      }
      return next;
    });
  };

  const onVideoLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    quizTriggerAtRef.current = Math.max(2, v.duration * 0.5);
    quizArmedRef.current = true;
  };

  const onVideoTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !episodeId || !Number.isFinite(v.duration) || v.duration <= 0) return;

    const pct = Math.max(0, Math.min(1, v.currentTime / v.duration));
    updateEpisodeProgress(episodeId, { watchedPct: pct });

    const triggerAt = quizTriggerAtRef.current;
    if (quizOpen) return;
    if (!quizArmedRef.current) return;
    if (triggerAt == null) return;
    if (v.currentTime < triggerAt) return;

    quizArmedRef.current = false;
    v.pause();
    setQuizOpen(true);
  };

  const onVideoEnded = () => {
    if (!episodeId) return;
    updateEpisodeProgress(episodeId, { watchedPct: 1, completed: true });
  };

  const applySyncReward = () => {
    setSyncPulse(true);
    globalThis.setTimeout(() => setSyncPulse(false), 1500);

    setResumeOverlay(true);
    requestAnimationFrame(() => setResumeOverlay(false));

    const v = videoRef.current;
    if (v) void v.play();
  };

  const confirmQuiz = () => {
    if (!selected) return;
    setQuizOpen(false);
    applySyncReward();
  };

  const currentQuestion = questions[0] ?? null;
  const seasonEpisodes = seasonFromCatalog?.episodes ?? [];
  const agentLabel = episodeFromCatalog?.agentId ?? "NEXUS";
  const portalProgressPct = episodeId ? Math.round(((watchMap[episodeId]?.watchedPct ?? 0) * 100)) : 0;

  const xpEarned = useMemo(() => {
    if (seasonEpisodes.length === 0) return 0;
    let total = 0;
    for (const ep of seasonEpisodes) {
      if (watchMap[ep.id]?.completed) total += ep.xpReward;
    }
    return total;
  }, [seasonEpisodes, watchMap]);

  const modulesCompleted = useMemo(() => {
    let c = 0;
    for (const ep of seasonEpisodes) {
      if (watchMap[ep.id]?.completed) c += 1;
    }
    return c;
  }, [seasonEpisodes, watchMap]);

  const rewardEveryModules = 3;
  const nextRewardIn = rewardEveryModules - (modulesCompleted % rewardEveryModules || rewardEveryModules);
  const rewardProgress = (modulesCompleted % rewardEveryModules) / rewardEveryModules;

  const timelineNodes = useMemo(() => {
    const sid = seasonFromCatalog?.id?.slice(1) ?? "01";
    const nodes = [];
    for (let i = 1; i <= 6; i += 1) {
      const eid = `S${sid}E${String(i).padStart(2, "0")}`;
      const st = watchMap[eid];
      nodes.push({
        id: eid,
        label: `S${String(i).padStart(2, "0")}`,
        completed: Boolean(st?.completed),
        active: episodeId === eid,
      });
    }
    return nodes;
  }, [seasonFromCatalog?.id, watchMap, episodeId]);

  const openMission = () => {
    setRewardsOpen(false);
    setSelected(null);
    setQuizOpen(false);
    setMissionOpen(true);

    const v = videoRef.current;
    if (v && episodeId) {
      const pct = watchMap[episodeId]?.watchedPct ?? 0;
      if (Number.isFinite(v.duration) && v.duration > 0) {
        v.currentTime = v.duration * pct;
      }
      void v.play();
    }
  };

  const closeMission = () => {
    setMissionOpen(false);
    setQuizOpen(false);
    setSelected(null);
    const v = videoRef.current;
    if (v) v.pause();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <style jsx global>{`
        @keyframes drift {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-2%, 1.5%, 0); }
          100% { transform: translate3d(0,0,0); }
        }
        @keyframes portalPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(0,217,255,0.18), 0 0 24px rgba(0,217,255,0.08); }
          50% { box-shadow: 0 0 0 1px rgba(0,217,255,0.30), 0 0 34px rgba(0,217,255,0.12); }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: introIn ? 0.08 : 0,
          transition: "opacity 1s ease",
          animation: "drift 120s linear infinite",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 1px, transparent 2px), " +
            "radial-gradient(circle at 70% 60%, rgba(0,217,255,0.45) 0, rgba(0,217,255,0.45) 1px, transparent 2px), " +
            "radial-gradient(circle at 40% 80%, rgba(139,92,246,0.35) 0, rgba(139,92,246,0.35) 1px, transparent 2px)",
          backgroundSize: "220px 220px, 260px 260px, 300px 300px",
        }}
      />

      <div
        className="fixed inset-0 bg-black z-[100]"
        style={{
          opacity: introBlack ? 1 : 0,
          pointerEvents: introBlack ? "auto" : "none",
          transition: "opacity 500ms ease",
        }}
      />

      <div
        className="fixed left-0 top-0 bottom-0 z-40"
        style={{
          width: introIn ? 60 : 0,
          transform: introIn ? "translateX(0)" : "translateX(-20px)",
          transition: "transform 700ms ease, width 700ms ease",
        }}
      >
        <div
          className="h-full bg-zinc-950/70 backdrop-blur-md border-r border-white/10"
          style={{ width: 60 }}
        >
          <div className="h-full flex flex-col items-center gap-2 py-4">
            <button
              type="button"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              aria-label="Menu"
            >
              <span className="text-xl leading-none">≡</span>
            </button>

            <div className="h-4" />

            <a
              href={episodeId ? `/player?episode=${encodeURIComponent(episodeId)}` : "/player"}
              className="w-10 h-10 rounded-xl border border-cyan-400/25 bg-cyan-500/10 flex items-center justify-center"
              aria-label="Missão Atual"
            >
              <Target className="w-5 h-5 text-cyan-200" />
            </a>

            <a
              href="/explorar"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              aria-label="Biblioteca"
            >
              <BookOpen className="w-5 h-5 text-zinc-200" />
            </a>

            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center opacity-50">
                <FlaskConical className="w-5 h-5 text-zinc-300" />
              </div>
              <Lock className="absolute -right-1 -bottom-1 w-4 h-4 text-zinc-500" />
            </div>

            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center opacity-50">
                <Gamepad2 className="w-5 h-5 text-zinc-300" />
              </div>
              <Lock className="absolute -right-1 -bottom-1 w-4 h-4 text-zinc-500" />
            </div>

            <div className="mt-auto" />

            <a
              href="/conta"
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5 text-zinc-200" />
            </a>
          </div>
        </div>
      </div>

      <div
        className="fixed top-5 right-5 z-50"
        style={{
          opacity: introIn ? 1 : 0,
          transform: introIn ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 700ms ease, transform 700ms ease",
        }}
      >
        <div className="w-[240px] rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[11px] font-extrabold tracking-widest text-zinc-200">COMMANDER</p>
          </div>
          <div className="px-4 py-4 space-y-3">
            <div className={`flex items-center justify-between ${commanderPulse ? "animate-pulse" : ""}`}>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-cyan-200" />
                <p className="text-sm font-extrabold text-white">{xpEarned.toLocaleString("pt-BR")}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-100">
                RANK
              </span>
            </div>

            <div>
              <div className="h-[6px] w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${Math.round(rewardProgress * 100)}%`, background: "#00D9FF" }} />
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">
                {nextRewardIn} módulo{nextRewardIn === 1 ? "" : "s"} até recompensa
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRewardsOpen((v) => !v)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-200 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <span>Ver Recompensas</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${rewardsOpen ? "rotate-180" : ""}`} />
            </button>

            {rewardsOpen ? (
              <div className="space-y-2">
                {[
                  { title: "Avatar exclusivo", hint: "Recompensa visual premium" },
                  { title: "Tema Dark Premium", hint: "Interface aprimorada" },
                  { title: "Badge Commander", hint: "Selo de progresso" },
                ].map((r) => (
                  <div key={r.title} className="px-3 py-2 rounded-xl border border-white/10 bg-black/20">
                    <p className="text-xs font-semibold text-white">{r.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{r.hint}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div
            className="w-[280px] h-[320px] rounded-3xl border bg-zinc-950/40 backdrop-blur-md flex flex-col items-center justify-center text-center"
            style={{
              borderColor: "rgba(0,217,255,0.22)",
              backgroundImage:
                "linear-gradient(135deg, rgba(0,217,255,0.10), rgba(139,92,246,0.07), rgba(0,0,0,0.35))",
              animation: introIn && episodeId ? "portalPulse 4s ease-in-out infinite" : undefined,
              transform: introIn ? "scale(1)" : "scale(0.9)",
              filter: introIn ? "blur(0)" : "blur(10px)",
              opacity: introIn ? 1 : 0,
              transition: "transform 900ms ease, filter 900ms ease, opacity 900ms ease",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-zinc-200 mb-5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-300" />
              <span>{agentLabel}</span>
            </div>

            <button
              type="button"
              onClick={openMission}
              className="w-[210px] px-4 py-4 rounded-2xl border border-white/10 bg-black/35 hover:bg-black/45 transition text-white"
              style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.45)" }}
            >
              <div className="text-sm font-extrabold leading-tight">Continuar</div>
              <div className="text-sm font-extrabold leading-tight">Missão:</div>
              <div className="text-sm font-extrabold leading-tight">{episodeId ?? "S01E01"}</div>

              <div className="mt-4 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${portalProgressPct}%`, background: "#00D9FF" }} />
              </div>

              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-zinc-300 font-semibold">
                <span>{portalProgressPct}%</span>
                <Play className="w-3.5 h-3.5 text-cyan-200" />
              </div>
            </button>
          </div>

          <div
            className="mt-10 w-full max-w-[680px]"
            style={{
              opacity: introIn ? 1 : 0,
              transform: introIn ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 900ms ease, transform 900ms ease",
            }}
          >
            <div className="h-[60px] flex flex-col justify-center">
              <div className="h-[2px] w-full bg-white/10 rounded-full relative">
                <div className="absolute left-0 top-0 bottom-0 bg-cyan-400/30 rounded-full" style={{ width: `${Math.min(100, portalProgressPct)}%` }} />
              </div>

              <div className="mt-3 flex items-center justify-between">
                {timelineNodes.map((n) => (
                  <div key={n.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full border ${
                        n.completed
                          ? "bg-[#00D9FF] border-[#00D9FF]"
                          : n.active
                            ? "bg-cyan-300/20 border-cyan-300 animate-pulse"
                            : "bg-[#2A2A3A] border-white/10"
                      }`}
                    />
                    <div className="text-[10px] font-bold tracking-widest text-zinc-400">
                      {n.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {missionOpen ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeMission} />
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              onClick={closeMission}
              className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/75 transition flex items-center justify-center"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div
              className={`relative w-full rounded-2xl overflow-hidden bg-black border transition ${
                syncPulse ? "animate-pulse border-cyan-400/50" : "border-white/10"
              }`}
              style={{
                boxShadow: syncPulse ? "0 0 0 1px rgba(34,211,238,0.15), 0 0 42px rgba(0,240,255,0.12)" : "none",
              }}
            >
              <div className="relative w-full aspect-video">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  playsInline
                  preload="auto"
                  onLoadedMetadata={onVideoLoadedMetadata}
                  onTimeUpdate={onVideoTimeUpdate}
                  onEnded={onVideoEnded}
                  style={{ filter: "contrast(1.05) brightness(0.9) saturate(1.15)" }}
                >
                  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                </video>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div
                  className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-700"
                  style={{ opacity: resumeOverlay ? 1 : 0 }}
                />

                {quizOpen && currentQuestion ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-full max-w-xl rounded-2xl border border-cyan-400/20 bg-zinc-950/80 backdrop-blur-md p-6 shadow-2xl">
                      <div className="flex items-start gap-3">
                        <AudioButton text={currentQuestion.question} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-cyan-200/90 font-bold tracking-widest uppercase">Sincronia Neural</p>
                          <p className="text-base font-semibold text-white mt-2 leading-relaxed">{currentQuestion.question}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {currentQuestion.options.map((opt) => {
                          const active = selected === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setSelected(opt)}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                                active ? "border-cyan-400/45 bg-cyan-500/10" : "border-white/10 bg-white/5 hover:border-cyan-400/25"
                              }`}
                            >
                              <span className="text-sm text-white">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setQuizOpen(false);
                            const v = videoRef.current;
                            if (v) void v.play();
                          }}
                          className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition"
                        >
                          Pular
                        </button>
                        <button
                          type="button"
                          onClick={confirmQuiz}
                          disabled={!selected}
                          className="px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/25 disabled:opacity-40 disabled:hover:bg-cyan-500/20 text-cyan-100 font-bold transition border border-cyan-400/25"
                        >
                          Confirmar
                        </button>
                      </div>

                      {loading ? <p className="mt-4 text-xs text-zinc-400">Gerando perguntas...</p> : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold tracking-widest text-cyan-200/90 uppercase">
                  {seriesTitle}
                </p>
                <p className="text-base font-extrabold text-white mt-1">
                  {episodeTitle}
                </p>
                {episodeDescription ? <p className="text-sm text-zinc-400 mt-1">{episodeDescription}</p> : null}
              </div>
              <div className="text-right">
                <p className="text-[11px] text-zinc-400 font-bold tracking-widest uppercase">Progresso</p>
                <p className="text-sm font-extrabold text-white">{portalProgressPct}%</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PlayerPage() {
  return (<Suspense fallback={<div style={{ color: "white", padding: "2rem" }}>Carregando...</div>}><PlayerContent /></Suspense>);
}
