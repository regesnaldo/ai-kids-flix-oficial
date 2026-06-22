import { NextRequest, NextResponse } from "next/server"
import { execSync } from "child_process"

const PROFILES = ["coder", "research", "writer", "data", "ops", "default"] as const
const WSL_DISTRO = "Ubuntu"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, prompt } = body as { profile?: string; prompt?: string }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 })
    }

    const resolvedProfile = PROFILES.includes(profile as any) ? profile : "default"
    const hermesCmd = resolvedProfile === "default" ? "hermes" : resolvedProfile

    const shellCmd = [
      `wsl -d ${WSL_DISTRO} -- bash -c`,
      `'export PATH="$HOME/.local/bin:$HOME/.hermes/hermes-agent:$PATH"`,
      `&& ${hermesCmd} chat -q ${JSON.stringify(prompt)} -Q 2>&1'`,
    ].join(" ")

    const output = execSync(shellCmd, { timeout: 120000, encoding: "utf-8" })
    const lines = output.split("\n").filter(l => !l.startsWith("session_id:"))
    const content = lines.join("\n").trim()
    const sessionMatch = output.match(/session_id:\s*(\S+)/)

    return NextResponse.json({
      content: content || output.trim(),
      sessionId: sessionMatch?.[1] ?? "",
      profile: resolvedProfile,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
