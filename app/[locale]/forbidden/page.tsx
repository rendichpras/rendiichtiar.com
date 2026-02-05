import { ForbiddenContent } from "@/components/pages/forbidden/ForbiddenContent"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "common.error.forbidden",
  })

  return {
    title: t("title"),
    description: t("message"),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function ForbiddenPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ForbiddenContent />
}
