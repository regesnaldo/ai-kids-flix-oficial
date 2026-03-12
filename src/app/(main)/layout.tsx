'use client';
import Navbar from '@/componentes/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#0a0a1a', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <Navbar />
      <main style={{ paddingTop: '70px', width: '100%', margin: 0 }}>
        {children}
      </main>
    </div>
  );
}
