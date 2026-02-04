"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  reverse?: boolean
  duration?: number | string
  repeat?: number
}

export function Marquee({
  children,
  pauseOnHover = false,
  reverse = false,
  duration = 30,
  repeat = 2,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
        className
      )}
      {...props}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around [gap:var(--gap)]",
              "animate-marquee flex-row",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]"
            )}
            style={{
              animationDuration:
                typeof duration === "number" ? `${duration}s` : duration,
            }}
          >
            {children}
          </div>
        ))}

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% - var(--gap)));
          }
        }
        .animate-marquee {
          animation: marquee var(--duration, 30s) linear infinite;
        }
      `}</style>
    </div>
  )
}
