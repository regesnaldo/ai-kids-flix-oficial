"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const sidebarItems = [
  {
    label: "Visão geral",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
      </svg>
    ),
  },
  {
    label: "Assinatura",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
      </svg>
    ),
  },
  {
    label: "Segurança",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 4.5 6v6.8c0 4.2 3 6.8 7.5 8.2 4.5-1.4 7.5-4 7.5-8.2V6L12 3Z" />
      </svg>
    ),
  },
  {
    label: "Aparelhos",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="4" width="14" height="11" rx="1.8" />
        <rect x="18" y="8" width="3.5" height="8" rx="0.8" />
        <path d="M7 19h5" />
      </svg>
    ),
  },
  {
    label: "Perfis",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M3.5 19c1.2-3 3.3-4.5 5.5-4.5s4.3 1.5 5.5 4.5" />
        <path d="M14.8 19c.6-1.7 1.8-2.8 3.2-3.2" />
      </svg>
    ),
  },
  {
    label: "Voltar à Netflix",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 6 4 12l6 6" />
        <path d="M5 12h15" />
      </svg>
    ),
  },
] as const;

const shortcuts = [
  { label: "Alterar plano", href: "/conta/plano" },
  { label: "Gerenciar a forma de pagamento", href: "/conta/pagamento" },
  { label: "Gerenciar acesso e aparelhos", href: "/conta/aparelhos" },
  { label: "Atualizar senha", href: "/conta/seguranca" },
  { label: "Transferir um perfil", href: "/conta/perfis" },
  { label: "Ajustar o controle parental", href: "/conta/parental" },
] as const;

export type AccountViewData = {
  email: string;
  memberSince: string;
  plan: "free" | "pro" | "enterprise";
  nextPayment: string;
  cardMasked: string;
  status: "ativa" | "inativa";
  paymentMethod: string;
};

type ContaManagementClientProps = {
  accountData: AccountViewData | null;
  errorMessage?: string;
};

function planLabel(plan: AccountViewData["plan"]): string {
  if (plan === "free") {
    return "free";
  }
  if (plan === "enterprise") {
    return "enterprise";
  }
  return "pro";
}

export default function ContaManagementClient({ accountData, errorMessage }: ContaManagementClientProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>(sidebarItems[0].label);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <span className="text-2xl font-black tracking-tight text-[#E50914]">MENTE.AI</span>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-700">
            <a href="#" className="transition-colors hover:text-zinc-950">
              Conta
            </a>
            <a href="#" className="transition-colors hover:text-zinc-950">
              Ajuda
            </a>
            <button
              type="button"
              onClick={() => router.push("/logout")}
              className="transition-colors hover:text-zinc-950"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-200">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeMenu === item.label;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setActiveMenu(item.label)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-100 text-zinc-950"
                        : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    <span className="text-zinc-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Conta</h1>
            <p className="text-sm text-zinc-600">Detalhes da assinatura</p>
          </header>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
            {isLoading ? (
              <p className="text-sm text-zinc-600">Carregando dados da conta...</p>
            ) : errorMessage || !accountData ? (
              <p className="text-sm text-zinc-600">
                {errorMessage ?? "Não foi possível carregar os detalhes da assinatura no momento."}
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-900">Assinante desde {accountData.memberSince}</p>
                <p className="text-sm font-medium text-zinc-900">Plano: {planLabel(accountData.plan)}</p>
                <p className="text-sm font-medium text-zinc-900">Próximo pagamento: {accountData.nextPayment}</p>
                <p className="text-sm font-medium text-zinc-900">
                  Cartão: {accountData.cardMasked === "Não disponível" ? "Não disponível" : `•••• •••• •••• ${accountData.cardMasked}`}
                </p>
                <div className="mt-4 grid gap-3 border-t border-zinc-200 pt-4 sm:grid-cols-2">
                  <p className="text-sm font-medium text-zinc-900">Email: {accountData.email}</p>
                  <p className="text-sm font-medium capitalize text-zinc-900">Status: {accountData.status}</p>
                  <p className="text-sm font-medium text-zinc-900 sm:col-span-2">
                    Método de pagamento: {accountData.paymentMethod}
                  </p>
                </div>
              </div>
            )}
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
            <h2 className="text-base font-semibold text-zinc-950">Atalhos</h2>
            <ul className="mt-4 divide-y divide-zinc-200">
              {shortcuts.map((shortcut) => (
                <li key={shortcut.label}>
                  <Link
                    href={shortcut.href}
                    className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
                  >
                    <span>{shortcut.label}</span>
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
