import { Metadata } from "next"
import messages from "@/messages/id" // Gunakan ID sebagai default

export const metadata: Metadata = {
  title: messages.error.forbidden.title,
  description: messages.error.forbidden.message,
  alternates: {
    canonical: "https://rendiichtiar.com/forbidden"
  },
  openGraph: {
    title: messages.error.forbidden.title,
    description: messages.error.forbidden.message,
    url: "https://rendiichtiar.com/forbidden",
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
    title: messages.error.forbidden.title,
    description: messages.error.forbidden.message,
    card: "summary_large_image",
    creator: "@rendiichtiar",
    site: "@rendiichtiar",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    },
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y", 
  }
} 