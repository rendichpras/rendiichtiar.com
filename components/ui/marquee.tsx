"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean
  reverse?: boolean
  fade?: boolean
}

export function Marquee({
  children,
  className,
  reverse,
  pauseOnHover = false,
  fade = false,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:60s] [--gap:1rem]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] [--play-state:running] [animation:scroll_var(--duration)_linear_infinite]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[--play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] [--play-state:running] [animation:scroll_var(--duration)_linear_infinite]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[--play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>

      {fade && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent" />
        </>
      )}
    </div>
  )
} 