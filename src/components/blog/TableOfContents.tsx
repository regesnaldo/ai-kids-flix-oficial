'use client';

import { useEffect, useState, useMemo } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(content: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Match markdown headings (## Title or ### Title)
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      items.push({ id, text, level });
    }
  }
  
  return items;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    const elements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4" aria-label="Table of contents">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent-cyan)' }}>
        Neste post
      </p>
      <ul className="space-y-1.5 border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className="block transition-all duration-200 text-sm hover:opacity-100"
                style={{
                  paddingLeft: h.level === 1 ? '12px' : h.level === 2 ? '20px' : '28px',
                  color: isActive ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)',
                  borderLeft: isActive ? `2px solid var(--accent-cyan)` : '2px solid transparent',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  marginLeft: '-1px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(h.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
