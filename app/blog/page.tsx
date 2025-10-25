import { getPosts } from "../blog/blog"
import { BlogContent } from "@/components/pages/blog/BlogContent"

export const revalidate = 60
export const dynamic = "force-static"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>
}) {
  const sp = await searchParams
  const tag = sp?.tag
  const page = Number(sp?.page ?? 1)
  const { items, hasMore } = await getPosts({ tag, page, pageSize: 10 })

  return (
    <BlogContent
      items={items as any}
      page={page}
      hasMore={hasMore}
      tag={tag}
    />
  )
}
