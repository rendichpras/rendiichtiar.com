import type { Metadata } from "next"
import messages from "@/messages/id"
import { AboutContent } from "@/components/pages/about/AboutContent"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: messages.metadata.about.title,
  description: messages.metadata.about.description,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: messages.metadata.about.title,
    description: messages.metadata.about.description,
    url: `${SITE_URL}/about`,
    type: "website",
    siteName: "Rendi Ichtiar Prasetyo",
    locale: "id_ID",
  },
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
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y",
  },
}

export default function AboutPage() {
  return <AboutContent />
}
