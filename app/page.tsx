import type { Metadata } from "next"
import messages from "@/messages/id"
import HomeContent from "@/components/pages/home/HomeContent"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: messages.metadata.home.title,
    template: "%s | Rendi Ichtiar Prasetyo",
  },
  description: messages.metadata.home.description,
  keywords: messages.metadata.home.keywords,
  authors: [{ name: "Rendi Ichtiar Prasetyo" }],
  creator: "Rendi Ichtiar Prasetyo",
  publisher: "Rendi Ichtiar Prasetyo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: messages.metadata.home.title,
    description: messages.metadata.home.description,
    url: "/",
    type: "website",
    siteName: "Rendi Ichtiar Prasetyo",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt:
          messages.metadata.home.og_alt ||
          "Rendi Ichtiar Prasetyo - Personal Website",
      },
    ],
  },
  twitter: {
    title: messages.metadata.home.title,
    description: messages.metadata.home.description,
    card: "summary_large_image",
    creator: "@rendiichtiar",
    site: "@rendiichtiar",
    images: ["/og-image.png"],
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y",
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function Page() {
  return <HomeContent />
}
