import { Sora, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import JsonLd from "@/components/JsonLd"
import { cn } from "@/lib/utils"
import { NextIntlClientProvider } from "next-intl"
import {
  getMessages,
  setRequestLocale,
  getTranslations,
  getLocale,
} from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { AppShell } from "@/components/app-shell"
import { ClerkProvider } from "@clerk/nextjs"
import { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: "metadata.common" })

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    metadataBase: new URL(SITE_URL),
    keywords: t.raw("keywords"),
    authors: [{ name: "Rendi Ichtiar Prasetyo" }],
    creator: "Rendi Ichtiar Prasetyo",
    publisher: "Rendi Ichtiar Prasetyo",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/",
      type: "website",
      siteName: t("title"),
      locale: locale === "id" ? "id_ID" : "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${t("title")} - Personal Website`,
        },
      ],
    },
    twitter: {
      title: t("title"),
      description: t("description"),
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
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
  }
}

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

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152] as const
const PNG_ICON_SIZES = [16, 32, 96] as const

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body
          className={cn(
            sora.variable,
            plexMono.variable,
            "min-h-screen bg-background font-sans antialiased"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <JsonLd />
              <AppShell>{children}</AppShell>
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
