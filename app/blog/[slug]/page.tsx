import {
  getPostBySlug,
  incrementView,
  getPostComments,
  addPostComment,
} from "../blog"
import { BlogPostContent } from "@/components/pages/blog/BlogPostContent"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getPostBySlug(slug)
  if (!data) return {}

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  const canonical = `${site}/blog/${data.slug}`

  return {
    title: data.title,
    description: data.excerpt,
    alternates: { canonical },
    openGraph: {
      title: data.title,
      description: data.excerpt,
      url: canonical,
      images: data.coverUrl ? [{ url: data.coverUrl }] : undefined,
      type: "article",
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
      <div className="relative min-h-screen bg-background pt-16 lg:pt-0 lg:pl-64">
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

  const postData = data

  void incrementView(slug)

  const commentsRaw = await getPostComments(postData.id)

  async function onSubmit(fd: FormData) {
    "use server"
    const message = String(fd.get("message") || "")
    await addPostComment({ postId: postData.id, message })
  }

  const postVM = {
    id: postData.id,
    slug: postData.slug,
    title: postData.title,
    subtitle: postData.subtitle,
    excerpt: postData.excerpt,
    content: postData.content,
    coverUrl: postData.coverUrl,
    publishedAt: postData.publishedAt,
    readingTime: postData.readingTime,
    views: postData.views,
    tags: postData.tags.map((t) => ({
      slug: t.tag.slug,
      name: t.tag.name,
    })),
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
    <BlogPostContent
      post={postVM}
      comments={commentVM}
      onSubmit={onSubmit}
    />
  )
}