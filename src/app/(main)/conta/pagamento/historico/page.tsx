import { redirect } from "next/navigation";
import AccountShell from "../../_components/AccountShell";
import { InfoCard } from "../../_components/AccountBlocks";
import { getAccountData } from "../../_lib/account-data";
import { getPaymentHistory, redirectToStripePortal } from "../../actions";
import PaymentHistoryClient from "../_components/PaymentHistoryClient";

export default async function PagamentoHistoricoPage() {
  const account = await getAccountData();
  let portalError: string | null = null;

  if (account.hasStripeCustomer) {
    const portal = await redirectToStripePortal("invoices", "/conta/pagamento/historico");
    if (portal.ok && portal.url) {
      redirect(portal.url);
    }
    portalError = portal.message;
  }

  const history = await getPaymentHistory(12);

  return (
    <AccountShell active="pagamento" title="Histórico de pagamento" subtitle="Pagamentos e recibos da conta">
      <InfoCard>
        {portalError ? <p className="mb-3 text-sm text-zinc-600">{portalError} Exibindo modo local.</p> : null}
        <PaymentHistoryClient items={history} />
      </InfoCard>
    </AccountShell>
  );
}
