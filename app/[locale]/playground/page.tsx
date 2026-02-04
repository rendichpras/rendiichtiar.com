import { getTranslations, setRequestLocale } from "next-intl/server"
import { PlaygroundContent } from "@/components/pages/playground/PlaygroundContent"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.playground" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function PlaygroundPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PlaygroundContent />
}
