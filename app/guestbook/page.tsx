import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import messages from "@/messages/id"
import { GuestbookContent } from "@/components/pages/guestbook/GuestbookContent"

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
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    },
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y",
  }
}

export default async function GuestbookPage() {
  const session = await getServerSession()
  return <GuestbookContent session={session} />
}
