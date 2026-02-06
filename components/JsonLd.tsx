import { SITE_URL } from "@/lib/site"
import { getTranslations } from "next-intl/server"

export default async function JsonLd() {
  const t = await getTranslations("metadata.common")

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rendi Ichtiar Prasetyo",
    jobTitle: t("job_title"),
    description: t("description"),
    url: SITE_URL,
    sameAs: [
      "https://github.com/rendichpras",
      "https://linkedin.com/in/rendiichtiar",
      "https://twitter.com/rendichpras",
      "https://instagram.com/rendichpras",
    ],
    knowsAbout: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS"],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
