"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function ContactTableSkeleton() {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <div className="p-4">
        <div className="flex flex-col items-center gap-4 py-4 sm:flex-row">
          <Skeleton className="h-10 w-full sm:max-w-sm" />
          <Skeleton className="h-10 w-full sm:ml-auto sm:w-[120px]" />
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex h-11 items-center gap-4 border-b border-border/50 px-6">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>

          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-border/50 px-6 py-3 last:border-0"
            >
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-12 w-[200px]" />
              <Skeleton className="h-6 w-[80px] rounded-full" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 sm:mt-6">
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[90px]" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
        </div>
      </div>
    </Card>
  )
}
