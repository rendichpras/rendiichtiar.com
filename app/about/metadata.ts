import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tentang | Rendi Ichtiar Prasetyo",
  description: "Sekilas tentang siapa saya – karena setiap detail menambah kedalaman dalam kanvas kehidupan.",
  alternates: {
    canonical: "https://rendiichtiar.com/about"
  },
  openGraph: {
    title: "Tentang | Rendi Ichtiar Prasetyo",
    description: "Sekilas tentang siapa saya – karena setiap detail menambah kedalaman dalam kanvas kehidupan.",
    url: "https://rendiichtiar.com/about",
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
    title: "Tentang | Rendi Ichtiar Prasetyo",
    description: "Sekilas tentang siapa saya – karena setiap detail menambah kedalaman dalam kanvas kehidupan.",
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