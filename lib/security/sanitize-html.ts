import sanitizeHtml, { type IOptions } from "sanitize-html"

const SANITIZE_OPTIONS: IOptions = {
  allowedTags: [
    "p",
    "br",
    "hr",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "code",
    "pre",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href
      const nextAttribs: Record<string, string> = { ...attribs }

      if (href) nextAttribs.href = href
      nextAttribs.rel = "noopener noreferrer"
      nextAttribs.target = "_blank"

      return { tagName, attribs: nextAttribs }
    },
    img: (tagName, attribs) => {
      const nextAttribs: Record<string, string> = { ...attribs }
      nextAttribs.loading = "lazy"
      return { tagName, attribs: nextAttribs }
    },
  },
}

export function sanitizeBlogHtml(dirtyHtml: string): string {
  return sanitizeHtml(dirtyHtml, SANITIZE_OPTIONS)
}
