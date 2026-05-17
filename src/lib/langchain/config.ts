import { ChatOpenAI } from '@langchain/openai'

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'

export const createAgentLLM = () => new ChatOpenAI({
  modelName: 'deepseek-chat',
  openAIApiKey: process.env.DEEPSEEK_API_KEY,
  configuration: {
    baseURL: DEEPSEEK_BASE_URL,
  },
  temperature: 0.7,
  maxTokens: 1000,
})
