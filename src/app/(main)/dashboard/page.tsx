import { AulaCard } from '@/components/features/aulas/AulaCard';

const aulasMock = [
  { id: 1, titulo: 'Introdução à IA', duracao: '45min', thumbnail: '/thumb1.jpg' },
  { id: 2, titulo: 'Machine Learning Básico', duracao: '60min', thumbnail: '/thumb2.jpg' },
] as const;

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Minhas Aulas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aulasMock.map((aula) => (
          <AulaCard key={aula.id} aula={aula} />
        ))}
      </div>
    </div>
  );
}
