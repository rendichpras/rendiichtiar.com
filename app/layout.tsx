import { Sora, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import JsonLd from "@/components/JsonLd"
import { metadata } from "./metadata"
import { cn } from "@/lib/utils"
import { I18nProvider } from "@/lib/i18n"
import { AppShell } from "@/components/app-shell"

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-sora",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
})

export { metadata }

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152] as const
const PNG_ICON_SIZES = [16, 32, 96] as const

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {APPLE_ICON_SIZES.map((s) => (
          <link
            key={`apple-${s}`}
            rel="apple-touch-icon"
            sizes={`${s}x${s}`}
            href={`/apple-icon-${s}x${s}.png`}
          />
        ))}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/apple-icon-192x192.png"
        />
        <link rel="icon" href="/favicon.ico" />
        {PNG_ICON_SIZES.map((s) => (
          <link
            key={`png-${s}`}
            rel="icon"
            type="image/png"
            sizes={`${s}x${s}`}
            href={`/favicon-${s}x${s}.png`}
          />
        ))}
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#09090B"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9512419531764594"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          sora.variable,
          plexMono.variable,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <I18nProvider>
              <JsonLd />
              <AppShell>{children}</AppShell>
            </I18nProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
