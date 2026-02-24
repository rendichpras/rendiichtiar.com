"use client"

import { memo } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export const Logo = memo(function Logo({
  className,
  homeLabel,
}: {
  className?: string
  homeLabel: string
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-1.5 font-medium hover:text-primary",
        className
      )}
      aria-label={homeLabel}
    >
      <span>rendiichtiar</span>
    </Link>
  )
})
