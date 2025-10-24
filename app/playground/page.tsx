import type { Metadata } from "next"
import messages from "@/messages/id"
import { PlaygroundContent } from "@/components/pages/playground/PlaygroundContent"

export const metadata: Metadata = {
  title: messages.metadata.playground.title,
  description: messages.metadata.playground.description,
  alternates: {
    canonical: "https://rendiichtiar.com/playground"
  },
  openGraph: {
    title: messages.metadata.playground.title,
    description: messages.metadata.playground.description,
    url: "https://rendiichtiar.com/playground",
    type: "website",
    siteName: "Rendi Ichtiar Prasetyo",
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
    title: messages.metadata.playground.title,
    description: messages.metadata.playground.description,
    card: "summary_large_image",
    creator: "@rendiichtiar",
    site: "@rendiichtiar",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y",
  }
}

export default function PlaygroundPage() {
  return <PlaygroundContent />
}