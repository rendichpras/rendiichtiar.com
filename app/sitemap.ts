import { MetadataRoute } from "next"
import { db } from "@/db"
import { posts } from "@/db/schema/schema"
import { eq, desc } from "drizzle-orm"
import { SITE_URL } from "@/lib/site"

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date(),
      changeFrequency: "never" as ChangeFrequency,
      priority: 0.6,
    },
  ]

  const postRows = await db
    .select({
      slug: posts.slug,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, "PUBLISHED"))
    .orderBy(desc(posts.publishedAt))

  const postRoutes: MetadataRoute.Sitemap = postRows.map((p) => {
    const ts = p.updatedAt ?? p.publishedAt ?? new Date()
    return {
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: ts.toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    }
  })

  return [
    ...staticRoutes.map((r) => ({
      ...r,
      lastModified: r.lastModified.toISOString(),
    })),
    ...postRoutes,
  ]
}
