import DOMPurify from "isomorphic-dompurify"

export function sanitizeHtml(dirtyHtml: string) {
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
  })
}
