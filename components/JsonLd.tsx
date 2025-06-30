export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rendi Ichtiar Prasetyo',
    jobTitle: 'Full Stack Developer',
    url: 'https://rendiichtiar.com',
    sameAs: [
      'https://github.com/YOUR_GITHUB',
      'https://linkedin.com/in/YOUR_LINKEDIN',
      // Tambahkan social media lainnya
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