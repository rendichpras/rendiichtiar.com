import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { locales } from "@/i18n/routing"
import { getAllPosts } from "@/lib/actions/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const staticPaths = ["", "/about", "/guestbook", "/contact", "/playground"]

  const routes = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (path === ""
        ? "weekly"
        : path === "/guestbook"
          ? "daily"
          : "monthly") as "weekly" | "daily" | "monthly",
      priority: path === "" ? 1 : 0.8,
    }))
  )

  const { posts } = await getAllPosts(true, undefined, 1, 1000)

  const blogIndexRoutes = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/blog`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  const blogRoutes = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  )

  return [...routes, ...blogIndexRoutes, ...blogRoutes]
}
