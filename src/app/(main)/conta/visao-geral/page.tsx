import AccountShell from "../_components/AccountShell";
import { InfoCard } from "../_components/AccountBlocks";
import { getAccountData } from "../_lib/account-data";

export default async function ContaVisaoGeralPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="visao-geral" title="Visão Geral" subtitle="Resumo da conta e atividade recente">
      <InfoCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <p className="text-sm text-zinc-700">Status da assinatura: <span className="font-semibold capitalize text-zinc-900">{account.status}</span></p>
          <p className="text-sm text-zinc-700">Plano atual: <span className="font-semibold text-zinc-900">{account.planoLabel}</span></p>
          <p className="text-sm text-zinc-700">Perfis ativos: <span className="font-semibold text-zinc-900">{account.perfis.length}</span></p>
          <p className="text-sm text-zinc-700">Último login: <span className="font-semibold text-zinc-900">{account.acessosRecentes[0]?.ultimoAcesso ?? "Sem dados"}</span></p>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-base font-semibold text-zinc-950">Últimos acessos</h2>
        <ul className="mt-4 divide-y divide-zinc-200">
          {account.acessosRecentes.map((access) => (
            <li key={access.id} className="flex items-center justify-between py-3 text-sm text-zinc-700">
              <span>{access.nome}</span>
              <span>{access.ultimoAcesso}</span>
            </li>
          ))}
        </ul>
      </InfoCard>
    </AccountShell>
  );
}
