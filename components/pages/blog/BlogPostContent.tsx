"use client"

import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { PageTransition } from "@/components/animations/page-transition"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

import { Badge } from "@/components/ui/badge"
import { PostComments } from "@/components/pages/blog/PostComments"

type PostVM = {
  id: string
  slug: string
  title: string
  content: string
  coverUrl?: string | null
  publishedAt?: string | Date | null
  readingTime: number
  views: number
  tags: { slug: string; name: string }[]
}

type CommentVM = {
  id: string
  createdAt: string | Date
  message: string
  user: { name: string | null }
  parentId?: string | null
  rootId?: string | null
}

function toDate(input: string | Date | null | undefined) {
  if (!input) return null
  return input instanceof Date ? input : new Date(input)
}

export function BlogPostContent({
  post,
  comments,
  onSubmit,
}: {
  post: PostVM
  comments: CommentVM[]
  onSubmit: (fd: FormData) => Promise<void>
}) {
  const { messages } = useI18n()

  const publishedDate = toDate(post.publishedAt)

  return (
    <PageTransition>
      <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
          <article
            aria-labelledby="post-title"
            className="mx-auto w-full max-w-3xl"
          >
            <header className="mb-8 space-y-4">
              <div className="space-y-4">
                <h1
                  id="post-title"
                  className="scroll-m-20 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
                >
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground sm:text-sm">
                  <span>
                    {post.readingTime} {messages.pages.blog.list.read_time}
                  </span>

                  {publishedDate ? (
                    <>
                      <span aria-hidden="true">•</span>
                      <time
                        dateTime={publishedDate.toISOString()}
                        className="whitespace-nowrap"
                      >
                        {publishedDate.toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </>
                  ) : null}

                  {typeof post.views === "number" ? (
                    <>
                      <span aria-hidden="true">•</span>
                      <span className="whitespace-nowrap">
                        {post.views} {messages.pages.blog.list.views}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </header>

            {post.coverUrl ? (
              <figure className="mb-8 overflow-hidden rounded-2xl border border-border/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverUrl}
                  alt={post.title}
                  className="block h-auto w-full object-cover"
                />
              </figure>
            ) : null}

            <section
              aria-label="post-body"
              className={cn(
                "prose prose-invert max-w-none",
                "prose-headings:scroll-mt-24 prose-headings:text-foreground",
                "prose-p:text-muted-foreground",
                "prose-strong:text-foreground",
                "prose-code:rounded prose-code:bg-muted/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground",
                "prose-pre:rounded-xl prose-pre:bg-muted/20 prose-pre:p-4",
                "prose-a:text-foreground prose-a:underline hover:prose-a:text-foreground/80"
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </section>

            {post.tags.length > 0 ? (
              <footer aria-label="tags" className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/blog?tag=${t.slug}`}
                    className="no-underline"
                    aria-label={`tag ${t.name}`}
                  >
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/30 text-foreground/80 hover:border-border/50 hover:text-foreground"
                    >
                      #{t.name}
                    </Badge>
                  </Link>
                ))}
              </footer>
            ) : null}
          </article>

          <div className="mx-auto mt-12 w-full max-w-3xl">
            <PostComments comments={comments} onSubmit={onSubmit} />
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
