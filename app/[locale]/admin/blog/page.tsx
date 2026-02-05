import { getTranslations, setRequestLocale } from "next-intl/server"
import { getAllPosts } from "@/lib/actions/blog"
import type { Metadata } from "next"
import AdminBlogContent from "@/components/pages/admin/blog/AdminBlogContent"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "metadata.admin.blog",
  })

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function AdminBlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const { posts } = await getAllPosts(false, undefined, 1, 100)

  return <AdminBlogContent posts={posts} />
}
