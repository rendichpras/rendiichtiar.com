"use client"

import { useActionState, useState } from "react"
import { updatePost, CreatePostState } from "@/lib/actions/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import TiptapEditor from "@/components/editor/TiptapEditor"
import {
  ArrowLeft,
  Save,
  Loader2,
  Settings,
  FileText,
  Image as ImageIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DeletePostButton } from "./DeletePostButton"
import { useTranslations } from "next-intl"

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
}

type Props = {
  post: Post
}

const initialState: CreatePostState = {
  message: "",
  errors: {},
}

export default function AdminBlogEditContent({ post }: Props) {
  const t = useTranslations("admin.blog")
  const [content, setContent] = useState(post.content)
  const updatePostWithId = updatePost.bind(null, post.id)
  const [state, formAction, isPending] = useActionState<
    CreatePostState,
    FormData
  >(updatePostWithId, initialState)

  return (
    <section className="relative bg-background py-8 text-foreground sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/blog">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("edit.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("edit.subtitle", { title: post.title })}
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          <form action={formAction} className="grid gap-8 lg:grid-cols-3">
            <input type="hidden" name="content" value={content} />

            <div className="space-y-6 lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>{t("form.article_content")}</CardTitle>
                  <CardDescription>{t("form.update_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">
                      {t("form.title_label")}
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={post.title}
                      required
                      className="py-6 text-lg font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("form.content_label")}</Label>
                    <div className="min-h-[400px] rounded-md border text-sm shadow-sm">
                      <TiptapEditor content={content} onChange={setContent} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t("form.publishing")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="published" className="text-base">
                        {t("form.published")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t("form.visible")}
                      </p>
                    </div>
                    <Switch
                      id="published"
                      name="published"
                      defaultChecked={post.published}
                    />
                  </div>

                  {state.message && (
                    <div
                      className={`rounded-md p-3 text-sm font-medium ${
                        state.message.includes("success") ||
                        state.message.includes("Updated")
                          ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-400"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {state.message}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {t("form.update")}
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/admin/blog">{t("form.cancel")}</Link>
                    </Button>

                    <div className="pt-2">
                      <DeletePostButton
                        id={post.id}
                        className="w-full justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t("form.metadata")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">{t("form.slug")}</Label>
                    <Input
                      id="slug"
                      name="slug"
                      defaultValue={post.slug}
                      placeholder={t("form.slug_placeholder")}
                      className="font-mono text-xs"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t("form.slug_hint_edit")}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">{t("form.excerpt")}</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      defaultValue={post.excerpt || ""}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {t("form.media")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">{t("form.cover_image")}</Label>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      defaultValue={post.coverImage || ""}
                    />
                    {post.coverImage && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        <Image
                          src={post.coverImage}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
