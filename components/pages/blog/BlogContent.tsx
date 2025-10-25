"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { PageTransition } from "@/components/animations/page-transition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  coverUrl?: string | null;
  excerpt?: string | null;
  readingTime: number;
  publishedAt?: string | Date | null;
  views: number;
};

type BlogContentProps = {
  items: BlogListItem[];
  page: number;
  hasMore: boolean;
};

function toDate(input: string | Date | null | undefined) {
  if (!input) return null;
  return input instanceof Date ? input : new Date(input);
}

function safeTruncate(str: string | null | undefined, max: number) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

function BlogCard({
  item,
  readLabel,
  viewsLabel,
}: {
  item: BlogListItem;
  readLabel: string;
  viewsLabel: string;
}) {
  const publishedDate = toDate(item.publishedAt);
  const isLocalImage = item.coverUrl?.startsWith("/");

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl pt-0",
        "border border-border/30 bg-background text-foreground shadow-sm",
        "transition-colors duration-300 hover:border-border/50"
      )}
    >
      <div className="relative flex h-full flex-col">
        <Link
          href={`/blog/${item.slug}`}
          className="absolute inset-0 z-10"
          aria-label={item.title}
        />

        <div className="px-0 pt-0">
          {item.coverUrl ? (
            isLocalImage ? (
              <Image
                src={item.coverUrl}
                alt={item.title}
                width={800}
                height={450}
                className="aspect-video h-auto w-full rounded-t-xl object-cover"
                sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
            ) : (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="aspect-video h-auto w-full rounded-t-xl object-cover"
              />
            )
          ) : (
            <div className="aspect-video flex h-auto w-full items-center justify-center rounded-t-xl bg-muted/20 text-[10px] text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-4 sm:pb-0">
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:underline sm:text-lg">
            {safeTruncate(item.title, 120)}
          </h2>

          {item.excerpt ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {safeTruncate(item.excerpt, 180)}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
            <span>
              {item.readingTime} {readLabel}
            </span>

            {publishedDate ? (
              <>
                <span aria-hidden>•</span>
                <time
                  dateTime={publishedDate.toISOString()}
                  className="whitespace-nowrap"
                >
                  {publishedDate.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </>
            ) : null}

            {typeof item.views === "number" ? (
              <>
                <span aria-hidden>•</span>
                <span className="whitespace-nowrap">
                  {item.views} {viewsLabel}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function BlogContent({ items, page, hasMore }: BlogContentProps) {
  const { messages } = useI18n();

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background pt-16 text-foreground lg:pl-64 lg:pt-0">
        <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 xl:px-24">
          <header className="max-w-3xl space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {messages.metadata.blog.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {messages.metadata.blog.subtitle}
            </p>
          </header>

          <Separator className="my-6 bg-border/40" />

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <BlogCard
                key={post.id}
                item={post}
                readLabel={messages.metadata.blog.read_time}
                viewsLabel={messages.metadata.blog.views}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            {hasMore ? (
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-border/30 text-sm font-medium hover:border-border/50"
              >
                <Link
                  href={`/blog?page=${page + 1}`}
                  aria-label={messages.metadata.blog.load_more}
                >
                  {messages.metadata.blog.load_more}
                </Link>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                {messages.metadata.blog.no_more_posts}
              </p>
            )}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
