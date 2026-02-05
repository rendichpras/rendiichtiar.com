import { getTranslations, setRequestLocale } from "next-intl/server"
import { getAllPosts } from "@/lib/actions/blog"
import { BlogContent } from "@/components/pages/blog/BlogContent"
import type { Metadata } from "next"

type Props = {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: "metadata.blog" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale } = params
  const { q, page } = searchParams
  const query = typeof q === "string" ? q : undefined
  const currentPage = typeof page === "string" ? parseInt(page) : 1

  setRequestLocale(locale)
  const { posts, totalPages } = await getAllPosts(true, query, currentPage)

  return (
    <BlogContent
      posts={posts}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}
