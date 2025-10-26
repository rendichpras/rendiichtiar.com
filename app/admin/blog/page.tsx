import { PageTransition } from "@/components/animations/page-transition"
import { BlogList } from "@/components/pages/admin/blog/BlogList"

import { db } from "@/db"
import { posts, postTags, tags } from "@/db/schema/schema"
import { desc, inArray, eq } from "drizzle-orm"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminBlogListPage() {
  const rawPosts = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      subtitle: posts.subtitle,
      excerpt: posts.excerpt,
      coverUrl: posts.coverUrl,
      status: posts.status,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
      readingTime: posts.readingTime,
      views: posts.views,
    })
    .from(posts)
    .orderBy(posts.status, desc(posts.updatedAt))

  if (rawPosts.length === 0) {
    return (
      <PageTransition>
        <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <BlogList posts={[]} />
          </div>
        </section>
      </PageTransition>
    )
  }

  const postIds = rawPosts.map((p) => p.id)

  const tagRows = await db
    .select({
      postId: postTags.postId,
      tagId: tags.id,
      tagSlug: tags.slug,
      tagName: tags.name,
    })
    .from(postTags)
    .leftJoin(tags, eq(tags.id, postTags.tagId))
    .where(inArray(postTags.postId, postIds))

  const tagMap = new Map<
    string,
    { tag: { id: string; slug: string; name: string } }[]
  >()

  for (const row of tagRows) {
    if (!row.tagId || !row.tagSlug || !row.tagName) continue

    const arr = tagMap.get(row.postId) ?? []
    arr.push({
      tag: {
        id: row.tagId,
        slug: row.tagSlug,
        name: row.tagName,
      },
    })
    tagMap.set(row.postId, arr)
  }

  const postsWithTags = rawPosts.map((p) => ({
    ...p,
    tags: tagMap.get(p.id) ?? [],
  }))

  return (
    <PageTransition>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <BlogList posts={postsWithTags} />
        </div>
      </section>
    </PageTransition>
  )
}
