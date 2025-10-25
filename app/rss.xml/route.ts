import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
    const posts = await prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 20,
        select: { title: true, excerpt: true, slug: true, publishedAt: true },
    })
    const items = posts.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt!).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>
  `).join("")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <title>Blog</title>
    <link>${site}/blog</link>
    <description>RSS Feed</description>
    ${items}
  </channel></rss>`

    return new NextResponse(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}

function escapeXml(s: string) {
    return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" } as any)[c])
}
