"use client";

import { useState, useTransition } from "react";

export default function SettingsForm() {
  const [language, setLanguage] = useState("pt-BR");
  const [subtitles, setSubtitles] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState("normal");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setFeedback("Configurações salvas.");
        });
      }}
    >
      <label className="block text-sm text-zinc-700">
        Idiomas
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="mt-1 block w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" checked={subtitles} onChange={(event) => setSubtitles(event.target.checked)} />
        Legendas
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" checked={autoplay} onChange={(event) => setAutoplay(event.target.checked)} />
        Reprodução automática
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={notifications}
          onChange={(event) => setNotifications(event.target.checked)}
        />
        Notificações
      </label>

      <label className="block text-sm text-zinc-700">
        Privacidade
        <select
          value={privacy}
          onChange={(event) => setPrivacy(event.target.value)}
          className="mt-1 block w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="normal">Padrão</option>
          <option value="restrictive">Restrita</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar alterações"}
      </button>

      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </form>
  );
}
