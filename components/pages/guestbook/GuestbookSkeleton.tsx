"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MessageSkeleton() {
  return (
    <div className="group">
      <Card className="border-border bg-card transition-colors duration-300 hover:border-primary">
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 shrink-0  border border-border" />

            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24 " />
                  <Skeleton className="h-4 w-4 " />
                  <Skeleton className="h-4 w-4 " />
                </div>
                <Skeleton className="h-3 w-24 " />
              </div>

              <Skeleton className="h-16 w-full " />

              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Skeleton className="h-8 w-16 " />
                <Skeleton className="h-8 w-16 " />
                <Skeleton className="h-8 w-24 " />
              </div>

              <div className="mt-3 space-y-4 border-l border-border pl-4 sm:pl-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Skeleton className="mt-0.5 h-6 w-6 shrink-0  border border-border sm:h-7 sm:w-7" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Skeleton className="h-3 w-20  sm:h-4" />
                          <Skeleton className="h-3 w-16 " />
                        </div>

                        <Skeleton className="mt-1 h-12 w-full " />

                        <div className="mt-2 flex flex-wrap items-center gap-4">
                          <Skeleton className="h-3 w-12  sm:h-4" />
                          <Skeleton className="h-3 w-12  sm:h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AuthBarSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-start gap-4">
        <Skeleton className="size-10  border-2 border-border" />
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
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-28" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-14 w-full " />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24 " />
        </div>
      </CardContent>
    </Card>
  )
}
