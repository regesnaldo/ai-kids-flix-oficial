"use client";

import { useState, useCallback } from "react";
import type { Agent } from "@/types/agent";
import { getAgentById, getAgents, DEFAULT_AGENT_ID } from "@/services/agent.service";

export function useAgent() {
  const [activeAgentId, setActiveAgentId] = useState<string>(DEFAULT_AGENT_ID);

  const activeAgent: Agent | undefined = getAgentById(activeAgentId);
  const agents = getAgents();

  const selectAgent = useCallback((id: string) => {
    setActiveAgentId(id);
  }, []);

  return {
    activeAgent,
    activeAgentId,
    agents,
    selectAgent,
  };
}
