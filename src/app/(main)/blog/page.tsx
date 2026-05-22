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

const CATEGORIES = ["Tudo", "IA Geral", "Negócios", "Crianças", "Ética", "Futuro", "Ferramentas"];

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
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = activeFilter === "Tudo"
    ? posts
    : posts.filter((p) => p.category === activeFilter);

  const heroPost = filtered[0];
  const gridPosts = filtered.slice(1);

  return (
    <main className="min-h-screen" style={{ background: "var(--cyber-black)" }}>
      {/* Header */}
      <header className="px-6 md:px-12 pt-24 pb-6 border-b border-white/5" style={{ background: 'linear-gradient(to bottom, rgba(0,240,255,0.03), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "var(--neon-cyan)" }}>
            // MENTE.AI — INTELIGÊNCIA EM MOVIMENTO
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Blog
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Curadoria diária de IA pelos agentes do MENTE.AI. Notícias, análises e reflexões geradas pela DeepSeek.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200"
              style={{
                background: activeFilter === cat ? "var(--neon-cyan)18" : "rgba(255,255,255,0.04)",
                color: activeFilter === cat ? "var(--neon-cyan)" : "rgba(255,255,255,0.6)",
                border: activeFilter === cat ? "1px solid var(--neon-cyan)30" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl shimmer" style={{ background: "#1a1a2e" }} />
            ))}
          </div>
        )}

        {/* Hero post */}
        {!loading && heroPost && (
          <div className="mb-8">
            <PostCardHero {...heroPost} summary={heroPost.summary || ""} />
          </div>
        )}

        {/* Grid */}
        {!loading && gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridPosts.map((post) => (
              <PostCard key={post.id} {...post} summary={post.summary || ""} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">Nenhum post nesta categoria ainda.</p>
            <p className="text-gray-600 text-sm mt-1">Volte amanhã — um novo post é gerado todo dia às 8h.</p>
          </div>
        )}

        {/* Manifesto link footer */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <Link href="/blog/manifesto" className="text-sm text-gray-500 hover:text-white transition underline underline-offset-4">
            // O QUE ACREDITAMOS
          </Link>
        </div>
      </div>
    </main>
  );
}
