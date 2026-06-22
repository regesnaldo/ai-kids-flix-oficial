export type HermesProfile = "coder" | "research" | "writer" | "data" | "ops" | "default"

export interface HermesRequest {
  profile: HermesProfile
  prompt: string
}

export interface HermesResponse {
  content: string
  sessionId: string
  profile: HermesProfile
}

const WSL_BRIDGE = `wsl -d Ubuntu -- bash -c 'export PATH="$HOME/.local/bin:$HOME/.hermes/hermes-agent:$PATH" && echo "${"PROMPT"}" | timeout 120 hermes chat -q "${"PROMPT"}" -Q 2>&1 | tail -n +2'`

export async function queryHermes(request: HermesRequest): Promise<HermesResponse> {
  const { profile, prompt } = request

  if (typeof window === "undefined") {
    const { execSync } = await import("child_process")
    const profilePrefix = profile === "default" ? "hermes" : profile
    const cmd = `wsl -d Ubuntu -- bash -c 'export PATH="$HOME/.local/bin:$HOME/.hermes/hermes-agent:$PATH" && ${profilePrefix} chat -q ${JSON.stringify(prompt)} -Q 2>&1'`

    try {
      const output = execSync(cmd, { timeout: 120000, encoding: "utf-8" })
      const lines = output.split("\n").filter(l => !l.startsWith("session_id:"))
      const content = lines.join("\n").trim()
      const sessionMatch = output.match(/session_id:\s*(\S+)/)
      return {
        content: content || output.trim(),
        sessionId: sessionMatch?.[1] ?? "",
        profile,
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      return { content: `Hermes error: ${msg}`, sessionId: "", profile }
    }
  }

  const response = await fetch("/api/hermes/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const err = await response.text()
    return { content: `API error (${response.status}): ${err}`, sessionId: "", profile }
  }

  return response.json()
}
