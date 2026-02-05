import { getTranslations, setRequestLocale } from "next-intl/server"
import { ContactContent } from "@/components/pages/contact/ContactContent"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.contact" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ContactContent />
}
