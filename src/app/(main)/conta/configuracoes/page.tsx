import AccountShell from "../_components/AccountShell";
import { InfoCard } from "../_components/AccountBlocks";
import SettingsForm from "../_components/SettingsForm";
import { getAccountData } from "../_lib/account-data";

export default async function ContaConfiguracoesPage() {
  await getAccountData();

  return (
    <AccountShell active="configuracoes" title="Configurações" subtitle="Preferências de idioma, reprodução e privacidade">
      <InfoCard>
        <SettingsForm />
      </InfoCard>
    </AccountShell>
  );
}
