"use client";

import { useEffect } from "react";

export function useRegisterPresence(agentId: string) {
  useEffect(() => {
    fetch("/api/presence", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    }).catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/presence", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      }).catch(() => {});
    }, 60000);

    return () => clearInterval(interval);
  }, [agentId]);
}
