'use client';
import Link from 'next/link';

export default function Navbar() {
  const linkStyle = { color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', opacity: '0.8' };
  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 4%', height: '70px', background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Link href="/home" style={{ color: '#E50914', fontSize: '1.8rem', fontWeight: 'bold', textDecoration: 'none', marginRight: '40px' }}>MENTE.AI</Link>
      
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center', flex: 1 }}>
        <Link href="/home" style={linkStyle}>Início</Link>
        <Link href="/planos" style={{ ...linkStyle, opacity: 1, borderBottom: '2px solid #E50914', paddingBottom: '5px' }}>Explorar</Link>
        <Link href="/minha-lista" style={linkStyle}>Minha Lista</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.5)', padding: '5px 15px', borderRadius: '4px' }}>Entrar</Link>
      </div>
    </nav>
  );
}
