"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function MessageSkeleton() {
  return (
    <div className="group">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full border border-border/30 sm:h-9 sm:w-9" />

        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>

          <Skeleton className="h-16 w-full rounded-md" />

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          <div className="mt-4 space-y-4 pl-4 sm:pl-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Skeleton className="h-5 w-5 shrink-0 rounded-full border border-border/30 sm:h-6 sm:w-6" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-3 w-20 rounded-md sm:h-4" />
                      <Skeleton className="h-3 w-16 rounded-md" />
                    </div>

                    <Skeleton className="mt-1 h-12 w-full rounded-md" />

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <Skeleton className="h-3 w-12 rounded-md sm:h-4" />
                      <Skeleton className="h-3 w-12 rounded-md sm:h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="mt-6 bg-border/40" />
    </div>
  )
}

export function AuthBarSkeleton() {
  return (
    <Card className="border-border/30 bg-card">
      <CardContent className="flex items-start gap-4">
        <Skeleton className="size-10 rounded-full border-2 border-border/30" />
        <div className="flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div className="min-w-0 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FormCardSkeleton() {
  return (
    <Card className="border-border/30 bg-card">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-28" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}
