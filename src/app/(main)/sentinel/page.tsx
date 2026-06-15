"use client"

// ⚠️ INTERNAL DEV TOOL — Sentinela Dashboard
// Monitora bots, universos, SEO e build em tempo real.
// Não é rota de usuário final. Acesso: /sentinel

import { useEffect, useState } from "react"

interface Bot {
  name: string
  status: string
  role: string
}

interface Project {
  universes: number
  universeList: string[]
  pages: number
  apis: number
  images: number
  seo: { sitemap: boolean; robots: boolean }
}

interface SentinelData {
  timestamp: string
  status: string
  bots: { total: number; list: Bot[] }
  project: Project
  build: string
}

export default function SentinelPage() {
  const [data, setData] = useState<SentinelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/sentinel/status")
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error(e)
        // TODO: [MENTE.AI] adicionar feedback visual ao usuário
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Atualiza a cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="min-h-screen bg-black text-white p-8">Carregando Sentinela...</div>
  if (!data) return <div className="min-h-screen bg-black text-white p-8">Erro ao carregar dados</div>

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-cyan-400">🤖</span> MENTE.AI SENTINELA
          </h1>
          <p className="text-gray-400">Monitoramento em Tempo Real</p>
          <p className="text-xs text-gray-500 mt-2">Última atualização: {new Date(data.timestamp).toLocaleTimeString()}</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-green-500/30">
            <div className="text-3xl mb-2">🤖</div>
            <div className="text-2xl font-bold text-green-400">{data.bots.total}</div>
            <div className="text-sm text-gray-400">Bots Online</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-blue-500/30">
            <div className="text-3xl mb-2">🌌</div>
            <div className="text-2xl font-bold text-blue-400">{data.project.universes}</div>
            <div className="text-sm text-gray-400">Universos</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/30">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-purple-400">{data.project.pages}</div>
            <div className="text-sm text-gray-400">Páginas</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30">
            <div className="text-3xl mb-2">🔌</div>
            <div className="text-2xl font-bold text-yellow-400">{data.project.apis}</div>
            <div className="text-sm text-gray-400">APIs</div>
          </div>
        </div>

        {/* Universos */}
        <div className="bg-gray-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">🌌 Universos Criados</h2>
          <div className="flex flex-wrap gap-2">
            {data.project.universeList.length > 0 ? (
              data.project.universeList.map((u) => (
                <span key={u} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                  {u.toUpperCase()}
                </span>
              ))
            ) : (
              <span className="text-gray-500">Nenhum universo criado ainda</span>
            )}
          </div>
        </div>

        {/* Bots */}
        <div className="bg-gray-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">🤖 Equipe de Bots</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.bots.list.map((bot) => (
              <div key={bot.name} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                <span className="text-green-400">●</span>
                <div>
                  <div className="font-medium text-sm">{bot.name}</div>
                  <div className="text-xs text-gray-500">{bot.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO & Images */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">🔍 SEO</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">sitemap.xml</span>
                <span className={data.project.seo.sitemap ? "text-green-400" : "text-red-400"}>
                  {data.project.seo.sitemap ? "✅ OK" : "❌ FALTA"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">robots.txt</span>
                <span className={data.project.seo.robots ? "text-green-400" : "text-red-400"}>
                  {data.project.seo.robots ? "✅ OK" : "❌ FALTA"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">🖼️ Imagens</h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{data.project.images}</div>
              <div className="text-gray-400">imagens de agentes</div>
            </div>
          </div>
        </div>

        {/* Build Status */}
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
            data.build === "passing" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            <span className="text-2xl">{data.build === "passing" ? "✅" : "❌"}</span>
            <span className="font-bold">Build: {data.build.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </main>
  )
}