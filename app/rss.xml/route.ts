import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const site = process.env.NEXTAUTH_URL;

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: {
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
    },
  });

  const items = posts
    .map((p) => {
      const pubDate = p.publishedAt
        ? new Date(p.publishedAt).toUTCString()
        : new Date().toUTCString();

      const desc = getExcerptFromMarkdown(p.content, 180);

      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog</title>
    <link>${site}/blog</link>
    <description>RSS Feed</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/[*_~>#]/g, "");
}

function getExcerptFromMarkdown(md: string, max = 180) {
  const plain = stripMarkdown(md).replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max - 1).trimEnd() + "…";
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
    )[c]!;
  });
}
