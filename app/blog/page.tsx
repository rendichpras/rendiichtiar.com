import { getPosts } from "../blog/blog";
import { BlogContent } from "@/components/pages/blog/BlogContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const resolved = (await searchParams) ?? {};

  const tag = resolved.tag;
  const page = Number(resolved.page ?? 1);

  const { items, hasMore } = await getPosts({
    tag,
    page,
    pageSize: 10,
  });

  return <BlogContent items={items as any} page={page} hasMore={hasMore} />;
}
