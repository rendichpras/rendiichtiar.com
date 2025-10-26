import { PageTransition } from "@/components/animations/page-transition"
import { PostForm } from "@/components/pages/blog/PostForm"

import { db } from "@/db"
import { posts, postTags, tags } from "@/db/schema/schema"
import { eq } from "drizzle-orm"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const postRows = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      coverUrl: posts.coverUrl,
      status: posts.status,
    })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  const post = postRows[0]

  if (!post) {
    return (
      <PageTransition>
        <main className="relative min-h-screen bg-background pt-16 lg:pl-64 lg:pt-0">
          <section className="py-8 sm:py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
              <div className="rounded-2xl border border-border/30 p-6 text-sm text-muted-foreground">
                Artikel tidak ditemukan.
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
    )
  }

  const tagRows = await db
    .select({
      tagName: tags.name,
    })
    .from(postTags)
    .leftJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, post.id))

  const tagString = tagRows.map((t) => t.tagName).join(", ")

  const normalizedStatus = (post.status || "DRAFT").toUpperCase() as
    | "DRAFT"
    | "PUBLISHED"
    | "SCHEDULED"

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 lg:pl-64 lg:pt-0">
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
                  Edit Artikel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Perbarui konten, cover, status, dan tag.
                </p>
              </div>

              <div className="rounded-2xl border border-border/30 p-4 sm:p-6">
                <PostForm
                  initial={{
                    id: post.id,
                    title: post.title,
                    coverUrl: post.coverUrl ?? undefined,
                    content: post.content,
                    tags: tagString,
                    status: normalizedStatus,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
