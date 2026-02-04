"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ArrowUpRight, PanelRightOpen, PanelLeftOpen } from "lucide-react"
import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n, t } from "@/lib/i18n"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"
import { MAIN_NAV, APP_NAV, SOCIAL_NAV } from "./nav-config"

export function Navigation({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { messages } = useI18n()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 lg:hidden"
        role="banner"
      >
        <div
          className={cn(
            "absolute inset-0 border-b border-border/30 bg-background transition-all duration-300",
            scrolled && "shadow-md"
          )}
        />
        <div className="container relative mx-auto px-6">
          <nav
            className="flex h-16 items-center justify-between"
            role="navigation"
            aria-label={messages.common.navigation.main_menu}
          >
            <div className="flex items-center gap-2">
              <MobileNav />
              <Logo
                className="text-lg"
                homeLabel={messages.pages.home.to_home}
                verifiedLabel={messages.pages.home.verified}
              />
            </div>
          </nav>
        </div>
      </header>

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 hidden border-r border-border/30 lg:flex lg:flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
        role="complementary"
        aria-label={messages.common.navigation.nav_menu}
      >
        <div
          className={cn(
            "absolute inset-0 bg-background transition-all duration-300",
            scrolled && "shadow-md"
          )}
        />

        <div className="relative flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div
              className={cn(
                "text-xl font-semibold leading-none",
                collapsed && "sr-only"
              )}
            >
              <Logo
                className="text-xl"
                homeLabel={messages.pages.home.to_home}
                verifiedLabel={messages.pages.home.verified}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onToggle}
              aria-label={
                collapsed
                  ? messages.common.navigation.open_menu
                  : messages.common.navigation.close_menu
              }
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" aria-hidden="true" />
              ) : (
                <PanelRightOpen className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>

          <TooltipProvider delayDuration={150}>
            <nav
              className="flex-1 space-y-4 overflow-y-auto p-4"
              role="navigation"
              aria-label={messages.common.navigation.main_menu}
            >
              <div className="space-y-1">
                {MAIN_NAV.map((it) => {
                  const Icon = it.icon
                  const active = pathname === it.path
                  const label = t(messages, it.nameKey)

                  const linkNode = (
                    <Link
                      href={it.path}
                      className={cn(
                        "group relative flex items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        className="size-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className={cn(collapsed && "hidden")}>{label}</span>
                    </Link>
                  )

                  return (
                    <div key={it.path}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{linkNode}</TooltipTrigger>
                          <TooltipContent
                            side="right"
                            align="center"
                            className="text-xs"
                          >
                            {label}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkNode
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="space-y-1">
                <div className={cn("px-3 py-2", collapsed && "sr-only")}>
                  <p className="text-xs font-medium text-muted-foreground">
                    {messages.common.navigation.apps}
                  </p>
                </div>

                {APP_NAV.map((it) => {
                  const Icon = it.icon
                  const active = pathname === it.path
                  const label = t(messages, it.nameKey)

                  const linkNode = (
                    <Link
                      href={it.path}
                      className={cn(
                        "group relative flex items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        className="size-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className={cn(collapsed && "hidden")}>{label}</span>
                    </Link>
                  )

                  return (
                    <div key={it.path}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{linkNode}</TooltipTrigger>
                          <TooltipContent
                            side="right"
                            align="center"
                            className="text-xs"
                          >
                            {label}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkNode
                      )}
                    </div>
                  )
                })}
              </div>

              {!collapsed && (
                <div className="space-y-1">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {messages.common.navigation.socials}
                    </p>
                  </div>

                  {SOCIAL_NAV.map((s) => (
                    <div key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group relative flex items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors",
                          "gap-3 px-3"
                        )}
                      >
                        <span>{s.name}</span>
                        <ArrowUpRight
                          className="ml-auto size-4"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </nav>
          </TooltipProvider>

          <div
            className={cn(
              "mt-auto flex items-center border-t px-4 py-4",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            <ThemeToggle className="hover:scale-100" />
            {!collapsed && <LanguageSwitcher variant="compact" />}
          </div>
        </div>
      </aside>
    </>
  )
}
