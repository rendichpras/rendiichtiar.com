import { JetBrains_Mono } from "next/font/google"
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
import { AppShell } from "@/components/AppShell"
import { ClerkProvider } from "@clerk/nextjs"
import { Metadata, Viewport } from "next"
import { SITE_URL } from "@/lib/site"
import { headers } from "next/headers"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: "metadata.common" })

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
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
      url: `/${locale}`,
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
      canonical: `/${locale}`,
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
  }
}

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152] as const
const PNG_ICON_SIZES = [16, 32, 96] as const

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2b2b2b" },
  ],
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

  const nonce = (await headers()).get("x-nonce") ?? undefined
  const isDev = process.env.NODE_ENV !== "production"

  const proxyUrl = isDev ? undefined : process.env.NEXT_PUBLIC_CLERK_PROXY_URL

  return (
    <ClerkProvider dynamic nonce={nonce} proxyUrl={proxyUrl}>
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
        </head>
        <body
          className={cn(
            jetbrainsMono.variable,
            "min-h-screen bg-background font-sans antialiased"
          )}
        >
          <ThemeProvider
            nonce={nonce}
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
