"use client"

import Link from "next/link"
import { PageTransition } from "@/components/animations/page-transition"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type PostItem = {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  excerpt: string
  publishedAt?: string | Date | null
  readingTime: number
  views: number
  tags: { tag: { slug: string; name: string } }[]
}

export function BlogContent({
  items,
  page,
  hasMore,
  tag,
}: {
  items: PostItem[]
  page: number
  hasMore: boolean
  tag?: string
}) {
  const { messages } = useI18n()

  function toDate(input: string | Date | null | undefined) {
    if (!input) return null
    return input instanceof Date ? input : new Date(input)
  }

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 text-foreground lg:pt-0 lg:pl-64">
        <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 xl:px-24">
          <header className="max-w-2xl space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {messages.metadata.blog.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {messages.metadata.blog.subtitle}
            </p>
          </header>

          <Separator className="my-6 bg-border/40" />

          {items.length === 0 ? (
            <Card className="border-border/30 bg-card/50 text-sm text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50">
              <CardContent className="p-6">
                {messages.metadata.blog.empty}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {items.map((p) => {
                const created = toDate(p.publishedAt)

                return (
                  <Card
                    key={p.id}
                    className="border-border/30 bg-card/50 text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-border/50"
                  >
                    <CardHeader>
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-semibold leading-snug tracking-tight text-foreground hover:underline sm:text-xl">
                          <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                        </CardTitle>

                        {p.subtitle ? (
                          <CardDescription className="text-sm text-muted-foreground">
                            {p.subtitle}
                          </CardDescription>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground sm:text-sm">
                          <span>
                            {p.readingTime} {messages.metadata.blog.read_time}
                          </span>

                          {created ? (
                            <>
                              <span aria-hidden="true">•</span>
                              <time
                                dateTime={created.toISOString()}
                                className="whitespace-nowrap"
                              >
                                {created.toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </time>
                            </>
                          ) : null}

                          {typeof p.views === "number" ? (
                            <>
                              <span aria-hidden="true">•</span>
                              <span className="whitespace-nowrap">
                                {p.views} {messages.metadata.blog.views}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </CardHeader>

                    {(p.tags?.length ?? 0) > 0 ? (
                      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0 sm:p-6 sm:pt-0">
                        {p.tags.map((t) => (
                          <Link
                            key={t.tag.slug}
                            href={`/blog?tag=${t.tag.slug}`}
                            aria-label={`tag ${t.tag.name}`}
                            className="no-underline"
                          >
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-full border-border/30 text-foreground/80 hover:border-border/50 hover:text-foreground"
                              )}
                            >
                              #{t.tag.name}
                            </Badge>
                          </Link>
                        ))}
                      </CardFooter>
                    ) : null}
                  </Card>
                )
              })}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {page > 1 ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-border/30 text-xs hover:border-border/50 sm:text-sm"
                  >
                    <Link
                      href={`/blog?page=${page - 1}${
                        tag ? `&tag=${tag}` : ""
                      }`}
                    >
                      {messages.metadata.blog.prev}
                    </Link>
                  </Button>
                ) : null}

                {hasMore ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="ml-auto rounded-xl border-border/30 text-xs hover:border-border/50 sm:text-sm"
                  >
                    <Link
                      href={`/blog?page=${page + 1}${
                        tag ? `&tag=${tag}` : ""
                      }`}
                    >
                      {messages.metadata.blog.next}
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </section>
      </main>
    </PageTransition>
  )
}