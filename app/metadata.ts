import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://rendiichtiar.com"),
  title: "Rendi Ichtiar Prasetyo | Personal Website",
  description: "Portfolio website Rendi Ichtiar Prasetyo, seorang Full Stack Developer yang berpengalaman dalam pengembangan web modern menggunakan Next.js, React, dan teknologi terkini",
  keywords: ["Full Stack Developer", "Web Developer", "Next.js", "React", "TypeScript", "Tailwind CSS", "Portfolio"],
  authors: [{ name: "Rendi Ichtiar Prasetyo" }],
  creator: "Rendi Ichtiar Prasetyo",
  publisher: "Rendi Ichtiar Prasetyo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rendiichtiar.com",
    siteName: "Rendi Ichtiar Prasetyo",
    title: "Rendi Ichtiar Prasetyo | Personal Website",
    description: "Portfolio website Rendi Ichtiar Prasetyo, seorang Full Stack Developer yang berpengalaman dalam pengembangan web modern",
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
    card: "summary_large_image",
    title: "Rendi Ichtiar Prasetyo | Personal Website",
    description: "Portfolio website Rendi Ichtiar Prasetyo, seorang Full Stack Developer yang berpengalaman dalam pengembangan web modern",
    images: ["/og-image.png"],
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y",
  },
  alternates: {
    canonical: "https://rendiichtiar.com",
  },
} 