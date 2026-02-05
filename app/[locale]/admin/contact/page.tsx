import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import AdminContactContent from "@/components/pages/admin/contact/AdminContactContent"
import { requireAdmin } from "@/lib/auth/require-admin"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
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
  const { locale } = params
  setRequestLocale(locale)
  await requireAdmin()
  return <AdminContactContent />
}
