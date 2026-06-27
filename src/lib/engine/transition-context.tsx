"use client"
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

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

  const contextValue = useMemo(() => ({ transition, startTransition, endTransition }), [transition, startTransition, endTransition])

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  return useContext(TransitionContext)
}
