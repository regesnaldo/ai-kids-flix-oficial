export const dynamic = 'force-dynamic';

import AccountShell from "../_components/AccountShell";
import { InfoCard } from "../_components/AccountBlocks";
import ProfilesManager from "../_components/ProfilesManager";
import { getAccountData } from "../_lib/account-data";

export default async function ContaPerfisPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="perfis" title="Perfis" subtitle="Gerencie perfis, nomes e preferências">
      <InfoCard>
        <ProfilesManager profiles={account.perfis} />
      </InfoCard>
    </AccountShell>
  );
}
