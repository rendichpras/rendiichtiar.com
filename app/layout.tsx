import { Outfit, Fira_Code } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./providers"
import { AuthProvider } from "./providers/auth-provider"
import JsonLd from "@/components/JsonLd"
import { Toaster } from "@/components/ui/sonner"
import { BackToTop } from "@/components/BackToTop"
import { Navbar } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { metadata } from "./metadata"
import { cn } from "@/lib/utils"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
})

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <JsonLd />
        <link rel="apple-touch-icon" sizes="57x57" href="/icon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon/favicon-16x16.png" />
        <link rel="manifest" href="/icon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/icon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", outfit.variable, firaCode.variable)}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <BackToTop />
            <Toaster richColors closeButton position="top-right" />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
