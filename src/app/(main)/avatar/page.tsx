'use client'

import dynamic from 'next/dynamic'

const AvatarCanvas = dynamic(
  () => import('./AvatarCanvas'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        backgroundColor: '#0a0a1a', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(59,130,246,0.3)', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite' }} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>NEXUS</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Carregando avatar...</p>
      </div>
    )
  }
)

export default function AvatarPage() {
  return (
    <div style={{ backgroundColor: '#0a0a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <AvatarCanvas />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>NEXUS</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Arquetipo: Conector · Facção: Balance</p>
    </div>
  )
}
