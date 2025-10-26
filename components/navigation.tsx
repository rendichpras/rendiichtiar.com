"use client"

import { memo, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion"
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  Mail,
  Code,
  ArrowUpRight,
  BadgeCheck,
  NotebookPen,
  PanelRightOpen,
  PanelLeftOpen,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n, type Messages } from "@/lib/i18n"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type IconComp = React.ComponentType<{ className?: string }>
type NavItem = { path: string; nameKey: string; icon: IconComp }

const MAIN_NAV: readonly NavItem[] = [
  { path: "/", nameKey: "common.navigation.home", icon: Home },
  { path: "/about", nameKey: "common.navigation.about", icon: User },
  {
    path: "/guestbook",
    nameKey: "common.navigation.guestbook",
    icon: NotebookPen,
  },
  { path: "/contact", nameKey: "common.navigation.contact", icon: Mail },
  { path: "/blog", nameKey: "common.navigation.blog", icon: BookOpen },
] as const

const APP_NAV: readonly NavItem[] = [
  {
    path: "/playground",
    nameKey: "common.navigation.playground",
    icon: Code,
  },
] as const

type SocialItem = { name: string; href: string }
const SOCIAL_NAV: readonly SocialItem[] = [
  { name: "Email", href: "mailto:rendichpras@gmail.com" },
  { name: "LinkedIn", href: "https://linkedin.com/in/rendiichtiar" },
  { name: "GitHub", href: "https://github.com/rendichpras" },
  { name: "Instagram", href: "https://instagram.com/rendiichtiar" },
  { name: "Facebook", href: "https://facebook.com/rendiichtiar" },
] as const

const BASE_DELAY = 0.1

function t(messages: Messages, key: string) {
  const parts = key.split(".")
  let cur: any = messages
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = cur[p]
    } else {
      return key
    }
  }
  return typeof cur === "string" ? cur : key
}

const VerifiedBadge = memo(function VerifiedBadge({
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

const Logo = memo(function Logo({
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

const MobileNavContent = memo(function MobileNavContent({
  pathname,
  onNavigate,
  messages,
}: {
  pathname: string
  onNavigate: (path: string) => void
  messages: Messages
}) {
  const year = new Date().getFullYear()

  const appsLabel = messages.common.navigation.apps
  const socialsLabel = messages.common.navigation.socials
  const verifiedLabel = messages.pages.home.verified
  const homeAria = messages.pages.home.to_home

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <button
          onClick={() => onNavigate("/")}
          className="group inline-flex items-center gap-2 hover:text-primary"
          aria-label={homeAria}
        >
          <span className="text-xl font-semibold tracking-tight">
            rendiichtiar
          </span>
          <VerifiedBadge label={verifiedLabel} />
        </button>
      </div>

      <nav
        className="flex-1 space-y-2 p-3"
        role="menu"
        aria-label={messages.common.navigation.main_menu}
      >
        {MAIN_NAV.map((it) => (
          <MobileNavItem
            key={it.path}
            item={it}
            pathname={pathname}
            onNavigate={onNavigate}
            label={t(messages, it.nameKey)}
          />
        ))}

        <div className="px-4 pt-2 text-xs font-medium text-muted-foreground">
          {appsLabel}
        </div>

        {APP_NAV.map((it) => (
          <MobileNavItem
            key={it.path}
            item={it}
            pathname={pathname}
            onNavigate={onNavigate}
            label={t(messages, it.nameKey)}
          />
        ))}

        <div className="px-4 pt-2 text-xs font-medium text-muted-foreground">
          {socialsLabel}
        </div>

        {SOCIAL_NAV.map((s) => (
          <MobileExternalItem key={s.name} {...s} />
        ))}
      </nav>

      <div className="border-t p-6 text-center text-sm text-muted-foreground">
        © {year} rendiichtiar
      </div>
    </div>
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

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] border-r bg-background lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={messages.common.navigation.nav_menu}
              id="mobile-menu"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <button
                    onClick={() => navigate("/")}
                    className="group inline-flex items-center gap-2 hover:text-primary"
                    aria-label={messages.pages.home.to_home}
                  >
                    <span className="text-xl font-semibold tracking-tight">
                      rendiichtiar
                    </span>
                    <VerifiedBadge label={messages.pages.home.verified} />
                  </button>

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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function Navigation({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const { messages } = useI18n()

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 50)
  })

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 lg:hidden"
        role="banner"
      >
        <motion.div
          className={cn(
            "absolute inset-0 border-b border-border/30 bg-background/80 backdrop-blur-sm transition-all duration-300",
            scrolled ? "bg-background/90" : "bg-transparent"
          )}
          style={{
            boxShadow: scrolled ? "0 0 20px rgba(0,0,0,0.1)" : "none",
          }}
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
      <motion.aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 hidden border-r border-border/30 lg:flex lg:flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
        role="complementary"
        aria-label={messages.common.navigation.nav_menu}
      >
        <motion.div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300",
            scrolled ? "bg-background/90" : "bg-transparent"
          )}
          style={{
            boxShadow: scrolled ? "0 0 20px rgba(0,0,0,0.1)" : "none",
          }}
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
          <nav
            className="flex-1 space-y-4 overflow-y-auto p-4"
            role="navigation"
            aria-label={messages.common.navigation.main_menu}
          >
            <div className="space-y-1">
              {MAIN_NAV.map((it, i) => {
                const Icon = it.icon
                const active = pathname === it.path
                return (
                  <motion.div
                    key={it.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * BASE_DELAY }}
                  >
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
                      <span className={cn(collapsed && "hidden")}>
                        {t(messages, it.nameKey)}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: MAIN_NAV.length * BASE_DELAY,
                }}
                className={cn("px-3 py-2", collapsed && "sr-only")}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {messages.common.navigation.apps}
                </p>
              </motion.div>

              {APP_NAV.map((it, i) => {
                const Icon = it.icon
                const active = pathname === it.path
                return (
                  <motion.div
                    key={it.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: (MAIN_NAV.length + i) * BASE_DELAY,
                    }}
                  >
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
                      <span className={cn(collapsed && "hidden")}>
                        {t(messages, it.nameKey)}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            {!collapsed && (
              <div className="space-y-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: (MAIN_NAV.length + APP_NAV.length) * BASE_DELAY,
                  }}
                  className="px-3 py-2"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {messages.common.navigation.socials}
                  </p>
                </motion.div>

                {SOCIAL_NAV.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay:
                        (MAIN_NAV.length + APP_NAV.length + i) * BASE_DELAY,
                    }}
                  >
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
                  </motion.div>
                ))}
              </div>
            )}
          </nav>
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
      </motion.aside>
    </>
  )
}
