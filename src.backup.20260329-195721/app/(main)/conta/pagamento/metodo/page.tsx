import { redirect } from "next/navigation";
import AccountShell from "../../_components/AccountShell";
import { InfoCard } from "../../_components/AccountBlocks";
import { getAccountData } from "../../_lib/account-data";
import { redirectToStripePortal } from "../../actions";
import PaymentMethodManager from "../_components/PaymentMethodManager";

export default async function PagamentoMetodoPage() {
  const account = await getAccountData();
  let portalError: string | null = null;

  if (account.hasStripeCustomer) {
    const portal = await redirectToStripePortal("payment", "/conta/pagamento/metodo");
    if (portal.ok && portal.url) {
      redirect(portal.url);
    }
    portalError = portal.message;
  }

  const last4 = account.cartaoMasked !== "Não disponível" ? account.cartaoMasked : null;

  return (
    <AccountShell active="pagamento" title="Gerenciar forma de pagamento" subtitle="Cartões salvos e método padrão">
      <InfoCard>
        {portalError ? <p className="mb-3 text-sm text-zinc-600">{portalError} Exibindo modo local.</p> : null}
        <PaymentMethodManager currentLast4={last4} />
      </InfoCard>
    </AccountShell>
  );
}
