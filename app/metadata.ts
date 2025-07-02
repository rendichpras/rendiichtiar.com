import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://rendiichtiar.com"),
  title: "Rendi Ichtiar Prasetyo | Frontend Engineer",
  description: "A Frontend Engineer focusing on modern web application development with React, Next.js, and TypeScript.",
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
    },
  },
  openGraph: {
    title: "Rendi Ichtiar Prasetyo | Frontend Engineer",
    description: "A Frontend Engineer focusing on modern web application development with React, Next.js, and TypeScript.",
    url: "/",
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
    title: "Rendi Ichtiar Prasetyo | Frontend Engineer",
    description: "A Frontend Engineer focusing on modern web application development with React, Next.js, and TypeScript.",
    card: "summary_large_image",
    creator: "@rendiichtiar",
    site: "@rendiichtiar",
    images: ["/og-image.png"],
  },
  verification: {
    google: "JSf4AOk3_MJEskxEwDCL519D-Uvd8pmEczlC7dQzX8Y",
  },
  alternates: {
    canonical: "/",
  },
} 