import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buku Tamu | Rendi Ichtiar Prasetyo",
  description: "Tinggalkan pesan, saran, atau kesan Anda di buku tamu digital saya.",
  alternates: {
    canonical: "https://rendiichtiar.com/guestbook"
  },
  openGraph: {
    title: "Buku Tamu | Rendi Ichtiar Prasetyo",
    description: "Tinggalkan pesan, saran, atau kesan Anda di buku tamu digital saya.",
    url: "https://rendiichtiar.com/guestbook",
    type: "website",
    siteName: "Rendi Ichtiar Prasetyo",
  },
  twitter: {
    title: "Buku Tamu | Rendi Ichtiar Prasetyo",
    description: "Tinggalkan pesan, saran, atau kesan Anda di buku tamu digital saya.",
    card: "summary_large_image",
    creator: "@rendiichtiar",
    site: "@rendiichtiar"
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