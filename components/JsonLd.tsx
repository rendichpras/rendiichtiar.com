import { SITE_URL } from "@/lib/site"
import { useTranslations } from "next-intl"

export default function JsonLd() {
  const t = useTranslations("metadata.common")

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
    ],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
