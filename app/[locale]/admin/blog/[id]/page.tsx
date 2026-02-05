import { getPostById } from "@/lib/actions/blog"
import { notFound } from "next/navigation"
import AdminBlogEditContent from "@/components/pages/admin/blog/AdminBlogEditContent"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    return notFound()
  }

  return <AdminBlogEditContent post={post} />
}
