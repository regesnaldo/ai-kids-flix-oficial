import { create } from "zustand";
import { useEffect, useRef } from "react";

export interface AgentEvent {
  type: string;
  content: Record<string, any>;
  sequence?: number;
  timestamp?: string;
}

interface SessionState {
  sessionId: number | null;
  events: AgentEvent[];
  status: "idle" | "active" | "error" | "connecting";

  connect: (sessionId: number) => void;
  disconnect: () => void;
  sendMessage: (agentId: string, message: string, userId: number) => Promise<void>;
  reset: () => void;
}

export const useAgentSession = create<SessionState>((set, get) => ({
  sessionId: null,
  events: [],
  status: "idle",

  connect: (sessionId: number) => {
    set({ sessionId, status: "connecting", events: [] });

    const eventSource = new EventSource(`/api/sessions/${sessionId}/events`);

    eventSource.onopen = () => {
      set({ status: "active" });
    };

    eventSource.onmessage = (e) => {
      const event: AgentEvent = JSON.parse(e.data);

      set((state) => ({
        events: [...state.events, event],
      }));

      if (event.type === "session.status_idle") {
        set({ status: "idle" });
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      set({ status: "error" });
      eventSource.close();
    };

    (get() as any)._eventSource = eventSource;
  },

  disconnect: () => {
    const { _eventSource } = get() as any;
    if (_eventSource) {
      _eventSource.close();
    }
    set({ sessionId: null, status: "idle", events: [] });
  },

  sendMessage: async (agentId: string, message: string, userId: number) => {
    const { sessionId } = get();

    const res = await fetch(`/api/agents/${agentId}/chat`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message }),
    });

    if (!res.ok) {
      throw new Error("Failed to send message");
    }

    const data = await res.json();

    if (!sessionId && data.sessionId) {
      get().connect(data.sessionId);
    }
  },

  reset: () => {
    get().disconnect();
    set({ sessionId: null, events: [], status: "idle" });
  },
}));

export function useAgentSessionCleanup() {
  const disconnect = useAgentSession((s) => s.disconnect);
  const hasDisconnected = useRef(false);

  useEffect(() => {
    return () => {
      if (!hasDisconnected.current) {
        disconnect();
        hasDisconnected.current = true;
      }
    };
  }, [disconnect]);
}
