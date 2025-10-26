import {
  getPostBySlug,
  incrementView,
  getPostComments,
  addPostComment,
} from "../blog"
import { BlogPostContent } from "@/components/pages/blog/BlogPostContent"
import { PostJsonLd } from "@/components/pages/blog/PostJsonLd"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const revalidate = 60

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined

  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }

  if (pathOrUrl.startsWith("/")) {
    return `${SITE_URL}${pathOrUrl}`
  }

  return `${SITE_URL}/${pathOrUrl}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getPostBySlug(slug)
  if (!data) {
    return {}
  }

  const canonical = `${SITE_URL}/blog/${data.slug}`

  const raw = stripMarkdown(data.content ?? "")
  const description = raw.length > 160 ? raw.slice(0, 159).trimEnd() + "…" : raw

  const ogImage = absoluteUrl(data.coverUrl) || absoluteUrl("/og-image.png")

  return {
    title: data.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: data.title,
      description,
      url: canonical,
      type: "article",
      siteName: "Rendi Ichtiar Prasetyo",
      locale: "id_ID",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: data.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      creator: "@rendiichtiar",
      site: "@rendiichtiar",
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getPostBySlug(slug)

  if (!data || data.status !== "PUBLISHED") {
    return (
      <div className="relative min-h-screen bg-background pt-16 text-foreground lg:pt-0 lg:pl-64">
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="rounded-2xl border border-border/30 p-6 text-sm text-muted-foreground">
              Artikel tidak ditemukan.
            </div>
          </div>
        </section>
      </div>
    )
  }

  const post = data

  void incrementView(slug)

  const commentsRaw = await getPostComments(post.id)

  async function onSubmit(fd: FormData) {
    "use server"
    const message = String(fd.get("message") || "")
    await addPostComment({ postId: post.id, message })
  }

  const safeTags = post.tags
    .filter((t) => t.tag.slug && t.tag.name)
    .map((t) => ({
      slug: t.tag.slug as string,
      name: t.tag.name as string,
    }))

  const postVM = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    content: post.content,
    coverUrl: post.coverUrl,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    views: post.views,
    tags: safeTags,
  }

  const commentVM = commentsRaw.map((c) => ({
    id: c.id,
    createdAt: c.createdAt,
    message: c.message,
    user: { name: c.user?.name ?? null },
    parentId: c.parentId,
    rootId: c.rootId,
  }))

  return (
    <>
      <PostJsonLd post={postVM} />
      <BlogPostContent post={postVM} comments={commentVM} onSubmit={onSubmit} />
    </>
  )
}
