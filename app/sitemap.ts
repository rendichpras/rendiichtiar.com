import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"
import { locales } from "@/i18n/routing"
import { getAllPosts } from "@/lib/actions/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/guestbook", "/contact", "/playground"]

  const routes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => {
      const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] =
        path === "" ? "weekly" : path === "/guestbook" ? "daily" : "monthly"

      const priority: MetadataRoute.Sitemap[number]["priority"] =
        path === "" ? 1 : path === "/guestbook" ? 0.9 : 0.8

      return {
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: new Date(),
        changeFrequency,
        priority,
      }
    })
  )

  let posts: any[] = []
  try {
    const res = await getAllPosts(true, undefined, 1, 1000)
    posts = res.posts
  } catch (e) {
    console.warn("Could not fetch posts for sitemap, skipping database links.")
  }

  const blogIndexRoutes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: absoluteUrl(`/${locale}/blog`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: absoluteUrl(`/${locale}/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  )

  return [...routes, ...blogIndexRoutes, ...blogRoutes]
}
