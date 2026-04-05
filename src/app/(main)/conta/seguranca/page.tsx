import AccountShell from "../_components/AccountShell";
import { ActionLink, InfoCard } from "../_components/AccountBlocks";
import ChangePasswordForm from "../_components/ChangePasswordForm";
import ConfirmActionButton from "../_components/ConfirmActionButton";
import ServerActionButton from "../_components/ServerActionButton";
import { deleteAccount, verifyEmail, verifyPhone } from "../actions";
import { getAccountData } from "../_lib/account-data";

export default async function ContaSegurancaPage() {
  const account = await getAccountData();

  return (
    <AccountShell active="seguranca" title="Segurança" subtitle="Proteção da conta, acesso e privacidade">
      <InfoCard>
        <div className="space-y-5 text-sm text-zinc-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>
              Confirmar número de celular: <span className="font-semibold text-zinc-900">{account.celularVerificado ? "Verificado" : "Não verificado"}</span>
            </p>
            <ServerActionButton label="Confirmar agora" onAction={verifyPhone} />
          </div>

          <div>
            <p className="mb-2">Senha: <span className="font-semibold text-zinc-900">{account.senhaInfo}</span></p>
            <ChangePasswordForm />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p>Email: <span className="font-semibold text-zinc-900">{account.email} ({account.emailVerificado ? "verificado" : "não verificado"})</span></p>
            <p>Celular: <span className="font-semibold text-zinc-900">{account.celular} ({account.celularVerificado ? "verificado" : "não verificado"})</span></p>
          </div>

          <ServerActionButton label="Verificar email" onAction={verifyEmail} />
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-base font-semibold text-zinc-950">Acesso e privacidade</h2>
        <ul className="mt-3 divide-y divide-zinc-200">
          <li><ActionLink label="Acesso e aparelhos" href="/conta/aparelhos" /></li>
          <li><ActionLink label="Gerenciar aparelhos conectados" href="/conta/aparelhos" /></li>
          <li><ActionLink label="Transferência de perfil" href="/conta/perfis" /></li>
          <li><ActionLink label="Acesso a dados pessoais" href="/conta/configuracoes" /></li>
        </ul>
      </InfoCard>

      <InfoCard>
        <ConfirmActionButton
          label="Excluir conta"
          confirmLabel="Confirmar exclusão"
          title="Excluir conta"
          message="Essa ação remove permanentemente sua conta e perfis. Confirme apenas se tiver certeza."
          danger
          onConfirm={deleteAccount}
        />
      </InfoCard>
    </AccountShell>
  );
}
