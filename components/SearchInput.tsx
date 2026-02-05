"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchInput(props: { placeholder: string }) {
  return (
    <Suspense fallback={<div className="h-10 w-full" />}>
      <SearchInputContent {...props} />
    </Suspense>
  )
}

function SearchInputContent({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      const currentQuery = params.get("q") || ""

      if (currentQuery === value) return

      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 500)

    return () => clearTimeout(handler)
  }, [value, router, pathname, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 bg-background border border-input shadow-none focus-visible:ring-1"
      />
    </div>
  )
}
