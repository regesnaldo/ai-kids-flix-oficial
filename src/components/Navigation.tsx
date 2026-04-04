'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, User, X } from 'lucide-react';
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
  const [session, setSession] = useState<SessionState>({ authenticated: false, user: null });
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: "Início", href: "/" },
    { label: "Agentes", href: "/agentes" },

    { label: "Explorar", href: "/explorar" },
  ];

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
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setDesktopMenuOpen(false);
        setMobileMenuOpen(false);
        setMobileAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  useEffect(() => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileAccountOpen(false);
  }, [pathname]);

  const accountLabel = session.user?.name || session.user?.email || "Conta";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="inline-flex items-center rounded-md border border-white/30 p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
        aria-label="Abrir menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <nav className="hidden items-center gap-4 sm:gap-6 lg:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              pathname === item.href
                ? "border-b-2 border-red-600 pb-1 text-white"
                : "text-white/80 hover:text-white"
            }`}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}

        {!session.authenticated ? (
          <Link
            href="/login"
            className="rounded-md border border-white/40 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Entrar
          </Link>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDesktopMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <User className="h-4 w-4" />
              <span className="max-w-28 truncate">{accountLabel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {desktopMenuOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-900 shadow-lg">
                <Link href="/conta" className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
                  Minha Conta
                </Link>
                <Link href="/conta/assinatura" className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
                  Assinatura
                </Link>
                <Link href="/conta/configuracoes" className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">
                  Configurações
                </Link>
                <div className="my-1 border-t border-zinc-200" />
                <a href="/api/auth/logout" className="block rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Sair MENTE.AI
                </a>
              </div>
            ) : null}
          </div>
        )}
      </nav>

      {mobileMenuOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-900 shadow-lg lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === item.href ? "bg-zinc-100 text-zinc-950" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="my-1 border-t border-zinc-200" />

          {!session.authenticated ? (
            <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
              Entrar
            </Link>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setMobileAccountOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {accountLabel}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileAccountOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileAccountOpen ? (
                <div className="mt-1 space-y-1 rounded-lg bg-zinc-50 p-1">
                  <Link href="/conta" className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                    Minha Conta
                  </Link>
                  <Link href="/conta/assinatura" className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                    Assinatura
                  </Link>
                  <Link href="/conta/configuracoes" className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                    Configurações
                  </Link>
                  <a href="/api/auth/logout" className="block rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                    Sair MENTE.AI
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
