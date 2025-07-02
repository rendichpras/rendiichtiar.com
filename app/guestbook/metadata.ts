import { Metadata } from "next"
import messages from "@/messages/id" // Gunakan ID sebagai default

export const metadata: Metadata = {
  title: messages.metadata.guestbook.title,
  description: messages.metadata.guestbook.description,
  alternates: {
    canonical: "https://rendiichtiar.com/guestbook"
  },
  openGraph: {
    title: messages.metadata.guestbook.title,
    description: messages.metadata.guestbook.description,
    url: "https://rendiichtiar.com/guestbook",
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
    title: messages.metadata.guestbook.title,
    description: messages.metadata.guestbook.description,
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