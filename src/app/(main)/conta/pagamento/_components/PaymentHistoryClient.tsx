"use client";

import { useMemo, useState } from "react";
import type { PaymentHistoryItem } from "../../actions";

type PaymentHistoryClientProps = {
  items: PaymentHistoryItem[];
};

export default function PaymentHistoryClient({ items }: PaymentHistoryClientProps) {
  const [months, setMonths] = useState<3 | 6 | 12>(12);

  const filtered = useMemo(() => items.slice(0, months), [items, months]);

  const csv = useMemo(() => {
    const header = "Data,Valor,Plano,Status,Recibo";
    const lines = filtered.map((item) => [item.date, item.amount, item.plan, item.status, item.receiptUrl ?? ""].join(","));
    return [header, ...lines].join("\n");
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-700">Filtro:</span>
        {[3, 6, 12].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMonths(value as 3 | 6 | 12)}
            className={`rounded-lg px-3 py-1.5 font-medium ${
              months === value ? "bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {value} meses
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-600">Nenhum pagamento registrado</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-2 py-2">Data</th>
                <th className="px-2 py-2">Valor</th>
                <th className="px-2 py-2">Plano</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Recibo (PDF)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100">
                  <td className="px-2 py-2">{item.date}</td>
                  <td className="px-2 py-2">{item.amount}</td>
                  <td className="px-2 py-2">{item.plan}</td>
                  <td className="px-2 py-2">{item.status}</td>
                  <td className="px-2 py-2">
                    {item.receiptUrl ? (
                      <a href={item.receiptUrl} className="text-zinc-900 underline">
                        Baixar
                      </a>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
        download="historico-pagamento.csv"
        className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        Baixar todos (CSV)
      </a>
    </div>
  );
}
