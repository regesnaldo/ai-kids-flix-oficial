'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, Search, Shield, X, ChevronRight, Heart, BookOpen, Compass, Globe } from 'lucide-react';
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

const NAV_ITEMS = [
  { label: 'Início',     href: '/',           icon: null },
  { label: 'Histórias',  href: '/series',     icon: BookOpen },
  { label: 'Aventuras',  href: '/universo',   icon: Compass },
  { label: 'Aprender',   href: '/aulas',      icon: null },
  { label: 'Favoritos',  href: '/favoritos',  icon: Heart },
  { label: 'Idiomas',    href: '/idiomas',    icon: Globe },
] as const;

// ── Colorful avatar palette for children ──────────────────────────────────
const AVATAR_COLORS = [
  'bg-gradient-to-br from-violet-500 to-fuchsia-500',
  'bg-gradient-to-br from-cyan-400 to-blue-500',
  'bg-gradient-to-br from-amber-400 to-orange-500',
  'bg-gradient-to-br from-emerald-400 to-teal-500',
  'bg-gradient-to-br from-rose-400 to-pink-500',
  'bg-gradient-to-br from-sky-400 to-indigo-500',
];

function avatarColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function isEditable(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
}

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

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) { if (mounted) setSession({ authenticated: false, user: null }); return; }
        const payload = (await response.json()) as SessionState;
        if (mounted) setSession(payload);
      } catch { if (mounted) setSession({ authenticated: false, user: null }); }
    }
    loadSession();
    return () => { mounted = false; };
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
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

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

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length > 0) { setSearchOpen(false); setSearchQuery(''); router.push(`/explorar?q=${encodeURIComponent(q)}`); }
  }, [searchQuery, router]);

  const userEmail = session.user?.email ?? '';
  const emailInitial = (userEmail.trim()[0] ?? '?').toUpperCase();
  const userColor = avatarColor(userEmail);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]"
      role="banner"
    >
      <div ref={containerRef} className="h-full max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* ── LEFT: Logo + Nav ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:gap-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 shrink-0"
            aria-label="MENTE.AI — Página inicial"
          >
            <span className="text-white font-black text-xl md:text-2xl tracking-tight">
              MENTE
            </span>
            <span className="text-cyan-400 font-black text-xl md:text-2xl tracking-tight">
              .AI
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }
                `}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── RIGHT: Actions ────────────────────────────────────────── */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Buscar (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => router.push('/notificacoes')}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Parental Controls */}
          <button
            type="button"
            onClick={() => router.push('/controles-parentais')}
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-amber-400 hover:bg-white/[0.06] transition-colors"
            aria-label="Controles parentais"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Auth: avatar or login */}
          {session.authenticated ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen(v => !v)}
                className={`w-9 h-9 rounded-full ${userColor} text-white font-bold text-sm flex items-center justify-center shadow-lg ring-2 ring-white/10 hover:ring-white/30 transition-all`}
                aria-label="Menu da conta"
                aria-expanded={accountOpen}
              >
                {emailInitial}
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-xl overflow-hidden"
                  role="menu"
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-white text-sm font-medium truncate">{session.user?.name ?? 'Explorador'}</p>
                    <p className="text-zinc-500 text-xs truncate">{session.user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAccountOpen(false); router.push('/perfil'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors flex items-center gap-2"
                    role="menuitem"
                  >
                    <span className="w-4 text-center">👤</span> Meu Perfil
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAccountOpen(false); router.push('/conta'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors flex items-center gap-2"
                    role="menuitem"
                  >
                    <span className="w-4 text-center">⚙️</span> Minha Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAccountOpen(false); router.push('/logout'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-2"
                    role="menuitem"
                  >
                    <span className="w-4 text-center">🚪</span> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="hidden sm:inline-flex bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors"
            >
              Entrar
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden absolute left-0 right-0 top-16 bg-black/98 backdrop-blur-xl border-t border-white/[0.06] max-h-[calc(100vh-4rem)] overflow-y-auto"
          role="navigation"
          aria-label="Menu mobile"
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                  ${isActive(item.href)
                    ? 'bg-white/[0.06] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                  }
                `}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
                {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto text-cyan-400" />}
              </Link>
            ))}

            <div className="my-2 border-t border-white/[0.06]" />

            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="px-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>
            </form>

            <div className="flex gap-2 px-1 py-1">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); router.push('/notificacoes'); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <Bell className="w-4 h-4" /> Notificações
              </button>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); router.push('/controles-parentais'); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <Shield className="w-4 h-4" /> Controles
              </button>
            </div>

            <div className="border-t border-white/[0.06] pt-2">
              {session.authenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className={`w-8 h-8 rounded-full ${userColor} text-white font-bold text-xs flex items-center justify-center shadow`}>
                      {emailInitial}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{session.user?.name ?? 'Explorador'}</p>
                      <p className="text-zinc-500 text-xs">{session.user?.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); router.push('/perfil'); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] rounded-lg transition-colors"
                  >
                    👤 Meu Perfil
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); router.push('/conta'); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04] rounded-lg transition-colors"
                  >
                    ⚙️ Minha Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); router.push('/logout'); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                  >
                    🚪 Sair
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); router.push('/login'); }}
                  className="w-full bg-white text-black text-sm font-bold px-4 py-3 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH OVERLAY ────────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          role="dialog"
          aria-label="Buscar"
        >
          <div className="w-full max-w-xl px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false); }}
                placeholder="Buscar histórias, aventuras, aulas..."
                className="w-full pl-14 pr-12 py-4 bg-zinc-900/80 border border-white/[0.08] rounded-2xl text-white text-lg placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-colors flex items-center justify-center"
                aria-label="Fechar busca"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-zinc-600 text-xs">
                Pressione <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-[10px] border border-white/[0.06]">Esc</kbd> para fechar
              </p>
              <span className="text-zinc-700">•</span>
              <p className="text-zinc-600 text-xs">
                Atalho <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-[10px] border border-white/[0.06]">Ctrl+K</kbd>
              </p>
            </div>
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
