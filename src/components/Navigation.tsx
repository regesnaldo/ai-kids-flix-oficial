'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Compass, Menu, Search, X } from 'lucide-react';
import CalibrationModal from '@/components/CalibrationModal';
import { useCallback, useEffect, useRef, useState } from 'react';

type SessionUser = {
  id: number;
  email: string | null;
  name: string | null;
};

type SessionState = {
  authenticated: boolean;
  user: SessionUser | null;
};

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionState>({ authenticated: false, user: null });
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: 'Início', href: '/home' },
    { label: 'Séries', href: '/series' },
    { label: 'Blog', href: '/blog' },
    { label: 'Explorar', href: '/explorar' },
    { label: 'Lab', href: '/lab' },
  ] as const;

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) {
          if (mounted) {
            setSession({ authenticated: false, user: null });
          }
          return;
        }

        const payload = (await response.json()) as SessionState;
        if (mounted) {
          setSession(payload);
        }
      } catch {
        if (mounted) {
          setSession({ authenticated: false, user: null });
        }
      }
    }

    loadSession();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut: Ctrl+K or / opens search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isEditable(e.target))) {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function isEditable(el: EventTarget | null): boolean {
    if (!el || !(el instanceof HTMLElement)) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length > 0) {
      setSearchOpen(false);
      setSearchQuery('');
      router.push(`/explorar?q=${encodeURIComponent(q)}`);
    }
  }, [searchQuery, router]);

  const emailInitial = (session.user?.email?.trim()?.[0] ?? '?').toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md h-16 px-8">
      <div ref={containerRef} className="h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-white font-black text-xl tracking-tight">
            MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-300 hover:text-white transition"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}

          </nav>

          {/* Status Bar — clicável para abrir Calibração */}
          <button
            type="button"
            onClick={() => setIsCalibrationOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <p className="text-white text-xs leading-tight">
                Área do explorador
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden md:inline-flex text-zinc-300 hover:text-white transition"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          <button type="button" className="hidden md:inline-flex text-zinc-300 hover:text-white transition" aria-label="Notificações">
            <Bell className="w-5 h-5" />
          </button>

          {session.authenticated ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-purple-600/80 text-white font-extrabold flex items-center justify-center"
                aria-label="Abrir menu da conta"
              >
                {emailInitial}
              </button>

              {accountOpen ? (
                <div className="absolute right-0 top-full mt-3 w-44 bg-zinc-950 border border-zinc-700 shadow-2xl rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      router.push('/conta');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-white/5 transition"
                  >
                    Minha Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      router.push('/logos');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-white/5 transition"
                  >
                    LOGOS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      router.push('/logout');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-white/5 transition"
                  >
                    Sair
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="hidden md:inline-flex bg-red-600 hover:bg-red-500 transition text-white text-sm font-bold px-4 py-2 rounded"
            >
              Entrar
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-zinc-200 hover:bg-white/5 transition"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-zinc-950 border-t border-zinc-800">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-zinc-300 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/lab"
              className="block text-sm text-zinc-300 hover:text-white transition"
              onClick={() => setMobileOpen(false)}
            >
              Lab
            </Link>

            <div className="pt-2 border-t border-zinc-800" />

            {session.authenticated ? (
              <div className="space-y-3">
                <Link
                  href="/conta"
                  className="block text-sm text-zinc-300 hover:text-white transition"
                >
                  Minha Conta
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push('/logout');
                  }}
                  className="block text-left text-sm text-zinc-300 hover:text-white transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  router.push('/login');
                }}
                className="w-full bg-red-600 hover:bg-red-500 transition text-white text-sm font-bold px-4 py-2 rounded"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[25vh]"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-full max-w-xl px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}
                placeholder="Buscar agentes, aulas, temas..."
                className="w-full pl-12 pr-12 py-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-lg placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 transition"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                aria-label="Fechar busca"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <p className="text-center text-zinc-600 text-xs mt-3">
              Pressione <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">Esc</kbd> para fechar
            </p>
          </div>
        </div>
      )}
      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
      />
    </header>
  );
}
