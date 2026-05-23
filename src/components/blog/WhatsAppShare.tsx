'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppShare({ slug, title }: { slug: string; title: string }) {
  const share = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `🤖 *${title}*\\n\\nLeia completo + ganhe XP:\\n${siteUrl}/blog/${slug}\\n\\n_via MENTE.AI_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button
      onClick={share}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: '#25D366',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(37, 211, 102, 0.15)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(37, 211, 102, 0.15)';
      }}
    >
      <MessageCircle size={16} />
      Compartilhar no WhatsApp
    </button>
  );
}
