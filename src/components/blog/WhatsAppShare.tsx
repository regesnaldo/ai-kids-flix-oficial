'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppShare({ slug, title }: { slug: string; title: string }) {
  const share = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `🤖 *${title}*\n\nLeia completo + ganhe XP:\n${siteUrl}/blog/${slug}\n\n_via MENTE.AI_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition"
      title="Compartilhar no WhatsApp"
    >
      <MessageCircle size={14} />
      WhatsApp
    </button>
  );
}
