import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { locales } from "@/i18n/routing"

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

  return routes
}
