import type { Metadata } from "next"
import messages from "@/messages/id.json"
import { getPosts } from "../blog/blog"
import { BlogContent } from "@/components/pages/blog/BlogContent"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: `Blog | Rendi Ichtiar Prasetyo`,
  description: messages.pages.blog.list.subtitle,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Blog | Rendi Ichtiar Prasetyo`,
    description: messages.pages.blog.list.subtitle,
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "Rendi Ichtiar Prasetyo",
    locale: "id_ID",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Blog Rendi Ichtiar Prasetyo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | Rendi Ichtiar Prasetyo`,
    description: messages.pages.blog.list.subtitle,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>
}) {
  const resolved = (await searchParams) ?? {}

  const tag = resolved.tag
  const page = Number(resolved.page ?? 1)

  if (page > 1) {
    ;(metadata as any).robots = { index: false, follow: true }
    ;(metadata as any).alternates = {
      canonical: `https://rendiichtiar.com/blog?page=${page}`,
    }
  }

  const { items, hasMore } = await getPosts({
    tag,
    page,
    pageSize: 10,
  })

  return <BlogContent items={items as any} page={page} hasMore={hasMore} />
}
