'use client'
import { useState, useEffect } from 'react'
import { initialLabState } from '@/cognitive/core/labState'
import { applyEmotionSensor } from '@/cognitive/sensors/emotionSensor'

export default function SimuladorPage() {
  const [labState, setLabState] = useState(initialLabState)
  const [input, setInput] = useState('')
  const [pulse, setPulse] = useState(1)
const [speed, setSpeed] = useState(3000)
const [intensity, setIntensity] = useState(0.6)
  const [color, setColor] = useState('#00ffcc')

  useEffect(() => {
    const interval = setInterval(() => {
    setPulse(p => (p === 1 ? 1.15 : 1))
  }, speed)
    return () => clearInterval(interval)
  }, [])

  const detectEmotionColor = (text: string) => {
  const t = text.toLowerCase()
  
  if (t.includes('triste') || t.includes('sozinho')) {
    setSpeed(6000)
    setIntensity(0.3)
    return '#1e3a8a'
  }
  if (t.includes('raiva') || t.includes('ódio')) {
    setSpeed(1000)
    setIntensity(0.9)
    return '#dc2626'
  }
  if (t.includes('curioso') || t.includes('por que')) {
    setSpeed(2000)
    setIntensity(0.7)
    return '#9333ea'
  }
  if (t.includes('feliz') || t.includes('animado')) {
    setSpeed(2500)
    setIntensity(0.8)
    return '#16a34a'
  }
  
  // Default
  setSpeed(3000)
  setIntensity(0.6)
  return '#00ffcc'
}

  

const sendMessage = () => {
    if (!input) return

    const newState = applyEmotionSensor(labState, input)
    setLabState(newState)

    const emotionColor = detectEmotionColor(input)
    setColor(emotionColor)

    setInput('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center,#020617 0%, #000 70%)',
      color: '#e5fff7',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        width: '1000px',
        height: '1000px',
        background: 'radial-gradient(circle, rgba(0,255,204,0.4), transparent)',
        top: '-300px',
        left: '50%',
        transform: 'translateX(-50%) scale(1)',
        transition: 'all 2s ease',
        opacity: intensity
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        paddingTop: '120px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '300',
          letterSpacing: '6px'
        }}>
          Laboratório de Inteligência Viva
        </h1>

        <input
          style={{
            marginTop: '60px',
            width: '100%',
            padding: '20px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '12px'
          }}
          value={input}
          onChange={(e) => {
  const text = e.target.value
  setInput(text)
  setColor(detectEmotionColor(text))
}}
          placeholder='Expresse seu estado...'
        />

        <button
          onClick={sendMessage}
          style={{
            marginTop: '20px',
            padding: '18px 40px',
            background: color,
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            fontWeight: '600'
          }}
        >
          Conectar Consciência
        </button>
      </div>
    </div>
  )
}




