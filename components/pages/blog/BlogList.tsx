"use client"

import { motion } from "framer-motion"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CalendarDays, Clock } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"

import { useEffect, useState, useCallback } from "react"
import type { Post as DbPost } from "@/db/generated/client"
import { getAllPosts } from "@/lib/actions/blog"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination } from "@/components/ui/pagination-custom"
import { FormCardSkeleton as PostSkeleton } from "@/components/pages/guestbook/GuestbookSkeleton"

type Post = Omit<DbPost, "createdAt" | "updatedAt"> & {
  createdAt: Date | string
  updatedAt: Date | string
  readingTime: number
  tags: string[]
}

export default function BlogList({
  initialQuery = "",
  initialPage = 1,
}: {
  initialQuery?: string
  initialPage?: number
}) {
  const t = useTranslations("pages.blog")
  const locale = useLocale()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllPosts(true, initialQuery, initialPage)
      setPosts(res.posts as unknown as Post[])
      setTotalPages(res.totalPages)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [initialQuery, initialPage])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="space-y-6 pr-4">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyState title={t("empty.title")} description={t("empty.subtitle")} />
    )
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <Link href={`/blog/${post.slug}`} className="group h-full">
              <Card className="flex h-full flex-col gap-0 overflow-hidden border-border bg-card p-0 transition-colors duration-300 hover:border-primary">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
                      <span className="text-sm">{t("no_cover_image")}</span>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-1.5 direction-reverse">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className=" border bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-none hover:bg-secondary/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge
                        variant="secondary"
                        className=" border bg-secondary px-2.5 py-0.5 text-[10px] text-secondary-foreground"
                      >
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="space-y-2 p-5 pb-1">
                  <h2 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-foreground">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <time dateTime={new Date(post.createdAt).toISOString()}>
                        {new Date(post.createdAt).toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{t("min_read", { count: post.readingTime })}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 px-5 pb-5 pt-1">
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt || t("no_excerpt")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Pagination page={initialPage} totalPages={totalPages} />
      </div>
    </>
  )
}
