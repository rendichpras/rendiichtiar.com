import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontak | Rendi Ichtiar Prasetyo",
  description: "Hubungi saya untuk kolaborasi atau diskusi tentang proyek pengembangan web yang menarik.",
  alternates: {
    canonical: "https://rendiichtiar.com/contact"
  },
  openGraph: {
    title: "Kontak | Rendi Ichtiar Prasetyo",
    description: "Hubungi saya untuk kolaborasi atau diskusi tentang proyek pengembangan web yang menarik.",
    url: "https://rendiichtiar.com/contact",
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
    title: "Kontak | Rendi Ichtiar Prasetyo",
    description: "Hubungi saya untuk kolaborasi atau diskusi tentang proyek pengembangan web yang menarik.",
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