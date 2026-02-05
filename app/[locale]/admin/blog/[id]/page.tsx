import { getPostById } from "@/lib/actions/blog"
import { notFound } from "next/navigation"
import AdminBlogEditContent from "@/components/pages/admin/blog/AdminBlogEditContent"
import { requireAdmin } from "@/lib/auth/require-admin"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id, locale } = await params
  setRequestLocale(locale)
  await requireAdmin()
  const post = await getPostById(id)

  if (!post) {
    return notFound()
  }

  return <AdminBlogEditContent post={post} />
}
