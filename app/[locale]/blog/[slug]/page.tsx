import { getPostBySlug } from "@/lib/actions/blog"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import parse from "html-react-parser"
import { Link } from "@/i18n/routing"
import { sanitizeHtml } from "@/lib/security/sanitize-html"
import { Footer } from "@/components/Footer"

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Not found",
      description: "",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

function calculateReadingTime(htmlContent: string) {
  const text = htmlContent.replace(/<[^>]*>/g, "")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)

  const post = await getPostBySlug(slug)

  if (!post) {
    return notFound()
  }

  const safeHtml = sanitizeHtml(post.content)
  const readingTime = calculateReadingTime(safeHtml)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <time>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{readingTime} min read</span>
          </div>

          {post.excerpt && (
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          {parse(safeHtml)}
        </article>
      </div>
      <Footer />
    </div>
  )
}
