import { getTranslations, setRequestLocale } from "next-intl/server"
import { ContactContent } from "@/components/pages/contact/ContactContent"
import type { Metadata } from "next"

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: "metadata.contact" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = params
  setRequestLocale(locale)
  return <ContactContent />
}
