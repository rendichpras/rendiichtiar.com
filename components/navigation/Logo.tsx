"use client"

import { memo } from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "./VerifiedBadge"

export const Logo = memo(function Logo({
  className,
  homeLabel,
  verifiedLabel,
}: {
  className?: string
  homeLabel: string
  verifiedLabel: string
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
      <VerifiedBadge label={verifiedLabel} />
    </Link>
  )
})
