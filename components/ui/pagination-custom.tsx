"use client"

import { Suspense } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  totalPages: number
}

export function Pagination(props: PaginationProps) {
  return (
    <Suspense>
      <PaginationContent {...props} />
    </Suspense>
  )
}

function PaginationContent({ page, totalPages }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigate = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(1)}
        disabled={page === 1}
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(page - 1)}
        disabled={page === 1}
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 px-2 text-sm font-medium">
        <span>Page</span>
        <span className="min-w-[1.5rem] text-center">{page}</span>
        <span>of</span>
        <span className="min-w-[1.5rem] text-center">{totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(page + 1)}
        disabled={page === totalPages}
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(totalPages)}
        disabled={page === totalPages}
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
