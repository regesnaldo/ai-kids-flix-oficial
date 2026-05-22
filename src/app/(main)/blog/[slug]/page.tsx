"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Sparkles } from "lucide-react";
import { AgentCommentary } from "@/components/blog/AgentCommentary";
import { InteractivePostSection } from "@/components/blog/InteractivePost";
import { WhatsAppShare } from "@/components/blog/WhatsAppShare";
import { ParentalGate } from "@/components/blog/ParentalGate";
import { queueConquest } from "@/components/gamification/ConquestNotification";

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
    }, 8000); // award after 8 seconds
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

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--cyber-black)" }}><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--neon-cyan)", borderTopColor: "transparent" }} /></main>;
  }

  if (error || !post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--cyber-black)" }}>
        <p className="text-gray-400 text-lg mb-4">{error || "Post não encontrado"}</p>
        <Link href="/blog" className="text-sm underline" style={{ color: "var(--neon-cyan)" }}>← Voltar ao Blog</Link>
      </main>
    );
  }

  if (!gateUnlocked && post.ageRating !== "all") {
    return <ParentalGate ageRating={post.ageRating} onUnlock={() => setGateUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--cyber-black)" }}>
      {/* Breadcrumb */}
      <nav className="px-6 md:px-12 pt-24 pb-4">
        <Link href="/blog" className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Blog
        </Link>
      </nav>

      <article ref={contentRef} className="max-w-3xl mx-auto px-6 md:px-12 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "var(--neon-cyan)15", color: "var(--neon-cyan)" }}>
              {post.category}
            </span>
            <span className="text-[10px] text-gray-600">{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--neon-cyan)" }}><Zap size={10} /> +{post.xpReward} XP</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {post.title}
          </h1>
        </div>

        {/* Opening scene */}
        {post.openingScene && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-5 rounded-xl border border-white/05" style={{ background: "rgba(0,240,255,0.03)" }}>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Cena de Abertura</p>
            <p className="text-white/80 text-base leading-relaxed italic">
              {displayedOpening}
              {displayedOpening.length < (post.openingScene?.length || 0) && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block ml-1" style={{ color: "var(--neon-cyan)" }}>▌</motion.span>
              )}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-white/80 text-base leading-relaxed mb-4">{para}</p>
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

        {/* XP earned */}
        {xpAwarded && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <Sparkles size={32} className="mx-auto mb-3" style={{ color: "var(--neon-cyan)" }} />
            <p className="text-white font-bold text-lg">+{post.xpReward + (choiceIdx !== null ? 3 : 0)} XP</p>
            <p className="text-gray-500 text-sm">Obrigado por ler até o fim!</p>
          </motion.div>
        )}

        {/* WhatsApp share */}
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/5">
          <WhatsAppShare slug={post.slug} title={post.title} />
          <span className="text-gray-600 text-sm">•</span>
          <Link href="/blog" className="text-sm text-gray-500 hover:text-white transition">← Blog</Link>
        </div>
      </article>
    </main>
  );
}
