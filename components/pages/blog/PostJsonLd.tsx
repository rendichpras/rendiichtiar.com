export function PostJsonLd({
  post,
}: {
  post: {
    slug: string
    title: string
    coverUrl?: string | null
    publishedAt?: string | Date | null
  }
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || ""
  const url = `${site}/blog/${post.slug}`

  const publishedIso = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date().toISOString()

  const imageUrl = post.coverUrl
    ? post.coverUrl.startsWith("http")
      ? post.coverUrl
      : `${site}${post.coverUrl}`
    : `${site}/og-image.png`

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: [imageUrl],
    datePublished: publishedIso,
    author: {
      "@type": "Person",
      name: "Rendi Ichtiar Prasetyo",
      url: site,
    },
    publisher: {
      "@type": "Person",
      name: "Rendi Ichtiar Prasetyo",
      url: site,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
