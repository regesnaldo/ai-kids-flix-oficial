"use client";

import { useState, useTransition } from "react";

type ConfirmActionButtonProps = {
  label: string;
  confirmLabel: string;
  title: string;
  message: string;
  danger?: boolean;
  onConfirm: () => Promise<{ ok: boolean; message: string }>;
};

export default function ConfirmActionButton({
  label,
  confirmLabel,
  title,
  message,
  danger = false,
  onConfirm,
}: ConfirmActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const baseClass = danger
    ? "bg-red-600 text-white hover:bg-red-700"
    : "bg-zinc-900 text-white hover:bg-zinc-700";

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${baseClass}`}
      >
        {label}
      </button>

      {open ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900">{title}</p>
          <p className="mt-1 text-sm text-zinc-600">{message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                startTransition(async () => {
                  const result = await onConfirm();
                  setFeedback(result.message);
                  if (result.ok) {
                    setOpen(false);
                  }
                });
              }}
              disabled={isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {isPending ? "Processando..." : confirmLabel}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              Voltar
            </button>
          </div>
        </div>
      ) : null}

      {feedback ? <p className="text-sm text-zinc-600">{feedback}</p> : null}
    </div>
  );
}
