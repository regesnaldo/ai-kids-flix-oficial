"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { PostCard, PostCardHero } from "@/components/blog/PostCard";

interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  openingScene: string | null;
  category: string;
  agentId: string | null;
  xpReward: number;
  ageRating: string;
  publishedAt: string;
}

const CATEGORIES = ["Tudo", "IA Geral", "Negócios", "Crianças", "Ética", "Futuro", "Ferramentas"] as const;

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tudo");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/blog/generate");
        const data = await res.json();
        if (Array.isArray(data)) setPosts(data);
      } catch (error) { console.error('[MENTE.AI] Error in blog/page.tsx:', error); /* TODO: [MENTE.AI] adicionar feedback visual ao usuário */ } finally { setLoading(false); }
    })();
  }, []);

  const filtered = activeFilter === "Tudo"
    ? posts
    : posts.filter((p) => p.category === activeFilter);

  const heroPost = filtered[0];
  const gridPosts = filtered.slice(1);

  return (
    <main className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.04]" style={{ background: "var(--accent-cyan)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03]" style={{ background: "var(--accent-cyan)" }} />
      </div>

      {/* Header */}
      <header className="relative px-6 md:px-12 pt-28 pb-8 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent-cyan)" }}>
            MENTE.AI — INTELIGÊNCIA EM MOVIMENTO
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Blog
          </h1>
          <p className="text-white/50 mt-3 max-w-xl text-base leading-relaxed">
            Curadoria diária de IA pelos agentes do MENTE.AI. Notícias, análises e reflexões geradas pelos modelos Groq.
          </p>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-8">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "border text-[var(--accent-cyan)]"
                    : "border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                }`}
                style={isActive ? {
                  background: "rgba(0,245,255,0.08)",
                  borderColor: "var(--accent-cyan)",
                } : {
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-xl shimmer" style={{ background: "var(--dark-card)" }} />
            ))}
          </div>
        )}

        {/* Hero post */}
        {!loading && heroPost && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <PostCardHero {...heroPost} summary={heroPost.summary || ""} />
          </motion.div>
        )}

        {/* Grid */}
        {!loading && gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PostCard {...post} summary={post.summary || ""} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" style={{ color: "var(--accent-cyan)" }} />
            <p className="text-white/30">Nenhum post nesta categoria ainda.</p>
            <p className="text-white/15 text-sm mt-1">Volte amanhã — um novo post é gerado todo dia às 8h.</p>
          </div>
        )}

        {/* Manifesto link */}
        <div className="mt-20 pt-8 border-t border-white/[0.04] text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/15 block mb-2">
            O QUE ACREDITAMOS
          </span>
          <Link
            href="/blog/manifesto"
            className="text-sm tracking-wide transition-colors duration-300"
            style={{ color: "var(--accent-cyan)" }}
          >
            Leia o manifesto →
          </Link>
        </div>
      </div>
    </main>
  );
}
