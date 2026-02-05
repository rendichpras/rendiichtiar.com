import AdminBlogNewContent from "@/components/pages/admin/blog/AdminBlogNewContent"
import { requireAdmin } from "@/lib/auth/require-admin"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function NewPostPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await requireAdmin()
  return <AdminBlogNewContent />
}
