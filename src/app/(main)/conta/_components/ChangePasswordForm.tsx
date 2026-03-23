"use client";

import { useState, useTransition } from "react";
import { changePassword } from "../actions";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();

        startTransition(async () => {
          const result = await changePassword(password);
          setFeedback(result.message);
          if (result.ok) {
            setPassword("");
          }
        });
      }}
    >
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        placeholder="Nova senha"
        className="w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-red-500 focus:ring-2"
      />
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
        >
          {isPending ? "Alterando..." : "Alterar senha"}
        </button>
      </div>
      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </form>
  );
}
