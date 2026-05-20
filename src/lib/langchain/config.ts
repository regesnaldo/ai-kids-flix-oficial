import { ChatOpenAI } from '@langchain/openai'

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

export const createAgentLLM = () => new ChatOpenAI({
  modelName: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  apiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: GROQ_BASE_URL,
  },
  temperature: 0.7,
  maxTokens: 1000,
})
