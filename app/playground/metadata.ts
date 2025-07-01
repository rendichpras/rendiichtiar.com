import { Metadata } from "next"

export const metadata: Metadata = {
  title: "JavaScript Playground | Rendi Ichtiar Prasetyo",
  description: "Uji dan jalankan kode JavaScript Anda secara langsung di browser dengan umpan balik instan.",
  alternates: {
    canonical: "https://rendiichtiar.com/playground"
  },
  openGraph: {
    title: "JavaScript Playground | Rendi Ichtiar Prasetyo",
    description: "Uji dan jalankan kode JavaScript Anda secara langsung di browser dengan umpan balik instan.",
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
    title: "JavaScript Playground | Rendi Ichtiar Prasetyo",
    description: "Uji dan jalankan kode JavaScript Anda secara langsung di browser dengan umpan balik instan.",
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