import { Metadata } from "next"
import { ContactContent } from "@/components/pages/contact/ContactContent"
import messages from "@/messages/id"

export const metadata: Metadata = {
  title: messages.metadata.contact.title,
  description: messages.metadata.contact.description,
  alternates: {
    canonical: "https://rendiichtiar.com/contact"
  },
  openGraph: {
    title: messages.metadata.contact.title,
    description: messages.metadata.contact.description,
    url: "https://rendiichtiar.com/contact",
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
    title: messages.metadata.contact.title,
    description: messages.metadata.contact.description,
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

export default function ContactPage() {
  return <ContactContent />
} 