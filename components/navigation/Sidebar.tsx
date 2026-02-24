"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { PanelLeftOpen, PanelRightOpen, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SLIDE_RIGHT_VARIANTS } from "@/lib/animations"

import { Logo } from "./Logo"
import { MobileNav } from "./MobileNav"
import { UserProfile } from "./UserProfile"
import { MAIN_NAV, APP_NAV, SOCIAL_NAV } from "./nav-config"
import { useEffect, useState } from "react"

export function Navigation({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const tCommon = useTranslations("common")
  const tPages = useTranslations("pages")
  const t = useTranslations()

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
            "absolute inset-0 border-b border-border bg-background transition-all duration-300",
            scrolled && ""
          )}
        />
        <div className="container relative mx-auto px-6">
          <nav
            className="flex h-16 items-center justify-between"
            role="navigation"
            aria-label={tCommon("navigation.main_menu")}
          >
            <div className="flex items-center gap-2">
              <MobileNav />
              <Logo className="text-lg" homeLabel={tPages("home.to_home")} />
            </div>
          </nav>
        </div>
      </header>

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 hidden border-r border-border lg:flex lg:flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
        role="complementary"
        aria-label={tCommon("navigation.nav_menu")}
      >
        <div
          className={cn(
            "absolute inset-0 bg-background transition-all duration-300",
            scrolled && ""
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
              <Logo className="text-xl" homeLabel={tPages("home.to_home")} />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggle}
              aria-label={
                collapsed
                  ? tCommon("navigation.open_menu")
                  : tCommon("navigation.close_menu")
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
            <motion.nav
              className="flex-1 space-y-4 overflow-y-auto p-4"
              role="navigation"
              aria-label={tCommon("navigation.main_menu")}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.2 },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <div className="space-y-1">
                {MAIN_NAV.map((it) => {
                  const Icon = it.icon
                  const active = pathname === it.path
                  const label = t(it.nameKey)

                  const linkNode = (
                    <Link
                      href={it.path}
                      className={cn(
                        "group relative flex items-center overflow-hidden  py-2.5 text-sm font-medium transition-colors",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        active
                          ? "bg-secondary text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-primary"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        className="border-none size-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className={cn(collapsed && "hidden")}>{label}</span>
                    </Link>
                  )

                  return (
                    <motion.div key={it.path} variants={SLIDE_RIGHT_VARIANTS}>
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
                    </motion.div>
                  )
                })}
              </div>

              <div className="space-y-1">
                <motion.div
                  className={cn("px-3 py-2", collapsed && "sr-only")}
                  variants={SLIDE_RIGHT_VARIANTS}
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {tCommon("navigation.apps")}
                  </p>
                </motion.div>

                {APP_NAV.map((it) => {
                  const Icon = it.icon
                  const active = pathname === it.path
                  const label = t(it.nameKey)

                  const linkNode = (
                    <Link
                      href={it.path}
                      className={cn(
                        "group relative flex items-center overflow-hidden  py-2.5 text-sm font-medium transition-colors",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        active
                          ? "bg-secondary text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-primary"
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
                    <motion.div key={it.path} variants={SLIDE_RIGHT_VARIANTS}>
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
                    </motion.div>
                  )
                })}
              </div>

              {!collapsed && (
                <div className="space-y-1">
                  <motion.div
                    className="px-3 py-2"
                    variants={SLIDE_RIGHT_VARIANTS}
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      {tCommon("navigation.socials")}
                    </p>
                  </motion.div>

                  {SOCIAL_NAV.map((s) => (
                    <motion.div key={s.name} variants={SLIDE_RIGHT_VARIANTS}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group relative flex items-center overflow-hidden  py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors",
                          "gap-3 px-3"
                        )}
                      >
                        <span>
                          {tCommon(
                            `navigation.social_names.${s.name.toLowerCase()}`
                          )}
                        </span>
                        <ArrowUpRight
                          className="ml-auto size-4"
                          aria-hidden="true"
                        />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.nav>
          </TooltipProvider>

          <div
            className={cn(
              "mt-auto flex flex-col gap-2 border-t px-2 py-4",
              !collapsed && "px-4"
            )}
          >
            <UserProfile collapsed={collapsed} />
            <div
              className={cn(
                "flex items-center gap-2",
                collapsed ? "justify-center flex-col" : "justify-between"
              )}
            >
              <ThemeToggle className="hover:scale-100" />
              {!collapsed && <LanguageSwitcher variant="compact" />}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
