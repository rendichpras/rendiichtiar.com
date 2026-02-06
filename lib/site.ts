function normalizeOrigin(value?: string | null): string | null {
  if (!value) return null
  const v = value.trim().replace(/\/+$/, "")
  if (!v) return null
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

// Canonical site origin (no trailing slash)
export const SITE_URL =
  normalizeOrigin(process.env.NEXT_PUBLIC_URL) ??
  normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeOrigin(process.env.VERCEL_URL) ??
  "http://localhost:3000"

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, SITE_URL).toString()
}
