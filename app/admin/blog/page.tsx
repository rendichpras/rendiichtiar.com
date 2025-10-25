import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageTransition } from "@/components/animations/page-transition";

export default async function AdminBlogList() {
  const posts = await prisma.post.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { tags: { include: { tag: true } } },
  });

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 lg:pt-0 lg:pl-64">
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
                  Blog Admin
                </h1>
                <p className="text-sm text-muted-foreground">Kelola artikel</p>
              </div>
              <Link
                href="/admin/blog/new"
                className="rounded-2xl border border-border/30 px-4 py-2 text-sm transition-colors hover:border-border/50"
              >
                Tulis Baru
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-border/30 p-6 text-sm text-muted-foreground">
                Belum ada artikel.
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
                            className="text-lg font-semibold hover:underline sm:text-xl"
                          >
                            {p.title}
                          </Link>
                          {p.subtitle && (
                            <p className="text-sm text-muted-foreground">
                              {p.subtitle}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground sm:text-sm">
                            {p.publishedAt
                              ? `Terbit ${new Date(
                                  p.publishedAt
                                ).toLocaleDateString("id-ID")}`
                              : `Draf • diperbarui ${new Date(
                                  p.updatedAt
                                ).toLocaleDateString("id-ID")}`}
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            p.status === "PUBLISHED"
                              ? "border border-green-500/30 text-green-400"
                              : p.status === "SCHEDULED"
                              ? "border border-yellow-500/30 text-yellow-400"
                              : "border border-border/30 text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      {p.tags.length > 0 && (
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
                      )}

                      <div className="mt-4 flex items-center gap-3 text-sm">
                        <Link
                          href={`/admin/blog/${p.id}/edit`}
                          className="underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="underline"
                          target="_blank"
                        >
                          Lihat
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
