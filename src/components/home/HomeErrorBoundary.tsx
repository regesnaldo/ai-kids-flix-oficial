'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class HomeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[HOME/ERROR]', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0a0a1a',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'monospace',
          }}
        >
          <p style={{ color: '#00FFFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            ⚡ ERRO DE CARGA
          </p>
          <p style={{ color: '#888', fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center', lineHeight: 1.5 }}>
            O sistema encontrou uma instabilidade ao carregar sua central.
            Tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              padding: '10px 24px',
              background: 'transparent',
              border: '1px solid rgba(0,255,255,0.4)',
              color: '#00FFFF',
              fontFamily: 'monospace',
              fontSize: '11px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            REINICIAR
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
