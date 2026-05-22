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

    // Add data attribute to root so CSS can target [data-blog-theme="light"]
    document.documentElement.setAttribute('data-blog-theme', theme);

    if (theme === 'light') {
      // Override the actual CSS variables that blog pages consume
      document.documentElement.style.setProperty('--dark-bg', '#f8f9fa');
      document.documentElement.style.setProperty('--dark-card', '#ffffff');
      document.documentElement.style.setProperty('--accent-cyan', '#0099cc');
    } else {
      // Restore dark defaults
      document.documentElement.style.setProperty('--dark-bg', '#0e1420');
      document.documentElement.style.setProperty('--dark-card', '#161d2e');
      document.documentElement.style.setProperty('--accent-cyan', '#00f5ff');
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
      className="fixed top-20 right-4 z-30 p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: '#161d2e',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-cyan)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-white/60 hover:text-white transition-colors" />
      ) : (
        <Moon size={16} className="text-gray-700 hover:text-gray-900 transition-colors" />
      )}
    </button>
  );
}
