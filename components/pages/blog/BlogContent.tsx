"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import type { Post } from "@/db/generated/client"
import BlogList from "./BlogList"
import { useTranslations } from "next-intl"
import { SearchInput } from "@/components/SearchInput"
import { Pagination } from "@/components/ui/pagination-custom"

type BlogContentProps = {
  posts: (Post & { blurDataURL?: string })[]
  totalPages: number
  currentPage: number
}

export function BlogContent({
  posts,
  totalPages,
  currentPage,
}: BlogContentProps) {
  const t = useTranslations("pages.blog")

  return (
    <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.header
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("title")}
              </h1>

              <p className="text-sm text-muted-foreground sm:text-base">
                {t("subtitle")}
              </p>
            </div>
            <div className="w-full md:w-72">
              <SearchInput placeholder={t("search_placeholder")} />
            </div>
          </motion.header>

          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              show: { opacity: 1, scaleX: 1 },
            }}
          >
            <Separator className="bg-border/40" />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            {posts.length === 0 ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border/30 bg-card text-center text-muted-foreground">
                <p className="text-lg font-medium">{t("empty.title")}</p>
                <p className="text-sm">{t("empty.subtitle")}</p>
              </div>
            ) : (
              <>
                <BlogList posts={posts} />
                <div className="mt-8 flex justify-center">
                  <Pagination page={currentPage} totalPages={totalPages} />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
