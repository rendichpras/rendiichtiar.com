"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"

type Post = {
  id: string
  title: string
  subtitle: string | null
  slug: string | null
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED"
  publishedAt: Date | string | null
  updatedAt: Date | string
  tags: { tag: { id: string; name: string } }[]
}

function getStatusClass(status: string) {
  if (status === "PUBLISHED") return "border border-green-500/30 text-green-400"
  if (status === "SCHEDULED")
    return "border border-yellow-500/30 text-yellow-400"
  return "border border-border/30 text-muted-foreground"
}

export function BlogList({ posts }: { posts: Post[] }) {
  const { messages, language } = useI18n()
  const locale = language === "en" ? "en-US" : "id-ID"

  const fmt = (d: Date | string | null | undefined) =>
    d
      ? new Date(d).toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : ""

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            {messages.admin.blogList.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {messages.admin.blogList.subtitle}
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="rounded-2xl border border-border/30 px-4 py-2 text-sm transition-colors hover:border-border/50"
        >
          {messages.admin.blogList.new_post}
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-border/30 p-6 text-sm text-muted-foreground">
          {messages.admin.blogList.empty}
        </div>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {posts.map((p) => (
            <li key={p.id}>
              <article className="rounded-2xl border border-border/30 p-4 transition-colors duration-300 hover:border-border/50 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      href={`/admin/blog/${p.id}/edit`}
                      className="text-lg font-semibold text-foreground hover:underline sm:text-xl"
                    >
                      {p.title}
                    </Link>

                    {p.subtitle ? (
                      <p className="text-sm text-muted-foreground">
                        {p.subtitle}
                      </p>
                    ) : null}

                    <div className="text-xs text-muted-foreground sm:text-sm">
                      {p.publishedAt
                        ? `${messages.admin.blogList.published_at} ${fmt(
                            p.publishedAt
                          )}`
                        : `${messages.admin.blogList.draft_updated} ${fmt(
                            p.updatedAt
                          )}`}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${getStatusClass(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>

                {p.tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t.tag.id}
                        className="rounded-full border border-border/30 px-3 py-1 text-xs text-foreground/80"
                      >
                        #{t.tag.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-3 text-sm text-foreground/90">
                  <Link href={`/admin/blog/${p.id}/edit`} className="underline">
                    {messages.admin.blogList.edit}
                  </Link>
                  {p.slug ? (
                    <Link
                      href={`/blog/${p.slug}`}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {messages.admin.blogList.view}
                    </Link>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
