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
  const [session, setSession] = useState<SessionState>({ authenticated: false, user: null });
  const [accountOpen, setAccountOpen] = useState(false);
  const [temasOpen, setTemasOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTemasOpen, setMobileTemasOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: 'Início', href: '/home' },
    { label: 'Séries', href: '/agentes' },
    { label: 'Explorar', href: '/explorar' },
  ] as const;

  const temasColumns = [
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
        setTemasOpen(false);
        setMobileOpen(false);
        setMobileTemasOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setTemasOpen(false);
    setMobileOpen(false);
    setMobileTemasOpen(false);
  }, [pathname]);

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

            <div className="relative">
              <button
                type="button"
                onClick={() => setTemasOpen((v) => !v)}
                className="text-sm text-zinc-300 hover:text-white transition inline-flex items-center gap-1"
                aria-expanded={temasOpen}
              >
                Temas
                <ChevronDown className={`w-4 h-4 transition-transform ${temasOpen ? 'rotate-180' : ''}`} />
              </button>

              {temasOpen ? (
                <div className="absolute top-full left-0 mt-4 bg-zinc-950 border border-zinc-700 shadow-2xl rounded-lg z-50">
                  <div className="grid grid-cols-3 gap-x-12 p-6 min-w-[780px]">
                    {temasColumns.map((col, colIdx) => (
                      <div key={colIdx} className="space-y-1">
                        {col.map((t) => (
                          <button
                            key={t.slug}
                            type="button"
                            onClick={() => {
                              router.push(`/explorar?tema=${encodeURIComponent(t.slug)}`);
                              setTemasOpen(false);
                            }}
                            className="text-sm text-zinc-200 py-1.5 hover:underline cursor-pointer text-left w-full"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="hidden md:inline-flex text-zinc-300 hover:text-white transition" aria-label="Buscar">
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

            <button
              type="button"
              onClick={() => setMobileTemasOpen((v) => !v)}
              className="w-full flex items-center justify-between text-sm text-zinc-300 hover:text-white transition"
            >
              <span>Temas</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileTemasOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileTemasOpen ? (
              <div className="pt-2 grid grid-cols-1 gap-2">
                {temasColumns.flat().map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => {
                      router.push(`/explorar?tema=${encodeURIComponent(t.slug)}`);
                      setMobileOpen(false);
                      setMobileTemasOpen(false);
                    }}
                    className="text-left text-sm text-zinc-200 py-1.5 hover:underline"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : null}

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
    </header>
  );
}
