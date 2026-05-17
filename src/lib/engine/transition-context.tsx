"use client"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface TransitionState {
  fromAgent: string
  toAgent: string
  reason: string
}

interface TransitionContextType {
  transition: TransitionState | null
  startTransition: (from: string, to: string, reason: string) => void
  endTransition: () => void
}

const TransitionContext = createContext<TransitionContextType>({
  transition: null,
  startTransition: () => {},
  endTransition: () => {},
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transition, setTransition] = useState<TransitionState | null>(null)

  const startTransition = useCallback((fromAgent: string, toAgent: string, reason: string) => {
    setTransition({ fromAgent, toAgent, reason })
  }, [])

  const endTransition = useCallback(() => {
    setTransition(null)
  }, [])

  return (
    <TransitionContext.Provider value={{ transition, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  return useContext(TransitionContext)
}
