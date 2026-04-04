'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(30);
  const intervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);

  useEffect(() => {
    void fetch('/api/auth/logout', { method: 'POST' });

    intervalRef.current = globalThis.setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (seconds > 0) return;
    if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
    intervalRef.current = null;
    void fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/'));
  }, [seconds, router]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Image
        src="/images/agentes/nexus.png"
        alt="MENTE.AI"
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/55" />

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="text-white font-black text-2xl tracking-tight">
          MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="bg-transparent border border-white text-white px-5 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Entrar
        </button>
      </header>

      <main className="relative z-10 px-6 md:px-12 pt-8 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-10">
          <h1 className="text-2xl font-bold text-zinc-800">Já vai?</h1>
          <p className="mt-4 text-zinc-700 leading-relaxed">
            Você não precisa sair do MENTE.AI todas as vezes. Isso só é necessário quando você
            está usando um computador compartilhado ou público.
          </p>
          <p className="mt-4 text-zinc-700">
            Você irá para a MENTE.AI em <span className="font-bold">{Math.max(0, seconds)}</span>{' '}
            segundos.
          </p>
          <button
            type="button"
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/'); }}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded font-semibold text-lg transition"
          >
            Até mais
          </button>
        </div>
      </main>
    </div>
  );
}




