import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPostBySlug } from "@/lib/actions/blog"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import parse from "html-react-parser"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Rendi Ichtiar Prasetyo`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "pages.blog" })
  const post = await getPostBySlug(slug)

  if (!post || !post.published) {
    return notFound()
  }

  return (
    <article className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="mx-auto max-w-4xl space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl border-border/30 bg-card text-muted-foreground transition-colors duration-300 hover:border-border/50 hover:bg-accent hover:text-foreground"
            asChild
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back_to_blog")}
            </Link>
          </Button>

          <header className="space-y-4">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full border-0 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={post.createdAt.toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString(locale, {
                    dateStyle: "long",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{t("min_read", { count: post.readingTime })}</span>
              </div>
            </div>
          </header>

          <Separator className="bg-border/40" />

          {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/30 bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {post.excerpt && (
            <p className="border-l-2 border-primary/30 py-2 pl-4 text-base italic leading-relaxed text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>
          )}

          <div className="prose prose-base dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl max-w-none">
            {parse(post.content)}
          </div>
        </div>
      </div>
    </article>
  )
}
