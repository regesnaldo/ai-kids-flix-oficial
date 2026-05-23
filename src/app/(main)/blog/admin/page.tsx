"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react";
import { queueConquest } from "@/components/gamification/ConquestNotification";

export default function BlogAdminPage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePost = async () => {
    setGenerating(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/blog/generate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResult(`Post gerado: "${data.title}" → /blog/${data.slug}`);
        queueConquest({ id: `blog_gen_${Date.now()}`, xp: 0, message: "Novo post gerado!" });
      } else {
        setError(data.error || "Erro ao gerar");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-8" style={{ background: "var(--cyber-black)" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Blog Admin</h1>
        <p className="text-gray-500 text-sm mb-8">Gerencie a geração automática de posts do blog.</p>

        <div className="p-6 rounded-xl border border-white/5 mb-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <Sparkles size={18} style={{ color: "var(--neon-cyan)" }} />
            Gerar Post do Dia
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Dispara a DeepSeek para gerar um novo post cinematográfico sobre IA em português brasileiro.
            O post é automaticamente publicado no blog.
          </p>
          <button
            onClick={generatePost}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition disabled:opacity-50"
            style={{ background: "var(--neon-cyan)", color: "#050510" }}
          >
            {generating ? (
              <><RefreshCw size={16} className="animate-spin" /> Gerando...</>
            ) : (
              <><Sparkles size={16} /> Gerar Agora</>
            )}
          </button>

          {result && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-green-400">
              ✅ {result}
            </motion.p>
          )}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </motion.p>
          )}
        </div>

        <div className="p-4 rounded-lg border border-white/05" style={{ background: "rgba(255,255,255,0.01)" }}>
          <p className="text-gray-600 text-xs">
            ⏰ O Vercel Cron Job executa <code className="text-gray-500">/api/blog/generate</code> todo dia às 8h (UTC-3).
            Configure a variável <code className="text-gray-500">CRON_SECRET</code> no Vercel.
          </p>
        </div>
      </div>
    </main>
  );
}
