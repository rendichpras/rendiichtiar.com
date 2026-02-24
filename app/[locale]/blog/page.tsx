import { getTranslations, setRequestLocale } from "next-intl/server"
import { BlogContent } from "@/components/pages/blog/BlogContent"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.blog" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q, page } = await searchParams
  const query = typeof q === "string" ? q : undefined
  const currentPage = typeof page === "string" ? parseInt(page) : 1

  setRequestLocale(locale)

  return <BlogContent initialQuery={query} initialPage={currentPage} />
}
