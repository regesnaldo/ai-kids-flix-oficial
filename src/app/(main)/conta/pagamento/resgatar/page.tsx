import AccountShell from "../../_components/AccountShell";
import { InfoCard } from "../../_components/AccountBlocks";
import RedeemCodeForm from "../_components/RedeemCodeForm";
import { getAccountData } from "../../_lib/account-data";

export default async function PagamentoResgatarPage() {
  await getAccountData();

  return (
    <AccountShell
      active="pagamento"
      title="Resgatar cartão pré-pago ou código promocional"
      subtitle="Digite o código para aplicar na assinatura"
    >
      <InfoCard>
        <RedeemCodeForm />
        <a
          href="https://www.netflix.com/gift-cards"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline"
        >
          Comprar um cartão pré-pago
        </a>
      </InfoCard>
    </AccountShell>
  );
}
