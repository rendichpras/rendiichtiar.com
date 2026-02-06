import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import AdminContactContent from "@/components/pages/admin/contact/AdminContactContent"
import { requireAdmin } from "@/lib/auth/require-admin"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "metadata.admin.contact",
  })

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function AdminContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await requireAdmin(true)
  return <AdminContactContent />
}
