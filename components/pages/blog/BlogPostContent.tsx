"use client"

import * as React from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft } from "lucide-react"

import { PageTransition } from "@/components/animations/page-transition"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type PostVM = {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  excerpt: string
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

  function toDate(input: string | Date | null | undefined) {
    if (!input) return null
    return input instanceof Date ? input : new Date(input)
  }

  function getInitials(name: string | null | undefined) {
    if (!name) return "?"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
    return (
      (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
    ).toUpperCase()
  }

  const publishedDate = toDate(post.publishedAt)

  return (
    <PageTransition>
      <main
        role="main"
        className="relative min-h-screen bg-background pt-16 text-foreground lg:pt-0 lg:pl-64"
      >
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            {/* Post */}
            <Card
              as="article"
              aria-labelledby="post-title"
              className="border-border/30 bg-background text-foreground shadow-sm transition-colors duration-300 hover:border-border/50"
            >
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Kiri: judul, subjudul, meta */}
                  <div className="flex flex-col gap-2">
                    <CardTitle
                      id="post-title"
                      className="scroll-m-20 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl"
                    >
                      {post.title}
                    </CardTitle>

                    {post.subtitle ? (
                      <CardDescription className="text-sm text-muted-foreground sm:text-base">
                        {post.subtitle}
                      </CardDescription>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground sm:text-sm">
                      <span>
                        {post.readingTime}{" "}
                        {messages.metadata.blog.read_time}
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
                            {post.views} {messages.metadata.blog.views}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Kanan: tombol previous */}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="self-start rounded-xl text-xs text-muted-foreground hover:text-foreground sm:text-sm"
                  >
                    <Link
                      href="/blog"
                      aria-label={messages.metadata.blog.prev}
                      className="flex items-center gap-1"
                    >
                      <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      <span className="whitespace-nowrap">
                        {messages.metadata.blog.prev}
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {post.coverUrl ? (
                  <figure className="overflow-hidden rounded-2xl border border-border/30">
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
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </section>
              </CardContent>

              {post.tags.length > 0 ? (
                <CardFooter
                  aria-label="tags"
                  className="flex flex-wrap gap-2"
                >
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
                </CardFooter>
              ) : null}
            </Card>

            {/* Komentar */}
            <Card
              aria-labelledby="comments-heading"
              className="mt-8 border-border/30 bg-background text-foreground shadow-sm transition-colors duration-300 hover:border-border/50 sm:mt-10"
            >
              <CardHeader className="pb-4">
                <CardTitle
                  id="comments-heading"
                  className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
                >
                  {messages.guestbook.list.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Form komentar */}
                <form
                  action={onSubmit}
                  className="grid gap-3"
                  aria-label="new-comment"
                >
                  <div className="grid gap-2">
                    <label htmlFor="message" className="sr-only">
                      {messages.guestbook.form.placeholder}
                    </label>

                    <Textarea
                      id="message"
                      name="message"
                      required
                      maxLength={280}
                      placeholder={messages.guestbook.form.placeholder}
                      className="min-h-[90px] resize-none rounded-xl border-border/30 bg-background text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="w-fit rounded-xl border-border/30 text-sm"
                  >
                    {messages.guestbook.form.send}
                  </Button>
                </form>

                <Separator className="bg-border/40" />

                {/* List komentar */}
                <ScrollArea
                  className="max-h-[400px] pr-2"
                  aria-label="comments-list"
                >
                  <ul role="list" className="space-y-4">
                    {comments.map((c) => {
                      const created = toDate(c.createdAt)
                      const name = c.user?.name ?? "Anon"
                      return (
                        <li
                          key={c.id}
                          className={cn(
                            "flex gap-3 rounded-xl border border-border/30 bg-background/50 p-3",
                            c.parentId && c.parentId !== c.rootId
                              ? "ml-6"
                              : "ml-0"
                          )}
                        >
                          {/* Avatar */}
                          <div className="flex flex-col items-center pt-1">
                            <Avatar className="size-8">
                              <AvatarImage src={""} alt={name} />
                              <AvatarFallback className="text-[10px] font-medium">
                                {getInitials(name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Isi komentar */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                              <div className="text-sm font-medium text-foreground">
                                {name}
                              </div>

                              {created ? (
                                <time
                                  dateTime={created.toISOString()}
                                  className="text-[10px] text-muted-foreground sm:text-xs"
                                >
                                  {created.toLocaleString("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </time>
                              ) : null}
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {c.message}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}