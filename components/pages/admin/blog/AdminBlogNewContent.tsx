"use client"

import { useActionState, useState } from "react"
import { createPost, CreatePostState } from "@/lib/actions/blog"
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
  Image as ImageIcon,
  FileText,
  Settings,
} from "lucide-react"
import { Link } from "@/i18n/routing"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLocale, useTranslations } from "next-intl"

const initialState: CreatePostState = {
  message: "",
  errors: {},
}

export default function AdminBlogNewContent() {
  const t = useTranslations("admin.blog")
  const locale = useLocale()
  const [content, setContent] = useState("<p>Start writing...</p>")
  const [state, formAction, isPending] = useActionState<
    CreatePostState,
    FormData
  >(createPost, initialState)

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
                {t("new.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("new.subtitle")}
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          <form action={formAction} className="grid gap-8 lg:grid-cols-3">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="content" value={content} />

            <div className="space-y-6 lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>{t("form.article_content")}</CardTitle>
                  <CardDescription>
                    {t("form.article_content_desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">
                      {t("form.title_label")}
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder={t("form.title_placeholder")}
                      required
                      className="py-6 text-lg font-medium"
                    />
                    {state.errors?.title && (
                      <p className="text-sm text-destructive">
                        {state.errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t("form.content_label")}</Label>
                    <div className="min-h-[400px]  border text-sm shadow-sm">
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
                  <div className="flex items-center justify-between  border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="published" className="text-base">
                        {t("form.published")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t("form.visible")}
                      </p>
                    </div>
                    <Switch id="published" name="published" />
                  </div>

                  {state.message && (
                    <div
                      className={` p-3 text-sm font-medium ${
                        state.message.includes("success")
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
                      {t("form.save")}
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/admin/blog">{t("form.discard")}</Link>
                    </Button>
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
                      placeholder={t("form.slug_placeholder")}
                      className="font-mono text-xs"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t("form.slug_hint")}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">{t("form.excerpt")}</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder={t("form.excerpt_placeholder")}
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
                      placeholder={t("form.cover_placeholder")}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t("form.cover_hint")}
                    </p>
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
