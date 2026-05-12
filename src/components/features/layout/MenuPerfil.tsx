'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Aulas', href: '/aulas' },
  { label: 'Perfil', href: '/perfil' },
] as const;

export function MenuPerfil() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 h-screen sticky top-16 overflow-y-auto bg-gray-900">
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 px-4 rounded transition ${
                    active ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-zinc-200'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
