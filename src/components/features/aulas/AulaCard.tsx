import Image from 'next/image';

type Aula = {
  id: number;
  titulo: string;
  duracao: string;
  thumbnail: string;
};

export function AulaCard({ aula }: { aula: Aula }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 transition">
      <div className="relative aspect-video bg-zinc-900">
        <Image src={aula.thumbnail} alt={aula.titulo} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold">{aula.titulo}</h3>
        <p className="text-zinc-400 text-sm mt-1">{aula.duracao}</p>
      </div>
    </div>
  );
}
