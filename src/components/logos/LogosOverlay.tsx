'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'

type Phase = 'loading' | 'question' | 'evaluating' | 'approved' | 'failed'

export function LogosOverlay() {
  const {
    logosActive,
    logosEpisodeContext,
    logosAttempts,
    setLogosActive,
    incrementLogosAttempts,
    resetLogos,
  } = useAppStore()

  const [phase, setPhase] = useState<Phase>('question')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  const fetchQuestion = useCallback(async () => {
    if (!logosEpisodeContext) return
    setPhase('loading')
    setError('')
    setAnswer('')
    try {
      const res = await fetch('/api/logos/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeContext: logosEpisodeContext }),
      })
      const data = await res.json()
      if (data.question) {
        setQuestion(data.question)
        setPhase('question')
      } else {
        setError('Erro ao gerar pergunta. Tentando novamente...')
        setPhase('question')
      }
    } catch {
      setError('Erro de conexão. Tentando novamente...')
      setPhase('question')
    }
  }, [logosEpisodeContext])

  useEffect(() => {
    if (logosActive && logosEpisodeContext) {
      fetchQuestion()
    }
  }, [logosActive, logosEpisodeContext, fetchQuestion])

  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) return
    setPhase('evaluating')
    setError('')

    try {
      const res = await fetch('/api/logos/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer: answer.trim(),
          episodeContext: logosEpisodeContext,
        }),
      })
      const data = await res.json()

      if (data.verdict === 'APROVADO') {
        setPhase('approved')
        setTimeout(() => resetLogos(), 1500)
      } else {
        const attempts = logosAttempts + 1
        incrementLogosAttempts()
        if (attempts >= 3) {
          setPhase('failed')
          setTimeout(() => resetLogos(), 2000)
        } else {
          fetchQuestion()
        }
      }
    } catch {
      setError('Erro ao avaliar resposta.')
      setPhase('question')
    }
  }, [answer, question, logosEpisodeContext, logosAttempts, incrementLogosAttempts, resetLogos, fetchQuestion])

  if (!logosActive) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {phase === 'loading' && (
        <p style={{ color: '#ffffff', fontSize: '1.2rem' }}>Aguarde...</p>
      )}

      {phase === 'question' && (
        <>
          <p
            style={{
              color: '#ffffff',
              fontSize: '1.4rem',
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: '600px',
              marginBottom: '2rem',
            }}
          >
            {question}
          </p>

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
          )}

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            placeholder="Sua resposta..."
            style={{
              width: '100%',
              maxWidth: '500px',
              minHeight: '100px',
              padding: '1rem',
              fontSize: '1rem',
              color: '#ffffff',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '1.5rem',
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            style={{
              padding: '0.75rem 2.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: answer.trim() ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: answer.trim() ? 'pointer' : 'not-allowed',
              opacity: answer.trim() ? 1 : 0.5,
              transition: 'background-color 0.2s',
            }}
          >
            Responder
          </button>

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
            Tentativa {logosAttempts + 1} de 3
          </p>
        </>
      )}

      {phase === 'evaluating' && (
        <p style={{ color: '#ffffff', fontSize: '1.2rem' }}>Avaliando...</p>
      )}

      {phase === 'approved' && (
        <p style={{ color: '#4ade80', fontSize: '1.3rem', fontWeight: 600 }}>
          Compreendido. Prosseguindo...
        </p>
      )}

      {phase === 'failed' && (
        <p style={{ color: '#fbbf24', fontSize: '1.3rem', fontWeight: 600 }}>
          Seguiremos em frente. Revisão pendente.
        </p>
      )}
    </div>
  )
}
