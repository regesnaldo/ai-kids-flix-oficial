import { defineConfig } from 'prisma'

export default defineConfig({
  datasource: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./dev.db'
  }
})
