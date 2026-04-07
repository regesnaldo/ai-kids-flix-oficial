export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AccountShell from "../_components/AccountShell";
import { InfoCard } from "../_components/AccountBlocks";
import { getAccountData } from "../_lib/account-data";

const paymentActions = [
  { label: "Gerenciar forma de pagamento", href: "/conta/pagamento/metodo" },
  { label: "Resgatar cartão pré-pago", href: "/conta/pagamento/resgatar" },
  { label: "Ver histórico de pagamento", href: "/conta/pagamento/historico" },
  { label: "Gerenciar detalhes de cobrança", href: "/conta/pagamento/cobranca" },
] as const;

export default async function ContaPagamentoPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="pagamento" title="Pagamento" subtitle="Gerencie cobrança, método de pagamento e histórico">
      <InfoCard>
        <div className="space-y-3 text-sm text-zinc-700">
          <p>Próximo pagamento: <span className="font-semibold text-zinc-900">{account.proximoPagamento}</span></p>
          <p>Valor: <span className="font-semibold text-zinc-900">{account.valorMensal}</span></p>
          <p>Método atual: <span className="font-semibold text-zinc-900">{account.metodoPagamento}</span></p>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-base font-semibold text-zinc-950">Ações de pagamento</h2>
        <ul className="mt-3 divide-y divide-zinc-200">
          {paymentActions.map((action) => (
            <li key={action.label}>
              <Link
                href={action.href}
                className="group flex items-center justify-between py-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
              >
                <span>{action.label}</span>
                <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </InfoCard>
    </AccountShell>
  );
}
