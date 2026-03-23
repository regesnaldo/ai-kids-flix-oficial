"use client";

import { useState, useTransition } from "react";
import { updateBillingAddress } from "../../actions";

type BillingDetailsFormProps = {
  defaultEmail: string;
};

export default function BillingDetailsForm({ defaultEmail }: BillingDetailsFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [taxId, setTaxId] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await updateBillingAddress({
            name,
            email,
            address: `${address}, ${city}, ${country}`,
            cep,
            cpf: taxId || undefined,
          });
          setFeedback(result.message);
        });
      }}
    >
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome no cartão" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email para recibos" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua e número" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      <div className="grid gap-2 sm:grid-cols-3">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="País" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <input value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="CPF/CNPJ (opcional)" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />

      <button type="submit" disabled={isPending} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60">
        {isPending ? "Salvando..." : "Salvar alterações"}
      </button>
      <p className="text-xs text-zinc-500">Alterações valem para próximos pagamentos</p>
      {feedback ? <p className="text-xs text-zinc-500">{feedback}</p> : null}
    </form>
  );
}
