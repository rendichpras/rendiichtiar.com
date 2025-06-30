import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

function MessageSkeleton() {
  return (
    <div className="group">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-16 w-full" />
          
          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Reply List Skeleton */}
          <div className="pl-4 sm:pl-8 mt-4 space-y-4">
            {[1, 2].map((reply) => (
              <div key={reply}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-3 sm:h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-12 w-full mt-1" />
                    <div className="flex items-center gap-4 mt-2">
                      <Skeleton className="h-3 sm:h-4 w-12" />
                      <Skeleton className="h-3 sm:h-4 w-12" />
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
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Pesan Terbaru</h2>
            <p className="text-sm text-muted-foreground">Lihat apa yang orang lain katakan</p>
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