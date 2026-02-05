"use client"

import { memo } from "react"
import { BadgeCheck } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const VerifiedBadge = memo(function VerifiedBadge({
  label,
}: {
  label: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center text-primary"
            role="button"
            aria-label={label}
          >
            <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
          </div>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
