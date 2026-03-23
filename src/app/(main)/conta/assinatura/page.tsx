import AccountShell from "../_components/AccountShell";
import { InfoCard } from "../_components/AccountBlocks";
import { getAccountData } from "../_lib/account-data";
import StripePortalButtons from "./StripePortalButtons";

function statusBadge(status: "active" | "pending" | "canceled") {
  if (status === "active") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "canceled") {
    return "bg-red-100 text-red-700";
  }
  return "bg-amber-100 text-amber-700";
}

function statusLabel(status: "active" | "pending" | "canceled") {
  if (status === "active") {
    return "Ativo";
  }
  if (status === "canceled") {
    return "Cancelado";
  }
  return "Pendente";
}

export default async function ContaAssinaturaPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="assinatura" title="Assinatura" subtitle="Detalhes do plano e opções de assinatura">
      <InfoCard>
        <h2 className="text-lg font-semibold text-zinc-950">Detalhes do plano</h2>
        <div className="space-y-3 text-sm text-zinc-700">
          <p>Plano atual: <span className="font-semibold text-zinc-900">{account.planoLabel}</span></p>
          <p>Resolução de vídeo: <span className="font-semibold text-zinc-900">{account.resolucao}</span></p>
          <p>Intervalos de anúncios: <span className="font-semibold text-zinc-900">{account.anuncios}</span></p>
          <p>
            Status:{" "}
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(account.subscriptionStatusRaw)}`}>
              {statusLabel(account.subscriptionStatusRaw)}
            </span>
          </p>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-lg font-semibold text-zinc-950">Próximo pagamento</h2>
        <div className="mt-3 space-y-3 text-sm text-zinc-700">
          <p>Data: <span className="font-semibold text-zinc-900">{account.proximoPagamento}</span></p>
          <p>Valor: <span className="font-semibold text-zinc-900">{account.valorMensal}</span></p>
          <p>
            Método:{" "}
            <span className="font-semibold text-zinc-900">
              {account.cartaoMasked === "Não disponível" ? "Não cadastrado" : `•••• •••• •••• ${account.cartaoMasked}`}
            </span>
          </p>
        </div>
        <div className="mt-6">
          <StripePortalButtons hasStripeCustomer={account.hasStripeCustomer} />
        </div>
      </InfoCard>
    </AccountShell>
  );
}
