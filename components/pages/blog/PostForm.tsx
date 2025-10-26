"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import {
  createPost,
  updatePost,
  publishPost,
  deletePost,
} from "@/app/blog/blog";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

export type PostInput = {
  id?: string;
  title?: string;
  coverUrl?: string;
  content?: string;
  tags?: string;
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED";
};

function generateExcerpt(md: string, maxLen = 220) {
  if (!md) return "";
  const plain = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[*_>#-]+/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen - 1).trimEnd() + "…";
}

export function PostForm({ initial }: { initial?: PostInput }) {
  const { messages } = useI18n();

  const [data, setData] = useState<PostInput>({
    title: initial?.title ?? "",
    coverUrl: initial?.coverUrl ?? "",
    content: initial?.content ?? "",
    tags: initial?.tags ?? "",
    status: initial?.status ?? "DRAFT",
  });

  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const safeStatus = (data.status || "DRAFT").toUpperCase() as
        | "DRAFT"
        | "PUBLISHED"
        | "SCHEDULED";

      const excerpt = generateExcerpt(data.content ?? "");

      const payload = {
        title: data.title?.trim() ?? "",
        excerpt,
        content: data.content ?? "",
        coverUrl: data.coverUrl?.trim() || undefined,
        tags: (data.tags || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        status: safeStatus,
      };

      try {
        if (initial?.id) {
          await updatePost(initial.id, payload);
          toast.success(messages.admin.blogEditor.form.toast.updated);
          return;
        }

        const res = await createPost(payload);
        toast.success(messages.admin.blogEditor.form.toast.created);
        window.location.href = `/admin/blog/${res.id}/edit`;
      } catch (err) {
        toast.error(messages.admin.blogEditor.form.toast.error_save);
        console.error(err);
      }
    });
  }

  function handlePublish() {
    startTransition(async () => {
      if (!initial?.id) return;
      try {
        const res = await publishPost(initial.id);
        toast.success(messages.admin.blogEditor.form.toast.published);
        if (res?.slug) {
          window.location.href = `/blog/${res.slug}`;
        }
      } catch (err) {
        toast.error(messages.admin.blogEditor.form.toast.error_publish);
        console.error(err);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      if (!initial?.id) return;
      const ok = window.confirm(messages.admin.blogEditor.form.confirm_delete);
      if (!ok) return;
      try {
        await deletePost(initial.id);
        toast.success(messages.admin.blogEditor.form.toast.deleted);
        window.location.href = "/admin/blog";
      } catch (err) {
        toast.error(messages.admin.blogEditor.form.toast.error_delete);
        console.error(err);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* LEFT: Title + Content */}
      <section className="space-y-6">
        {/* Title */}
        <Card className="rounded-2xl border border-border/30 bg-background text-foreground shadow-sm transition-colors duration-300 hover:border-border/50">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-foreground"
              >
                {messages.admin.blogEditor.form.title_label}
              </Label>

              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder={messages.admin.blogEditor.form.title_placeholder}
                className="rounded-xl border-border/30 bg-background text-base font-semibold text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <Card className="rounded-2xl border border-border/30 bg-background text-foreground shadow-sm transition-colors duration-300 hover:border-border/50">
          <CardHeader className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {messages.admin.blogEditor.form.content_label}
            </Label>

            <p className="text-xs text-muted-foreground">
              {messages.admin.blogEditor.form.content_hint}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div
              data-color-mode="dark"
              className={cn(
                "[&_.w-md-editor]:rounded-xl [&_.w-md-editor]:border [&_.w-md-editor]:border-border/30 [&_.w-md-editor]:bg-background",
                "[&_.w-md-editor-toolbar]:border-border/30 [&_.w-md-editor-toolbar]:bg-muted/20",
                "[&_.w-md-editor-content]:bg-background"
              )}
            >
              <MDEditor
                value={data.content}
                onChange={(val) =>
                  setData({
                    ...data,
                    content: typeof val === "string" ? val : data.content,
                  })
                }
                height={400}
                preview="edit"
                visibleDragbar={false}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* RIGHT: Meta + Actions */}
      <aside className="space-y-6">
        <Card className="rounded-2xl border border-border/30 bg-background text-foreground shadow-sm transition-colors duration-300 hover:border-border/50">
          <CardHeader className="space-y-4">
            {/* Cover URL */}
            <div className="space-y-2">
              <Label
                htmlFor="cover"
                className="text-sm font-medium text-foreground"
              >
                {messages.admin.blogEditor.form.cover_label}
              </Label>

              <Input
                id="cover"
                value={data.coverUrl}
                onChange={(e) =>
                  setData({
                    ...data,
                    coverUrl: e.target.value,
                  })
                }
                placeholder={messages.admin.blogEditor.form.cover_placeholder}
                className="rounded-xl border-border/30 bg-background text-foreground placeholder:text-muted-foreground"
              />

              <div className="overflow-hidden rounded-xl border border-border/30 bg-muted/10">
                <AspectRatio ratio={16 / 9} className="relative">
                  {data.coverUrl ? (
                    <img
                      src={data.coverUrl}
                      alt={messages.admin.blogEditor.form.cover_preview_empty}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center text-[11px] text-muted-foreground">
                      {messages.admin.blogEditor.form.cover_preview_empty}
                    </div>
                  )}
                </AspectRatio>
              </div>

              <p className="text-[11px] text-muted-foreground">
                {messages.admin.blogEditor.form.cover_helper}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-sm font-medium text-foreground"
              >
                {messages.admin.blogEditor.form.tags_label}
              </Label>

              <Input
                id="tags"
                value={data.tags}
                onChange={(e) => setData({ ...data, tags: e.target.value })}
                placeholder={messages.admin.blogEditor.form.tags_placeholder}
                className="rounded-xl border-border/30 bg-background text-foreground placeholder:text-muted-foreground"
              />

              <p className="text-[11px] text-muted-foreground">
                {messages.admin.blogEditor.form.tags_helper}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {messages.admin.blogEditor.form.status_label}
              </Label>

              <Select
                value={data.status}
                onValueChange={(v) =>
                  setData({
                    ...data,
                    status: v.toUpperCase() as
                      | "DRAFT"
                      | "PUBLISHED"
                      | "SCHEDULED",
                  })
                }
              >
                <SelectTrigger className="rounded-xl border-border/30 bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                  <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border/30" />

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                disabled={pending}
                onClick={handleSave}
                className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
              >
                {initial?.id
                  ? messages.admin.blogEditor.form.actions.save_changes
                  : messages.admin.blogEditor.form.actions.create_draft}
              </Button>

              {initial?.id ? (
                <>
                  <Button
                    disabled={pending}
                    onClick={handlePublish}
                    variant="outline"
                    className="w-full rounded-xl border-border/30 text-xs font-medium hover:border-border/50 sm:text-sm"
                  >
                    {messages.admin.blogEditor.form.actions.publish}
                  </Button>

                  <Button
                    disabled={pending}
                    onClick={handleDelete}
                    variant="outline"
                    className="w-full rounded-xl border-border/30 text-xs font-medium text-red-500 hover:border-border/50 hover:text-red-600 sm:text-sm"
                  >
                    {messages.admin.blogEditor.form.actions.delete}
                  </Button>
                </>
              ) : null}
            </div>
          </CardHeader>
        </Card>
      </aside>
    </div>
  );
}
