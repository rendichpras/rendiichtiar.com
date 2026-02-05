import { ForbiddenContent } from "@/components/pages/forbidden/ForbiddenContent"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
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
  const { locale } = params
  setRequestLocale(locale)
  return <ForbiddenContent />
}
