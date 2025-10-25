"use client"

import { useState, useTransition } from "react"
import { createPost, updatePost, publishPost, deletePost } from "@/app/blog/blog"

type PostInput = {
    id?: string
    title?: string
    subtitle?: string
    coverUrl?: string
    excerpt?: string
    content?: string
    tags?: string
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED"
}

export function PostForm({ initial }: { initial?: PostInput }) {
    const [data, setData] = useState<PostInput>({
        title: initial?.title ?? "",
        subtitle: initial?.subtitle ?? "",
        coverUrl: initial?.coverUrl ?? "",
        excerpt: initial?.excerpt ?? "",
        content: initial?.content ?? "",
        tags: initial?.tags ?? "",
        status: (initial?.status as any) ?? "DRAFT",
    })
    const [pending, start] = useTransition()

    const onSubmit = () => start(async () => {
        const payload = {
            title: data.title!.trim(),
            subtitle: data.subtitle?.trim() || undefined,
            excerpt: data.excerpt!.trim(),
            content: data.content!,
            coverUrl: data.coverUrl?.trim() || undefined,
            tags: (data.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
            status: data.status!,
        }
        if (initial?.id) {
            await updatePost(initial.id, payload)
            alert("Updated")
        } else {
            const res = await createPost(payload)
            window.location.href = `/admin/blog/${res.id}/edit`
        }
    })

    return (
        <div className="space-y-3">
            <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Judul" className="w-full rounded-xl border border-border/30 bg-background px-3 py-2" />
            <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} placeholder="Subjudul (opsional)" className="w-full rounded-xl border border-border/30 bg-background px-3 py-2" />
            <input value={data.coverUrl} onChange={(e) => setData({ ...data, coverUrl: e.target.value })} placeholder="Cover URL (opsional)" className="w-full rounded-xl border border-border/30 bg-background px-3 py-2" />
            <textarea value={data.excerpt} onChange={(e) => setData({ ...data, excerpt: e.target.value })} placeholder="Excerpt / ringkasan" className="w-full min-h-[80px] rounded-xl border border-border/30 bg-background px-3 py-2" />
            <textarea value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} placeholder="Konten Markdown" className="w-full min-h-[280px] rounded-xl border border-border/30 bg-background px-3 py-2 font-mono text-sm" />

            <input value={data.tags} onChange={(e) => setData({ ...data, tags: e.target.value })} placeholder="Tags dipisah koma, contoh: nextjs,react" className="w-full rounded-xl border border-border/30 bg-background px-3 py-2" />

            <div className="flex items-center gap-2">
                <select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value as any })} className="rounded-xl border border-border/30 bg-background px-3 py-2">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                </select>
                <button disabled={pending} onClick={onSubmit} className="rounded-xl border border-border/30 px-4 py-2 text-sm">{initial?.id ? "Simpan" : "Buat"}</button>
                {initial?.id && (
                    <>
                        <button disabled={pending} onClick={() => publishPost(initial.id!)} className="rounded-xl border border-border/30 px-4 py-2 text-sm">Publish</button>
                        <button disabled={pending} onClick={() => { if (confirm("Hapus artikel?")) deletePost(initial.id!) }} className="rounded-xl border border-border/30 px-4 py-2 text-sm">Hapus</button>
                    </>
                )}
            </div>
        </div>
    )
}
