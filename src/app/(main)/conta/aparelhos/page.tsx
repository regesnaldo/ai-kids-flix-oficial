export const dynamic = 'force-dynamic';

import AccountShell from "../_components/AccountShell";
import { InfoCard } from "../_components/AccountBlocks";
import ServerActionButton from "../_components/ServerActionButton";
import { removeDevice } from "../actions";
import { getAccountData } from "../_lib/account-data";

export default async function ContaAparelhosPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="aparelhos" title="Aparelhos" subtitle="Aparelhos conectados e sessões ativas">
      <InfoCard>
        <ul className="space-y-3">
          {account.acessosRecentes.map((device) => (
            <li key={device.id} className="rounded-xl border border-zinc-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 text-sm text-zinc-700">
                  <p className="font-semibold text-zinc-900">{device.nome}</p>
                  <p>Último acesso: {device.ultimoAcesso}</p>
                  <p>Local: {device.local}</p>
                </div>
                <ServerActionButton label="Desconectar aparelho" onAction={removeDevice} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <ServerActionButton label="Desconectar todos" onAction={removeDevice} />
        </div>
      </InfoCard>
    </AccountShell>
  );
}
