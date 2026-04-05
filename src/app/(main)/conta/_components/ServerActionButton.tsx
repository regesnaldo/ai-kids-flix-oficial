"use client";

import { useTransition, useState } from "react";

type ServerActionButtonProps = {
  label: string;
  pendingLabel?: string;
  onAction: () => Promise<{ ok: boolean; message: string }>;
};

export default function ServerActionButton({ label, pendingLabel = "Processando...", onAction }: ServerActionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            const result = await onAction();
            setFeedback(result.message);
          });
        }}
        disabled={isPending}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
      >
        {isPending ? pendingLabel : label}
      </button>
      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </div>
  );
}
