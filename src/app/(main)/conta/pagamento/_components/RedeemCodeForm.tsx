"use client";

import { useState, useTransition } from "react";
import { redeemCode } from "../../actions";

export default function RedeemCodeForm() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await redeemCode(code);
          setFeedback(result.message);
          if (result.ok) {
            setCode("");
          }
        });
      }}
    >
      <input
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="Digite seu código"
        maxLength={24}
        className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {isPending ? "Resgatando..." : "Resgatar"}
      </button>
      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </form>
  );
}
