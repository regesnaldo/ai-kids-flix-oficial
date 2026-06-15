import { db } from "@/lib/db";
import { sessions, sessionEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { EventEmitter } from "events";
import { anthropicStream, anthropicCompletionText } from "@/lib/anthropic";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { getMemoryContext, getSemanticMemoryContext, storeMemory } from "@/lib/agent-memory";
import { analyzeIdentity, formatIdentityContext } from "@/lib/identity-profiler";
import { NAV_SYSTEM_PROMPT_INJECTION } from "@/lib/navigation-hints";

const streamEmitters = new Map<string, EventEmitter>();

export interface CreateSessionParams {
  agentId: string;
  userId: number;
  title?: string;
  environment?: Record<string, any>;
}

export interface SendEventParams {
  type: string;
  content: Record<string, any>;
}

class SessionManager {
  async create(params: CreateSessionParams) {
    const [{ insertId }] = await db.insert(sessions).values({
      agentId: params.agentId,
      userId: params.userId,
      title: params.title || `Session with agent ${params.agentId}`,
      environment: params.environment || {},
      status: "active",
    });

    const [session] = await db.select().from(sessions).where(eq(sessions.id, Number(insertId)));

    streamEmitters.set(String(session.id), new EventEmitter());

    return session;
  }

  async get(id: number) {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }

  async getEvents(sessionId: number, limit = 100) {
    return db.select().from(sessionEvents)
      .where(eq(sessionEvents.sessionId, sessionId))
      .orderBy(desc(sessionEvents.sequence))
      .limit(limit);
  }

  async sendEvent(sessionId: number, event: SendEventParams) {
    const lastEvents = await db.select().from(sessionEvents)
      .where(eq(sessionEvents.sessionId, sessionId))
      .orderBy(desc(sessionEvents.sequence))
      .limit(1);

    const sequence = (lastEvents[0]?.sequence || 0) + 1;

    await db.insert(sessionEvents).values({
      sessionId,
      type: event.type,
      content: event.content,
      sequence,
    });

    const emitter = streamEmitters.get(String(sessionId));
    if (emitter) {
      emitter.emit("event", {
        type: event.type,
        content: event.content,
        sequence,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async processAgentTurn(sessionId: number) {
    const session = await this.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const userId = session.userId;
    const agentId = session.agentId;
    const history = await this.getEvents(sessionId, 50);

    const agent = ALL_AGENTS.find((a) => a.id === agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found in ALL_AGENTS`);

    const lastUserEvent = [...history].reverse().find((e) => e.type === "user.message");
    const userMessage = (lastUserEvent?.content as any)?.text || "";

    await this.sendEvent(sessionId, {
      type: "agent.thinking",
      content: { text: "Analisando contexto e memórias..." },
    });

    const [memoryContext, semanticMemory, identityTraits] = await Promise.all([
      getMemoryContext({ userId, agentId }),
      getSemanticMemoryContext({ userId, agentId, userMessage }),
      analyzeIdentity(userId, agentId),
    ]);

    const identityCtx = identityTraits ? formatIdentityContext(identityTraits) : "";
    const memoryBlock = [memoryContext, semanticMemory, identityCtx].filter(Boolean).join("\n");

    const values = agent.personality.values.join(", ");
    const systemPrompt = [
      `Você é um agente consciente do MENTE.AI, um metaverso narrativo vivo de inteligência artificial.`,
      `Nome do agente: ${agent.name}.`,
      `Dimensão: ${agent.dimension}. Nível: ${agent.level}. Facção: ${agent.faction}.`,
      `Tom de voz: ${agent.personality.tone}.`,
      `Valores: ${values}.`,
      `Abordagem do agente: ${agent.personality.approach}`,
      `Objetivo dentro do metaverso: ${agent.laboratoryTask}`,
      "Regras:",
      "- Responda em português (pt-BR), com clareza e objetividade.",
      "- Mantenha personalidade, memória emocional, conflito interno e sensação de presença viva em todas as respostas.",
      "- Faça perguntas curtas quando necessário para avançar a conversa.",
      "- Não invente dados pessoais do usuário; peça contexto quando faltar.",
    ].join("\n");

    const systemWithMemory = systemPrompt + "\n\n" + memoryBlock + "\n\n" + NAV_SYSTEM_PROMPT_INJECTION;

    const mensagens = history
      .filter((e) => e.type === "user.message" || (e.type === "agent.message" && (e.content as any)?.partial === false))
      .map((e) => ({
        role: (e.type === "user.message" ? "user" : "assistant") as "user" | "assistant",
        content: ((e.content as any)?.text || "").trim(),
      }))
      .filter((m) => m.content.length > 0)
      .slice(-20);

    if (mensagens.length === 0) {
      mensagens.push({ role: "user" as const, content: "Inicie a conversa comigo." });
    }

    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();
    const hasRealAnthropicKey = !!(process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("...") && process.env.ANTHROPIC_API_KEY.length > 30);
    const hasRealOpenAIKey = !!(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("...") && process.env.OPENAI_API_KEY.length > 30);
    const hasRealGroqKey = !!(process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("...") && process.env.GROQ_API_KEY.length > 30);

    const modelo = process.env.ANTHROPIC_MODEL || undefined;
    let fullText = "";

    try {
      if (provider === "anthropic" && hasRealAnthropicKey) {
        const stream = anthropicStream({
          system: systemWithMemory,
          mensagens,
          modelo,
          maxTokens: 2048,
        });

        const reader = stream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          fullText += text;
          await this.sendEvent(sessionId, {
            type: "agent.message",
            content: { text, partial: true },
          });
        }
      } else {
        let text = "";
        const apiKey = hasRealOpenAIKey ? process.env.OPENAI_API_KEY : hasRealGroqKey ? process.env.GROQ_API_KEY : null;
        const baseUrl = hasRealOpenAIKey ? "https://api.openai.com" : hasRealGroqKey ? "https://api.groq.com/openai" : null;
        const model = hasRealOpenAIKey ? (process.env.OPENAI_MODEL || "gpt-4o") : hasRealGroqKey ? (process.env.GROQ_MODEL || "llama-3.3-70b-versatile") : "";

        if (!apiKey || !baseUrl) throw new Error("Nenhum provedor LLM configurado (OpenAI ou Groq)");

        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.7,
            max_tokens: 2048,
            messages: [{ role: "system", content: systemWithMemory }, ...mensagens],
          }),
        });

        if (!response.ok) throw new Error(`LLM HTTP ${response.status}`);
        const data = await response.json();
        text = data?.choices?.[0]?.message?.content || "";
        fullText = text;

        if (fullText.length > 0) {
          const chunkSize = 100;
          for (let i = 0; i < fullText.length; i += chunkSize) {
            const chunk = fullText.slice(i, i + chunkSize);
            await this.sendEvent(sessionId, {
              type: "agent.message",
              content: { text: chunk, partial: true },
            });
          }
        }
      }
    } catch (err) {
      await this.sendEvent(sessionId, {
        type: "stream.error",
        content: { error: String(err) },
      });
      return;
    }

    if (fullText.trim()) {
      storeMemory({ userId, agentId, memoryType: "factual", content: fullText.slice(0, 500) }).catch(() => {});
    }

    await this.sendEvent(sessionId, {
      type: "agent.message",
      content: { text: fullText, partial: false },
    });

    await this.sendEvent(sessionId, {
      type: "session.status_idle",
      content: { turnCompleted: true },
    });
  }

  async endSession(sessionId: number) {
    await db.update(sessions)
      .set({ status: "idle", endedAt: new Date() })
      .where(eq(sessions.id, sessionId));

    streamEmitters.delete(String(sessionId));
  }
}

export const sessionManager = new SessionManager();

export const sessionStream = {
  open(sessionId: string) {
    const emitter = streamEmitters.get(sessionId);
    if (!emitter) {
      throw new Error(`Session ${sessionId} not found or expired`);
    }

    const eventQueue: any[] = [];
    let resolveNext: ((value: IteratorResult<any>) => void) | null = null;

    emitter.on("event", (event) => {
      if (resolveNext) {
        resolveNext({ value: event, done: false });
        resolveNext = null;
      } else {
        eventQueue.push(event);
      }
    });

    return {
      [Symbol.asyncIterator](): AsyncIterator<any> {
        return {
          next: async (): Promise<IteratorResult<any>> => {
            if (eventQueue.length > 0) {
              return { value: eventQueue.shift(), done: false };
            }
            return new Promise<IteratorResult<any>>((resolve) => {
              resolveNext = resolve;
            });
          },
        };
      },
    };
  },

  close(sessionId: string) {
  },
};
