"use client"

import { memo, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n, t } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import {
  MAIN_NAV,
  APP_NAV,
  SOCIAL_NAV,
  type NavItem,
  type SocialItem,
} from "./nav-config"

const MobileNavItem = memo(function MobileNavItem({
  item,
  pathname,
  onNavigate,
  label,
}: {
  item: NavItem
  pathname: string
  onNavigate: (path: string) => void
  label: string
}) {
  const active = pathname === item.path
  const Icon = item.icon

  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={cn(
        "relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 text-sm font-medium",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
      aria-current={active ? "page" : undefined}
      role="menuitem"
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="font-medium">{label}</span>
    </button>
  )
})

const MobileExternalItem = memo(function MobileExternalItem({
  name,
  href,
}: SocialItem) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary"
      role="menuitem"
    >
      <span className="font-medium">{name}</span>
      <ArrowUpRight className="ml-auto size-4" aria-hidden="true" />
    </a>
  )
})

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { messages } = useI18n()

  const navigate = useCallback(
    (path: string) => {
      setOpen(false)
      router.push(path)
    },
    [router]
  )

  useEffect(() => {
    if (typeof document === "undefined") return
    const prev = document.body.style.overflow
    document.body.style.overflow = open ? "hidden" : prev || ""
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          open
            ? messages.common.navigation.close_menu
            : messages.common.navigation.open_menu
        }
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed left-0 top-0 bottom-0 z-50 w-[280px] border-r bg-background lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={messages.common.navigation.nav_menu}
            id="mobile-menu"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <Logo
                  homeLabel={messages.pages.home.to_home}
                  verifiedLabel={messages.pages.home.verified}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setOpen(false)}
                  aria-label={messages.common.navigation.close_menu}
                >
                  <X className="size-5" aria-hidden="true" />
                </Button>
              </div>

              <nav
                className="flex-1 space-y-4 overflow-y-auto p-4"
                role="menu"
                aria-label={messages.common.navigation.main_menu}
              >
                <div className="space-y-1">
                  {MAIN_NAV.map((it) => (
                    <MobileNavItem
                      key={it.path}
                      item={it}
                      pathname={pathname}
                      onNavigate={navigate}
                      label={t(messages, it.nameKey)}
                    />
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    {messages.common.navigation.apps}
                  </div>

                  {APP_NAV.map((it) => (
                    <MobileNavItem
                      key={it.path}
                      item={it}
                      pathname={pathname}
                      onNavigate={navigate}
                      label={t(messages, it.nameKey)}
                    />
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    {messages.common.navigation.socials}
                  </div>

                  {SOCIAL_NAV.map((s) => (
                    <MobileExternalItem key={s.name} {...s} />
                  ))}
                </div>
              </nav>

              <div className="flex items-center justify-between p-4 pt-6">
                <ThemeToggle className="hover:scale-100" />
                <LanguageSwitcher variant="compact" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
