import { getTranslations, setRequestLocale } from "next-intl/server"
import { GuestbookContent } from "@/components/pages/guestbook/GuestbookContent"
import type { Metadata } from "next"

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: "metadata.guestbook" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function GuestbookPage({ params }: Props) {
  const { locale } = params
  setRequestLocale(locale)
  return <GuestbookContent />
}
