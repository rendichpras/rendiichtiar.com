import { headers } from "next/headers"

export async function getClientIp(): Promise<string | null> {
  const trustProxy =
    (process.env.TRUST_PROXY ?? "false").toLowerCase() === "true"
  if (!trustProxy) return null

  const h = await headers()
  const xff = h.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }

  const xRealIp = h.get("x-real-ip")
  return xRealIp?.trim() || null
}
