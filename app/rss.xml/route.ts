import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts } from "@/db/schema/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const site = process.env.NEXT_PUBLIC_URL ?? ""

  const rows = await db
    .select({
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, "PUBLISHED"))
    .orderBy(desc(posts.publishedAt))
    .limit(20)

  const items = rows
    .map((p) => {
      const pubDate = p.publishedAt
        ? new Date(p.publishedAt).toUTCString()
        : new Date().toUTCString()

      const descText = getExcerptFromMarkdown(p.content, 180)

      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(descText)}</description>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog</title>
    <link>${site}/blog</link>
    <description>RSS Feed</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}

function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/[*_~>#]/g, "")
}

function getExcerptFromMarkdown(md: string, max = 180) {
  const plain = stripMarkdown(md).replace(/\s+/g, " ").trim()
  if (plain.length <= max) return plain
  return plain.slice(0, max - 1).trimEnd() + "…"
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => {
    return (
      {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      } as Record<string, string>
    )[c]!
  })
}
