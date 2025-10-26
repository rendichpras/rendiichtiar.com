"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si"
import { cn } from "@/lib/utils"

function SocialLink({
  href,
  label,
  children,
  className,
}: {
  href: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <li>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-xl border border-border/30 bg-card/30 text-muted-foreground hover:border-border/50 hover:bg-card/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40",
          className
        )}
        aria-label={label}
        title={label}
      >
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </Link>
      </Button>
    </li>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const { messages } = useI18n()

  return (
    <footer className="border-t border-border/30 bg-background/80 backdrop-blur-sm lg:pl-64">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="py-6">
          <div className="flex flex-col gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-xs text-muted-foreground sm:text-sm">
              {messages.common.footer.copyright.replace("{year}", String(year))}
            </p>

            <nav aria-label={messages.common.footer.aria_label}>
              <ul className="flex items-center justify-center gap-3 sm:justify-end">
                <SocialLink
                  href="https://github.com/rendichpras"
                  label={messages.common.footer.social.github}
                >
                  <SiGithub
                    className="h-4 w-4 text-foreground"
                    aria-hidden="true"
                  />
                </SocialLink>

                <SocialLink
                  href="https://linkedin.com/in/rendiichtiar"
                  label={messages.common.footer.social.linkedin}
                >
                  <SiLinkedin
                    className="h-4 w-4 text-[#0A66C2]"
                    aria-hidden="true"
                  />
                </SocialLink>

                <SocialLink
                  href="https://instagram.com/rendiichtiar"
                  label={messages.common.footer.social.instagram}
                >
                  <SiInstagram
                    className="h-4 w-4 text-[#E1306C]"
                    aria-hidden="true"
                  />
                </SocialLink>
              </ul>
            </nav>
          </div>

          <Separator className="mt-4 bg-border/20 sm:hidden" />
        </div>
      </div>
    </footer>
  )
}
