"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/routing"
import { Edit, Plus, Eye } from "lucide-react"
import { DeletePostButton } from "./DeletePostButton"
import { useTranslations, useLocale } from "next-intl"

type Post = {
  id: string
  title: string
  slug: string
  published: boolean
  views: number
  createdAt: Date
}

type Props = {
  posts: Post[]
}

export default function AdminBlogContent({ posts }: Props) {
  const t = useTranslations("admin.blog.list")
  const locale = useLocale()

  return (
    <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("create_new")}
            </Link>
          </Button>
        </div>

        <Separator className="my-6 bg-border" />

        <Card className="border-border bg-card">
          <div className=" border-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-11 px-6 text-xs">
                    {t("columns.title")}
                  </TableHead>
                  <TableHead className="h-11 px-6 text-xs">
                    {t("columns.status")}
                  </TableHead>
                  <TableHead className="h-11 px-6 text-xs">
                    {t("columns.views")}
                  </TableHead>
                  <TableHead className="h-11 px-6 text-xs">
                    {t("columns.date")}
                  </TableHead>
                  <TableHead className="h-11 px-6 text-right text-xs">
                    {t("columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t("empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow
                      key={post.id}
                      className="group border-b border-border last:border-0 hover:bg-muted"
                    >
                      <TableCell className="px-6 py-3 font-medium">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="transition-colors group-hover:text-primary"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                          className="font-normal"
                        >
                          {post.published
                            ? t("status.published")
                            : t("status.draft")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3">{post.views}</TableCell>
                      <TableCell className="px-6 py-3">
                        {new Date(post.createdAt).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/blog/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeletePostButton id={post.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </section>
  )
}
