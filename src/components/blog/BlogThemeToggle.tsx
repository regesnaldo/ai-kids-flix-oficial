'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Sun, Moon } from 'lucide-react';

type BlogTheme = 'dark' | 'light';

interface BlogThemeContextType {
  theme: BlogTheme;
  toggle: () => void;
}

const BlogThemeContext = createContext<BlogThemeContextType>({
  theme: 'dark',
  toggle: () => {},
});

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<BlogTheme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('blog-theme') as BlogTheme | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('blog-theme', theme);
    if (theme === 'light') {
      document.documentElement.style.setProperty('--blog-bg', '#f8f9fa');
      document.documentElement.style.setProperty('--blog-card', '#ffffff');
      document.documentElement.style.setProperty('--blog-text', '#0e1420');
      document.documentElement.style.setProperty('--blog-text-muted', '#64748b');
      document.documentElement.style.setProperty('--blog-accent', '#0099cc');
      document.documentElement.style.setProperty('--blog-border', '#e2e8f0');
      document.documentElement.style.setProperty('--blog-border-subtle', 'rgba(0,0,0,0.06)');
      document.documentElement.style.setProperty('--blog-shadow', '0 4px 20px rgba(0,0,0,0.04)');
      document.documentElement.style.setProperty('--blog-shadow-hover', '0 4px 30px rgba(0,153,204,0.08)');
    } else {
      document.documentElement.style.setProperty('--blog-bg', '#0e1420');
      document.documentElement.style.setProperty('--blog-card', '#161d2e');
      document.documentElement.style.setProperty('--blog-text', '#ffffff');
      document.documentElement.style.setProperty('--blog-text-muted', '#8892a4');
      document.documentElement.style.setProperty('--blog-accent', '#00f5ff');
      document.documentElement.style.setProperty('--blog-border', 'rgba(255,255,255,0.1)');
      document.documentElement.style.setProperty('--blog-border-subtle', 'rgba(255,255,255,0.05)');
      document.documentElement.style.setProperty('--blog-shadow', '0 4px 20px rgba(0,245,255,0.02)');
      document.documentElement.style.setProperty('--blog-shadow-hover', '0 4px 30px rgba(0,245,255,0.06)');
    }
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <BlogThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </BlogThemeContext.Provider>
  );
}

export function BlogThemeToggle() {
  const { theme, toggle } = useBlogTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      }}
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-white/50 hover:text-white transition-colors" />
      ) : (
        <Moon size={16} className="text-gray-500 hover:text-gray-800 transition-colors" />
      )}
    </button>
  );
}
