import { createAgentLLM } from './config'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

export async function runAgent(
  systemPrompt: string,
  userMessage: string,
  history: { role: 'user' | 'assistant', content: string }[] = []
): Promise<string> {
  try {
    const llm = createAgentLLM()
    const messages = [
      new SystemMessage(systemPrompt),
      ...history.map(h =>
        h.role === 'user'
          ? new HumanMessage(h.content)
          : new SystemMessage(h.content)
      ),
      new HumanMessage(userMessage),
    ]
    const response = await llm.invoke(messages)
    return response.content as string
  } catch (error) {
    console.error('[AgentRunner] error:', error)
    throw new Error('Agent unavailable')
  }
}
