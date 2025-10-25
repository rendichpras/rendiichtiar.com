export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rendi Ichtiar Prasetyo',
    jobTitle: 'Software Engineer',
    url: 'https://rendiichtiar.com',
    sameAs: [
      'https://github.com/rendichpras',
      'https://linkedin.com/in/rendiichtiar',
    ],
    knowsAbout: [
      'Web Development',
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'Tailwind CSS',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
} 