"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Sparkles, Clock } from "lucide-react";
import { AgentCommentary } from "@/components/blog/AgentCommentary";
import { InteractivePostSection } from "@/components/blog/InteractivePost";
import { WhatsAppShare } from "@/components/blog/WhatsAppShare";
import { ParentalGate } from "@/components/blog/ParentalGate";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { queueConquest } from "@/components/gamification/ConquestNotification";
import { allAgents } from "@/data/agents";

interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  openingScene: string | null;
  category: string;
  agentId: string | null;
  agentCommentary: string | null;
  interactivePause: {
    pergunta: string;
    opcoes: [string, string, string];
    continuacoes: [string, string, string];
  } | null;
  ageRating: string;
  xpReward: number;
  publishedAt: string;
}

function useTypewriter(text: string, speed = 25) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed(""); setDone(false); idx.current = 0;
    const tick = () => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
        timer.current = setTimeout(tick, speed);
      } else { setDone(true); }
    };
    tick();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [text, speed]);

  return { displayed, done };
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [choiceIdx, setChoiceIdx] = useState<number | null>(null);
  const [xpAwarded, setXpAwarded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/blog/generate?slug=${slug}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((p: Post) => p.slug === slug);
          if (found) { setPost(found); } else { setError("Post não encontrado"); }
        } else { setError("Erro ao carregar"); }
      } catch { setError("Erro ao carregar"); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  // Award XP on read completion
  useEffect(() => {
    if (!post || xpAwarded) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/blog/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id, completed: true }),
        });
        const data = await res.json();
        if (data.xpAwarded > 0) {
          setXpAwarded(true);
          queueConquest({ id: `blog_${post.slug}`, xp: data.xpAwarded, message: "Post lido!" });
        }
      } catch {}
    }, 8000);
    return () => clearTimeout(timer);
  }, [post, xpAwarded]);

  const handleChoice = async (idx: number) => {
    setChoiceIdx(idx);
    if (post) {
      try {
        await fetch("/api/blog/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id, choiceMade: ["A", "B", "C"][idx] }),
        });
      } catch {}
    }
  };

  const { displayed: displayedOpening } = useTypewriter(post?.openingScene || "", 20);
  const readingTime = post ? Math.max(1, Math.ceil((post.content?.length || 3000) / 1000)) : 5;
  const agent = post?.agentId ? allAgents.find(a => a.id === post.agentId) : null;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--dark-bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--accent-cyan)", borderTopColor: "transparent" }} />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--dark-bg)" }}>
        <p className="text-white/40 text-lg">{error || "Post não encontrado"}</p>
        <Link href="/blog" className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--accent-cyan)" }}>
          ← Voltar ao Blog
        </Link>
      </main>
    );
  }

  if (!gateUnlocked && post.ageRating !== "all") {
    return <ParentalGate ageRating={post.ageRating} onUnlock={() => setGateUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen pb-32" style={{ background: "var(--dark-bg)" }}>
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03]" style={{ background: "var(--accent-cyan)" }} />
      </div>

      {/* Breadcrumb */}
      <nav className="relative px-6 md:px-12 pt-28 pb-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--accent-cyan)" }}
          >
            <ArrowLeft size={16} /> Blog
          </Link>
          <span className="mx-2 text-white/15">/</span>
          <span className="text-sm text-white/25">{post.category}</span>
          <span className="mx-2 text-white/15">/</span>
          <span className="text-sm text-white/40 truncate">{post.title}</span>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 flex gap-10">
        <article ref={contentRef} className="flex-1 min-w-0">
        {/* Header */}
        <header className="mb-10">
          {/* Category tag */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
              style={{ background: "rgba(0,245,255,0.08)", color: "var(--accent-cyan)" }}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/25">
              <Clock size={12} /> {readingTime} min
            </span>
            <span className="text-xs text-white/20">{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--accent-cyan)" }}>
              <Zap size={11} /> +{post.xpReward} XP
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>

          {/* Agent badge */}
          {agent && (
            <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: agent.color }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: `${agent.color}20` }}
              >
                {agent.name.charAt(0)}
              </div>
              <span className="opacity-80 font-medium">{agent.name} — O Conector</span>
            </div>
          )}
        </header>

        {/* Opening scene */}
        {post.openingScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10 p-5 md:p-6 rounded-xl border"
            style={{
              background: "var(--dark-card)",
              borderColor: "rgba(255,255,255,0.05)",
              boxShadow: "0 2px 12px rgba(0,245,255,0.02)",
            }}
          >
            <p className="text-white/20 text-xs uppercase tracking-widest mb-3 font-bold">Cena de Abertura</p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed italic">
              {displayedOpening}
              {displayedOpening.length < (post.openingScene?.length || 0) && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block ml-1"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  ▌
                </motion.span>
              )}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <div className="mb-12">
          {post.content.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-white/65 text-base md:text-lg leading-[1.85] mb-5"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Agent commentary */}
        {post.agentId && post.agentCommentary && (
          <AgentCommentary agentId={post.agentId} commentary={post.agentCommentary} />
        )}

        {/* Interactive pause */}
        {post.interactivePause && (
          <InteractivePostSection pause={post.interactivePause} onChoice={handleChoice} />
        )}

        {/* XP earned toast */}
        {xpAwarded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 my-8 rounded-xl border"
            style={{
              background: "var(--dark-card)",
              borderColor: "rgba(0,245,255,0.1)",
              boxShadow: "0 4px 24px rgba(0,245,255,0.04)",
            }}
          >
            <Sparkles size={28} className="mx-auto mb-3" style={{ color: "var(--accent-cyan)" }} />
            <p className="text-white font-bold text-xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
              +{post.xpReward + (choiceIdx !== null ? 3 : 0)} XP
            </p>
            <p className="text-white/30 text-sm">Obrigado por ler até o fim!</p>
          </motion.div>
        )}

        {/* Footer — WhatsApp + navigation */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col items-center gap-4">
          <div className="w-full max-w-md">
            <WhatsAppShare slug={post.slug} title={post.title} />
          </div>
          <Link
            href="/blog"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--accent-cyan)" }}
          >
            ← Voltar ao Blog
          </Link>
        </div>
      </article>

      {/* Sticky TOC sidebar — desktop only */}
      {post.content && (
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <TableOfContents content={post.content} />
        </aside>
      )}
      </div>
    </main>
  );
}
