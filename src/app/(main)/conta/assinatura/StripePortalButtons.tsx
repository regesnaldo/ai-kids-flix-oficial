"use client";

import { useState, useTransition } from "react";
import { createStripeBillingPortalSession } from "../actions";
import ConfirmActionButton from "../_components/ConfirmActionButton";

type StripePortalButtonsProps = {
  hasStripeCustomer: boolean;
};

export default function StripePortalButtons({ hasStripeCustomer }: StripePortalButtonsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openPortal = (mode: "manage" | "cancel") => {
    startTransition(async () => {
      const result = await createStripeBillingPortalSession(mode, "/conta/assinatura");
      setFeedback(result.message);

      if (result.ok && result.url) {
        window.location.href = result.url;
      }
    });
  };

  if (!hasStripeCustomer) {
    return <p className="text-sm text-zinc-600">Gerenciamento Stripe indisponível para esta conta.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => openPortal("manage")}
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {isPending ? "Abrindo portal..." : "Alterar plano"}
        </button>

        <ConfirmActionButton
          label="Cancelar assinatura"
          confirmLabel="Abrir cancelamento no Stripe"
          title="Cancelar assinatura"
          message="Você será redirecionado ao Stripe Billing Portal para confirmar o cancelamento."
          danger
          onConfirm={async () => {
            const result = await createStripeBillingPortalSession("cancel", "/conta/assinatura");
            setFeedback(result.message);
            if (result.ok && result.url) {
              window.location.href = result.url;
            }
            return { ok: result.ok, message: result.message };
          }}
        />
      </div>

      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </div>
  );
}
