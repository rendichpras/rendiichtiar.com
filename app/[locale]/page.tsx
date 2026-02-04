import { locales } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import HomeContent from "@/components/pages/home/HomeContent"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.home" })

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "id" ? "id_ID" : "en_US",
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeContent />
}
