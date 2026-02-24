"use client"

import { useTranslations } from "next-intl"
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
          "h-9 w-9  border border-border bg-card text-muted-foreground hover:border-primary hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
        aria-label={label}
        title={label}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    </li>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const t = useTranslations("common")

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="py-6">
          <div className="flex flex-col gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t("footer.copyright", { year })}
            </p>

            <nav aria-label={t("footer.aria_label")}>
              <ul className="flex items-center justify-center gap-3 sm:justify-end">
                <SocialLink
                  href="https://github.com/rendichpras"
                  label={t("footer.social.github")}
                >
                  <SiGithub className="h-4 w-4" aria-hidden="true" />
                </SocialLink>

                <SocialLink
                  href="https://linkedin.com/in/rendiichtiar"
                  label={t("footer.social.linkedin")}
                >
                  <SiLinkedin className="h-4 w-4" aria-hidden="true" />
                </SocialLink>

                <SocialLink
                  href="https://instagram.com/rendiichtiar"
                  label={t("footer.social.instagram")}
                >
                  <SiInstagram className="h-4 w-4" aria-hidden="true" />
                </SocialLink>
              </ul>
            </nav>
          </div>

          <Separator className="mt-4 bg-border sm:hidden" />
        </div>
      </div>
    </footer>
  )
}
