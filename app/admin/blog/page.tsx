import { prisma } from "@/lib/prisma";
import { PageTransition } from "@/components/animations/page-transition";
import { BlogList } from "@/components/pages/admin/blog/BlogList";

export default async function AdminBlogListPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { tags: { include: { tag: true } } },
  });

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 text-foreground lg:pl-64 lg:pt-0">
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
            <BlogList posts={posts} />
          </div>
        </section>
      </main>
    </PageTransition>
  );
}