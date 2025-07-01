"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function ContactSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-10 w-[200px]" />
      </div>

      {/* Table Header Skeleton */}
      <div className="rounded-md border">
        <div className="h-12 px-4 border-b flex items-center gap-4">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-5 w-[100px]" />
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-4 flex items-center gap-4 border-b last:border-b-0">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[100px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
} 