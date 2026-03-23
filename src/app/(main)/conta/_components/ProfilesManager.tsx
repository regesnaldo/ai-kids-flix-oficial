"use client";

import { useState, useTransition } from "react";
import { addProfile, removeProfile, updateProfile } from "../actions";
import type { AccountProfile } from "../_lib/account-data";

type ProfilesManagerProps = {
  profiles: AccountProfile[];
};

export default function ProfilesManager({ profiles }: ProfilesManagerProps) {
  const [newName, setNewName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-700">{profiles.length} perfis</p>

      <div className="flex flex-wrap gap-2">
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Nome do novo perfil"
          className="w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-red-500 focus:ring-2"
        />
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await addProfile(newName);
              setFeedback(result.message);
              if (result.ok) {
                setNewName("");
              }
            });
          }}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
        >
          {isPending ? "Adicionando..." : "Adicionar perfil"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          Gerenciar perfis
        </button>
      </div>

      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}

      <ul className="space-y-3">
        {profiles.map((profile) => (
          <ProfileItem key={profile.id} profile={profile} />
        ))}
      </ul>
    </div>
  );
}

type ProfileItemProps = {
  profile: AccountProfile;
};

function ProfileItem({ profile }: ProfileItemProps) {
  const [name, setName] = useState(profile.nome);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <li className="rounded-xl border border-zinc-200 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-red-500 focus:ring-2"
        />
        <span className="text-sm text-zinc-600">Tipo: {profile.tipo}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await updateProfile(profile.id, name, profile.avatar);
              setFeedback(result.message);
            });
          }}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Editar nome/foto"}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await removeProfile(profile.id);
              setFeedback(result.message);
            });
          }}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          Remover perfil
        </button>
      </div>

      {feedback ? <p className="mt-2 text-xs text-zinc-500">{feedback}</p> : null}
    </li>
  );
}
