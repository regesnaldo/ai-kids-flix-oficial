import AccountShell from "./_components/AccountShell";
import { ActionLink, InfoCard } from "./_components/AccountBlocks";
import { getAccountData } from "./_lib/account-data";

export default async function ContaPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="conta" title="Conta" subtitle="Dashboard geral da sua conta">
      <InfoCard>
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-900">Assinante desde {account.assinaturaDesde}</p>
          <p className="text-sm font-medium text-zinc-900">Plano: {account.planoLabel}</p>
          <p className="text-sm font-medium text-zinc-900">Próximo pagamento: {account.proximoPagamento}</p>
          <p className="text-sm font-medium text-zinc-900">Cartão: {account.cartaoMasked}</p>
          <div className="grid gap-3 border-t border-zinc-200 pt-4 sm:grid-cols-2">
            <p className="text-sm text-zinc-700">Email: {account.email}</p>
            <p className="text-sm text-zinc-700">Status: {account.status}</p>
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-base font-semibold text-zinc-950">Atalhos</h2>
        <ul className="mt-3 divide-y divide-zinc-200">
          <li><ActionLink label="Alterar plano" href="/conta/assinatura" /></li>
          <li><ActionLink label="Gerenciar a forma de pagamento" href="/conta/pagamento" /></li>
          <li><ActionLink label="Gerenciar acesso e aparelhos" href="/conta/aparelhos" /></li>
          <li><ActionLink label="Atualizar senha" href="/conta/seguranca" /></li>
          <li><ActionLink label="Transferir um perfil" href="/conta/perfis" /></li>
          <li><ActionLink label="Ajustar o controle parental" href="/conta/configuracoes" /></li>
        </ul>
      </InfoCard>
    </AccountShell>
  );
}
