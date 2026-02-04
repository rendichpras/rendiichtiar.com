import { getTranslations, getLocale } from "next-intl/server"
import { Metadata } from "next"
import { NotFoundContent } from "@/components/pages/not-found/NotFoundContent"
import { SITE_URL } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({
    locale,
    namespace: "common.error.not_found",
  })

  return {
    title: t("title"),
    description: t("message"),
    alternates: {
      canonical: `${SITE_URL}/404`,
    },
    openGraph: {
      title: t("title"),
      description: t("message"),
      url: `${SITE_URL}/404`,
      type: "website",
      siteName: "Rendi Ichtiar Prasetyo",
      locale: locale === "id" ? "id_ID" : "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Rendi Ichtiar Prasetyo - Personal Website",
        },
      ],
    },
    twitter: {
      title: t("title"),
      description: t("message"),
      card: "summary_large_image",
      creator: "@rendiichtiar",
      site: "@rendiichtiar",
      images: ["/og-image.png"],
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function NotFoundPage() {
  return <NotFoundContent />
}
