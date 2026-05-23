import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema-extensions";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug obrigatório" }, { status: 400 });

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (!post) return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-kids-flix.vercel.app";
  const text = post.whatsappText || `🤖 *${post.title}*\n\n${post.summary?.slice(0, 200) || ""}\n\nLeia completo + ganhe XP:\n${siteUrl}/blog/${post.slug}\n\n_via MENTE.AI_`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  return NextResponse.json({ url: waUrl, text });
}
