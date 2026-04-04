import { redirect } from "next/navigation";
import AccountShell from "../../_components/AccountShell";
import { InfoCard } from "../../_components/AccountBlocks";
import { getAccountData } from "../../_lib/account-data";
import { redirectToStripePortal } from "../../actions";
import BillingDetailsForm from "../_components/BillingDetailsForm";

export default async function PagamentoCobrancaPage() {
  const account = await getAccountData();
  let portalError: string | null = null;

  if (account.hasStripeCustomer) {
    const portal = await redirectToStripePortal("billing", "/conta/pagamento/cobranca");
    if (portal.ok && portal.url) {
      redirect(portal.url);
    }
    portalError = portal.message;
  }

  return (
    <AccountShell active="pagamento" title="Gerenciar detalhes de cobrança" subtitle="Dados usados nos próximos pagamentos">
      <InfoCard>
        {portalError ? <p className="mb-3 text-sm text-zinc-600">{portalError} Exibindo modo local.</p> : null}
        <BillingDetailsForm defaultEmail={account.email} />
      </InfoCard>
    </AccountShell>
  );
}
