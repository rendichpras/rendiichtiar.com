import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

function MessageSkeleton() {
  return (
    <div className="group">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>

          <Skeleton className="h-16 w-full" />

          {/* Action Buttons Skeleton */}
          <div className="mt-2 flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Reply List Skeleton */}
          <div className="mt-4 space-y-4 pl-4 sm:pl-8">
            {[1, 2].map((reply) => (
              <div key={reply}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Skeleton className="h-5 w-5 shrink-0 rounded-full sm:h-6 sm:w-6" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-3 w-20 sm:h-4" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="mt-1 h-12 w-full" />
                    <div className="mt-2 flex items-center gap-4">
                      <Skeleton className="h-3 w-12 sm:h-4" />
                      <Skeleton className="h-3 w-12 sm:h-4" />
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

export function GuestbookSkeleton() {
  return (
    <Card className="h-full bg-background/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Pesan Terbaru</h2>
            <p className="text-sm text-muted-foreground">
              Lihat apa yang orang lain katakan
            </p>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="h-[calc(100%-5rem)]">
        <CardContent>
          <div className="space-y-6 pr-4">
            {[1, 2, 3].map((item) => (
              <MessageSkeleton key={item} />
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
