import { getTranslations, setRequestLocale } from "next-intl/server"
import { GuestbookContent } from "@/components/pages/guestbook/GuestbookContent"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.guestbook" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function GuestbookPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <GuestbookContent />
}
