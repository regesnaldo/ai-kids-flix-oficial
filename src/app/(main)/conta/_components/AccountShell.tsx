"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Home,
  Menu,
  Monitor,
  Settings,
  Shield,
  Users,
  Wallet,
  X,
} from "lucide-react";

type NavKey =
  | "conta"
  | "visao-geral"
  | "assinatura"
  | "pagamento"
  | "seguranca"
  | "aparelhos"
  | "perfis"
  | "configuracoes";

type AccountShellProps = {
  active: NavKey;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const navItems = [
  { key: "visao-geral", label: "Visão geral", href: "/conta/visao-geral", icon: Home },
  { key: "assinatura", label: "Assinatura", href: "/conta/assinatura", icon: CreditCard },
  { key: "pagamento", label: "Pagamento", href: "/conta/pagamento", icon: Wallet },
  { key: "seguranca", label: "Segurança", href: "/conta/seguranca", icon: Shield },
  { key: "aparelhos", label: "Aparelhos", href: "/conta/aparelhos", icon: Monitor },
  { key: "perfis", label: "Perfis", href: "/conta/perfis", icon: Users },
  { key: "configuracoes", label: "Configurações", href: "/conta/configuracoes", icon: Settings },
] as const;

export default function AccountShell({ active, title, subtitle, children }: AccountShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-2xl font-black tracking-tight text-[#E50914]">MENTE.AI</span>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center rounded-lg border border-zinc-200 p-2 text-zinc-700 hover:bg-zinc-100 lg:hidden"
            aria-label="Abrir menu da conta"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 lg:flex">
            <Link href="/conta" className="transition-colors hover:text-zinc-950">
              Conta
            </Link>
            <Link href="/home" className="transition-colors hover:text-zinc-950">
              Início
            </Link>
            <Link href="/login" className="transition-colors hover:text-zinc-950">
              Sair
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-8 lg:py-8">
        <aside
          className={`${mobileOpen ? "block" : "hidden"} rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-200 lg:sticky lg:top-24 lg:block lg:self-start`}
        >
          <ul className="space-y-1">
            <li>
              <Link
                href="/conta"
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active === "conta" ? "bg-zinc-100 text-zinc-950" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-zinc-600" />
                  Conta
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;

              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? "bg-zinc-100 text-zinc-950" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-zinc-600" />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/home"
                className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
              >
                <span className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5 text-zinc-600" />
                  Voltar à Netflix
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          </ul>
        </aside>

        <section className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{title}</h1>
            <p className="text-sm text-zinc-600">{subtitle}</p>
          </header>
          {children}
        </section>
      </main>
    </div>
  );
}
