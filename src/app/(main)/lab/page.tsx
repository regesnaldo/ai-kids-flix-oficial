'use client'

import { useRouter } from 'next/navigation'

export default function LabPage() {
  const router = useRouter()

  return (
    <main
      style={{
        background: '#000000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <p
        style={{
          color: '#00f5ff',
          fontSize: '1.25rem',
          fontFamily: 'var(--font-mono, monospace)',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        MENTE.AI Laboratory
      </p>
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono, monospace)',
          textAlign: 'center',
        }}
      >
        Coming Soon
      </p>
      <button
        onClick={() => router.back()}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          background: 'transparent',
          border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: '999px',
          color: '#e8e8ff',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono, monospace)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'background 220ms ease, border-color 220ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.7)'; e.currentTarget.style.background = 'rgba(0,245,255,0.08)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
      >
        Go Back
      </button>
    </main>
  )
}
