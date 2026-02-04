import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://*.clerk.accounts.dev https://clerk.rendiichtiar.com https://cdn.jsdelivr.net blob:; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https: https://img.clerk.com; font-src 'self' data: https://cdn.jsdelivr.net; connect-src 'self' https: https://*.clerk.accounts.dev https://clerk.rendiichtiar.com wss://ws-ap1.pusher.com; frame-src 'self' blob:; worker-src 'self' blob:;",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
