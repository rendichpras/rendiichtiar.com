import { getTranslations, setRequestLocale } from "next-intl/server"
import { AboutContent } from "@/components/pages/about/AboutContent"
import type { Metadata } from "next"

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: "metadata.about" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = params
  setRequestLocale(locale)
  return <AboutContent />
}
