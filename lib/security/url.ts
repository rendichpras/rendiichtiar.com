const DEFAULT_ALLOWED_PROTOCOLS = new Set(["http:", "https:"])

export function isSafeHref(
  href: string,
  allowedProtocols: Set<string> = new Set([
    ...DEFAULT_ALLOWED_PROTOCOLS,
    "mailto:",
    "tel:",
  ])
) {
  if (href.startsWith("#") || href.startsWith("/")) return true

  try {
    const url = new URL(href)
    return allowedProtocols.has(url.protocol)
  } catch {
    return false
  }
}

export function isSafeImageSrc(src: string) {
  if (src.startsWith("/")) return true

  try {
    const url = new URL(src)
    return DEFAULT_ALLOWED_PROTOCOLS.has(url.protocol)
  } catch {
    return false
  }
}
