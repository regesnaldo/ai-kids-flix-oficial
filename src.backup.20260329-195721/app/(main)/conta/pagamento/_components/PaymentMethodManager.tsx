"use client";

import { useState, useTransition } from "react";
import { removePaymentMethod, updatePaymentMethod } from "../../actions";

type PaymentMethodManagerProps = {
  currentLast4: string | null;
};

export default function PaymentMethodManager({ currentLast4 }: PaymentMethodManagerProps) {
  const [last4, setLast4] = useState("");
  const [brand, setBrand] = useState("visa");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-700">
        Cartão atual: <span className="font-semibold text-zinc-900">{currentLast4 ? `•••• •••• •••• ${currentLast4}` : "Não cadastrado"}</span>
      </p>

      <div className="flex flex-wrap gap-2">
        <input
          value={last4}
          onChange={(event) => setLast4(event.target.value)}
          maxLength={4}
          placeholder="Últimos 4 dígitos"
          className="w-full max-w-[170px] rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <select
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="visa">Visa</option>
          <option value="master">Mastercard</option>
          <option value="elo">Elo</option>
        </select>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await updatePaymentMethod({ last4, brand, isDefault: true });
              setFeedback(result.message);
              if (result.ok) {
                setLast4("");
              }
            });
          }}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Adicionar novo cartão"}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await updatePaymentMethod({
                last4: currentLast4 ?? "0000",
                brand,
                isDefault: true,
              });
              setFeedback(result.message);
            });
          }}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
        >
          Definir como padrão
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setConfirmRemove((prev) => !prev)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
        >
          Remover cartão
        </button>

        {confirmRemove ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">Confirma remover o cartão salvo?</p>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const result = await removePaymentMethod();
                  setFeedback(result.message);
                  setConfirmRemove(false);
                });
              }}
              className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {isPending ? "Removendo..." : "Confirmar remoção"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700">
        <p className="font-semibold text-zinc-900">Cartões salvos</p>
        <p className="mt-1">{currentLast4 ? `Visa •••• ${currentLast4} (padrão)` : "Nenhum cartão salvo."}</p>
      </div>

      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </div>
  );
}
