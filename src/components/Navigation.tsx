'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: "Início", href: "/" },
    { label: "Agentes", href: "/agentes" },
    { label: "Laboratório", href: "/laboratorio/simulador" },
    { label: "Explorar", href: "/explorar" },
  ];

  return (
    <nav className="flex gap-6">
      {navItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href} 
          className={`text-sm font-medium transition-colors ${
            pathname === item.href 
              ? "text-white border-b-2 border-red-600 pb-1" 
              : "text-white/80 hover:text-white"
          }`}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
