import { Metadata } from "next"
import messages from "@/messages/id" // Gunakan ID sebagai default

export const metadata: Metadata = {
  title: messages.metadata.about.title,
  description: messages.metadata.about.description,
  alternates: {
    canonical: "https://rendiichtiar.com/about"
  },
  openGraph: {
    title: messages.metadata.about.title,
    description: messages.metadata.about.description,
    url: "https://rendiichtiar.com/about",
    type: "website",
    siteName: "Rendi Ichtiar Prasetyo",
    locale: "id_ID",
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
    title: messages.metadata.about.title,
    description: messages.metadata.about.description,
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
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    },
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y", 
  }
} 