"use client";

import { useEffect, useState } from "react";
import { GamificationProvider } from "@/components/gamification/GamificationProvider";

interface SessionUser {
  id: number;
  email: string | null;
  name: string | null;
}

/**
 * Client wrapper that fetches the user session and mounts
 * the GamificationProvider (HUD + conquest notifications).
 */
export default function GamificationWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.authenticated && data?.user) {
          setSession(data.user);
        }
      } catch {}
    })();
  }, []);

  return (
    <GamificationProvider userId={session?.id} email={session?.email}>
      {children}
    </GamificationProvider>
  );
}
