 'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  
  // Estado inicial estável para evitar flicker
  const [session, setSession] = useState<SessionState>({ authenticated: false, user: null });
  const [accountOpen, setAccountOpen] = useState(false);
  const [temasOpen, setTemasOpen] = useState(false); // mantido para compatibilidade futura
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTemasOpen, setMobileTemasOpen] = useState(false);
  const [mobileSeriesOpen, setMobileSeriesOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ CORREÇÃO: "Séries" agora abre dropdown de Temas
  const navItems = [
    { label: 'Início', href: '/home' },
    { label: 'Metaverso', href: '/universo' },
    { label: 'Séries', href: '/agentes', hasDropdown: true }, // <--- Com dropdown
    { label: 'Explorar', href: '/explorar' },
  ] as const;

  // Colunas de temas para o dropdown de "Séries"
  const seriesDropdownItems = [
    [
      { label: 'Fundamentos de IA', slug: 'fundamentos' },
      { label: 'Machine Learning', slug: 'machine-learning' },
      { label: 'Redes Neurais', slug: 'redes-neurais' },
      { label: 'Deep Learning', slug: 'deep-learning' },
      { label: 'Computer Vision', slug: 'computer-vision' },
      { label: 'Processamento de Linguagem', slug: 'nlp' },
      { label: 'IA Generativa', slug: 'ia-generativa' },
      { label: 'Ética em IA', slug: 'etica-ia' },
    ],
    [
      { label: 'IA e Criatividade', slug: 'ia-criatividade' },
      { label: 'Robótica e Automação', slug: 'robotica' },
      { label: 'IA para Crianças', slug: 'ia-criancas' },
      { label: 'IA nos Negócios', slug: 'ia-negocios' },
      { label: 'Segurança e IA', slug: 'seguranca' },
      { label: 'Futuro da IA', slug: 'futuro-ia' },
      { label: 'Projetos Práticos', slug: 'projetos' },
    ],
    [
      { label: 'Como me sinto hoje?', slug: 'emocional' },
      { label: 'Para iniciantes', slug: 'iniciantes' },
      { label: 'Para avançados', slug: 'avancados' },
      { label: 'Para crianças', slug: 'criancas' },
      { label: 'Missões especiais', slug: 'missoes' },
      { label: 'Agentes em dupla', slug: 'duplas' },
      { label: 'Desafios', slug: 'desafios' },
    ],
  ] as const;

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) {
          if (mounted) setSession({ authenticated: false, user: null });
          return;
        }

        const payload = (await response.json()) as SessionState;
        if (mounted) setSession(payload);
      } catch {
        if (mounted) setSession({ authenticated: false, user: null });
      }
    }

    loadSession();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
        setTemasOpen(false);
        setSeriesOpen(false);
        setMobileOpen(false);
        setMobileTemasOpen(false);
        setMobileSeriesOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setTemasOpen(false);
    setSeriesOpen(false);
    setMobileOpen(false);
    setMobileTemasOpen(false);
    setMobileSeriesOpen(false);
  }, [pathname]);

  const emailInitial = (session.user?.email?.trim()?.[0] ?? '?').toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md h-16 px-8">
      <div ref={containerRef} className="h-full flex items-center justify-between max-w-[1920px] mx-auto w-full">
        <div className="flex items-center gap-8">
          <Link href="/home" className="text-white font-black text-xl tracking-tight flex-shrink-0">
            MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isSeries = item.label === 'Séries';
              return (
                <div key={item.href} className="relative">
                  {isSeries ? (
                    <button
                      type="button"
                      onClick={() => setSeriesOpen((v) => !v)}
                      className={`text-sm font-medium transition inline-flex items-center gap-1 hover:text-white ${
                        seriesOpen ? 'text-white' : 'text-zinc-400'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${seriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm font-medium transition hover:text-white ${
                        pathname === item.href ? 'text-white' : 'text-zinc-400'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown de Séries - apenas Temas */}
                  {isSeries && seriesOpen && (
                    <div className="absolute top-full left-0 mt-4 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl z-50 overflow-hidden">
                      <div className="grid grid-cols-3 gap-x-12 gap-y-2 p-6 min-w-[720px]">
                        {seriesDropdownItems.map((col, colIdx) => (
                          <div key={colIdx} className="space-y-1">
                            {col.map((t) => (
                              <button
                                key={t.slug}
                                type="button"
                                onClick={() => {
                                  router.push(`/explorar?tema=${encodeURIComponent(t.slug)}`);
                                  setSeriesOpen(false);
                                }}
                                className="block w-full text-left text-sm text-zinc-300 hover:text-white hover:bg-white/5 py-1.5 px-2 rounded transition"
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="hidden md:inline-flex text-zinc-400 hover:text-white transition p-2" aria-label="Buscar">
            <Search className="w-5 h-5" />
          </button>
          <button type="button" className="hidden md:inline-flex text-zinc-400 hover:text-white transition p-2" aria-label="Notificações">
            <Bell className="w-5 h-5" />
          </button>

          {/* ✅ CORREÇÃO 2: Altura consistente (h-9) para evitar "pulo" no layout */}
          {session.authenticated ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm hover:opacity-90 transition"
              >
                {emailInitial}
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden z-50">
                  <button
                    type="button"
                    onClick={() => { setAccountOpen(false); router.push('/conta'); }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-200 hover:bg-white/5 transition"
                  >
                    Minha Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAccountOpen(false); router.push('/logout'); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="hidden md:inline-flex h-9 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 rounded-lg transition flex-shrink-0"
            >
              Entrar
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-zinc-200 hover:bg-white/5 transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-zinc-950 border-t border-zinc-800 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => {
              const isSeries = item.label === 'Séries';
              if (isSeries) {
                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() => setMobileSeriesOpen((v) => !v)}
                      className="w-full flex items-center justify-between text-lg font-medium text-zinc-200"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileSeriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSeriesOpen && (
                      <div className="space-y-3 pl-2 mt-3">
                        {seriesDropdownItems.flat().map((t) => (
                          <button
                            key={t.slug}
                            type="button"
                            onClick={() => {
                              router.push(`/explorar?tema=${encodeURIComponent(t.slug)}`);
                              setMobileOpen(false);
                              setMobileSeriesOpen(false);
                            }}
                            className="block text-left text-sm text-zinc-400 hover:text-white py-1"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-lg font-medium text-zinc-200 hover:text-white"
                >
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-zinc-800" />

            {session.authenticated ? (
              <div className="space-y-3">
                <Link href="/conta" className="block text-sm text-zinc-400">Minha Conta</Link>
                <button onClick={() => router.push('/logout')} className="block text-sm text-red-400">Sair</button>
              </div>
            ) : (
              <button onClick={() => router.push('/login')} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">
                Entrar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}