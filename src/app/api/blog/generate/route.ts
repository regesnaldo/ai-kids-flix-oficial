import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, type NewBlogPost } from "@/lib/db/schema-extensions";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const CATEGORIES = ["IA Geral", "Negócios", "Crianças", "Ética", "Futuro", "Ferramentas"];
const AGENTS = ["nexus", "cipher", "kaos", "aurora"];

export async function POST(request: NextRequest) {
  try {
    // Auth — only from cron or admin
    const auth = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!auth || auth !== `Bearer ${cronSecret}`) {
      // Fallback: allow admin users
      const token = request.cookies.get("mente_ai_token")?.value;
      if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    if (!apiKey) return NextResponse.json({ error: "GROQ_API_KEY não configurada" }, { status: 500 });

    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const agentId = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const agentName = agentId.toUpperCase();

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.85,
        max_tokens: 2048,
        response_format: { type: "json_object" },
        messages: [{
          role: "system",
          content: `Você é editor-chefe do MENTE.AI, um metaverso educacional de IA.
Escreva posts em PORTUGUÊS BRASILEIRO, estilo cinematográfico e acessível.
O agente ${agentName} irá comentar o post. Responda APENAS em JSON.`,
        }, {
          role: "user",
          content: `Gere 1 post sobre IA na categoria "${category}" para hoje.
Retorne EXATAMENTE este JSON:
{
  "title": "título cinematográfico (max 90 chars)",
  "summary": "resumo 60 palavras",
  "content": "conteúdo completo em PT-BR, parágrafos com \n\n, 300-600 palavras, didático e cinematográfico",
  "openingScene": "cena de abertura visual, atmosférica, 100-150 caracteres",
  "agentCommentary": "comentário do agente ${agentName} sobre o tema, 100-250 caracteres, no tom do agente",
  "interactivePause": {
    "pergunta": "pergunta reflexiva sobre o tema",
    "opcoes": ["opção A", "opção B", "opção C"],
    "continuacoes": ["continuação A", "continuação B", "continuação C"]
  },
  "whatsappText": "versão WhatsApp 60 palavras com link mente.ai/blog/SLUG"
}`,
        }],
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "Groq retornou vazio" }, { status: 502 });

    const parsed = JSON.parse(content);
    const slug = parsed.title
      ?.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || crypto.randomBytes(6).toString("hex");

    await db.insert(blogPosts).values({
      id: crypto.randomUUID(),
      slug,
      title: parsed.title || "Post do dia",
      summary: parsed.summary || "",
      content: parsed.content || "",
      openingScene: parsed.openingScene || null,
      category,
      agentId,
      agentCommentary: parsed.agentCommentary || null,
      interactivePause: parsed.interactivePause || null,
      ageRating: category === "Crianças" ? "all" : "teen",
      xpReward: 5,
      whatsappText: parsed.whatsappText || null,
      generatedBy: "groq",
    } satisfies NewBlogPost);

    return NextResponse.json({ success: true, slug, title: parsed.title });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)).limit(20);
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
