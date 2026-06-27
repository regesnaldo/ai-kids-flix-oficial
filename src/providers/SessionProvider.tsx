"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface SessionUser {
  id: number;
  name: string | null;
  email: string | null;
  plan: "FREE" | "BASIC" | "PREMIUM" | "FAMILY" | null;
  planStatus: "active" | "canceled" | "past_due" | "trialing" | null;
}

export interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  isLoading: true,
  error: null,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          if (res.status === 401) {
            if (!cancelled) {
              setUser(null);
              setIsLoading(false);
            }
            return;
          }
          throw new Error(`Session fetch failed: ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled) {
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load session");
          setIsLoading(false);
        }
      }
    }

    fetchSession();
    return () => { cancelled = true; };
  }, []);

  const sessionValue = useMemo(() => ({ user, isLoading, error }), [user, isLoading, error]);

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
