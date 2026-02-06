"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
  children?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Icon className="h-6 w-6 text-foreground/50" />
        </div>
      )}
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
