import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/pages/blog/PostForm"
import { PageTransition } from "@/components/animations/page-transition"

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const p = await prisma.post.findUnique({
        where: { id },
        include: { tags: { include: { tag: true } } },
    })

    if (!p) {
        return (
            <PageTransition>
                <main className="relative min-h-screen bg-background pt-16 lg:pt-0 lg:pl-64">
                    <section className="py-8 sm:py-12 md:py-16">
                        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
                            <div className="rounded-2xl border border-border/30 p-6 text-sm text-muted-foreground">
                                Artikel tidak ditemukan.
                            </div>
                        </div>
                    </section>
                </main>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <main className="relative min-h-screen bg-background pt-16 lg:pt-0 lg:pl-64">
                <section className="py-8 sm:py-12 md:py-16">
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
                                    Edit Artikel
                                </h1>
                                <p className="text-sm text-muted-foreground">Perbarui konten dan metadata</p>
                            </div>

                            <div className="rounded-2xl border border-border/30 p-4 sm:p-6">
                                <PostForm
                                    initial={{
                                        id: p.id,
                                        title: p.title,
                                        subtitle: p.subtitle ?? undefined,
                                        coverUrl: p.coverUrl ?? undefined,
                                        excerpt: p.excerpt,
                                        content: p.content,
                                        tags: p.tags.map((t) => t.tag.name).join(", "),
                                        status: p.status as any,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PageTransition>
    )
}