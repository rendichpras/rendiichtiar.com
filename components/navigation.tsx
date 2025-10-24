"use client"

import { memo, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X, Home, BookOpen, User, Mail, Code, ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n, type Messages } from "@/lib/i18n"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type IconComp = React.ComponentType<{ className?: string }>
type NavItem = { path: string; nameKey: string; icon: IconComp }

const MAIN_NAV: readonly NavItem[] = [
  { path: "/", nameKey: "navigation.home", icon: Home },
  { path: "/about", nameKey: "navigation.about", icon: User },
  { path: "/guestbook", nameKey: "navigation.guestbook", icon: BookOpen },
  { path: "/contact", nameKey: "navigation.contact", icon: Mail },
] as const

const APP_NAV: readonly NavItem[] = [
  { path: "/playground", nameKey: "navigation.playground", icon: Code },
] as const

type SocialItem = { name: string; href: string }
const SOCIAL_NAV: readonly SocialItem[] = [
  { name: "Email", href: "mailto:rendichpras@gmail.com" },
  { name: "LinkedIn", href: "https://linkedin.com/in/rendiichtiar" },
  { name: "GitHub", href: "https://github.com/rendichpras" },
  { name: "Instagram", href: "https://instagram.com/rendiichtiar" },
  { name: "Facebook", href: "https://facebook.com/rendiichtiar" },
] as const

// sinkronisasi animasi judul seksi dengan item
const BASE_DELAY = 0.1

function t(messages: Messages, key: string) {
  const [s, k] = key.split(".")
  // @ts-expect-error index access
  return messages?.[s]?.[k] ?? key
}

const VerifiedBadge = memo(function VerifiedBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-pointer items-center" role="button" aria-label="Badge Terverifikasi">
            <svg className="size-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent>Terverifikasi</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

const Logo = memo(function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-1.5 font-medium hover:text-primary", className)} aria-label="Ke Beranda">
      <span>rendiichtiar</span>
      <VerifiedBadge />
    </Link>
  )
})

const MobileNavItem = memo(function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: (path: string) => void
}) {
  const { messages } = useI18n()
  const active = pathname === item.path
  const Icon = item.icon
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={cn(
        "relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 text-sm font-medium",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
      aria-current={active ? "page" : undefined}
      role="menuitem"
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="font-medium">{t(messages, item.nameKey)}</span>
    </button>
  )
})

const MobileExternalItem = memo(function MobileExternalItem({ name, href }: SocialItem) {
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
}: {
  pathname: string
  onNavigate: (path: string) => void
}) {
  const year = new Date().getFullYear()
  const { messages } = useI18n()
  const socialsLabel = (messages as any)?.navigation?.socials ?? "Media Sosial"

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <button onClick={() => onNavigate("/")} className="group inline-flex items-center gap-2 hover:text-primary">
          <span className="text-xl font-semibold tracking-tight">rendiichtiar</span>
          <VerifiedBadge />
        </button>
      </div>
      <nav className="flex-1 space-y-2 p-3" role="menu" aria-label="Menu Utama (Mobile)">
        {MAIN_NAV.map((it) => (
          <MobileNavItem key={it.path} item={it} pathname={pathname} onNavigate={onNavigate} />
        ))}
        <div className="px-4 pt-2 text-xs font-medium text-muted-foreground">{(messages as any)?.navigation?.apps ?? "Apps"}</div>
        {APP_NAV.map((it) => (
          <MobileNavItem key={it.path} item={it} pathname={pathname} onNavigate={onNavigate} />
        ))}
        <div className="px-4 pt-2 text-xs font-medium text-muted-foreground">{socialsLabel}</div>
        {SOCIAL_NAV.map((s) => (
          <MobileExternalItem key={s.name} {...s} />
        ))}
      </nav>
      <div className="border-t p-6 text-center text-sm text-muted-foreground">© {year} rendiichtiar</div>
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full sm:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? messages.navigation.close_menu : messages.navigation.open_menu}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] border-r bg-background lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi"
              id="mobile-menu"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <button onClick={() => navigate("/")} className="group inline-flex items-center gap-2 hover:text-primary" aria-label="Ke Beranda">
                    <span className="text-xl font-semibold tracking-tight">rendiichtiar</span>
                    <VerifiedBadge />
                  </button>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(false)} aria-label="Tutup Menu">
                    <X className="size-5" aria-hidden="true" />
                  </Button>
                </div>

                <nav className="flex-1 space-y-4 overflow-y-auto p-4" role="menu">
                  <div className="space-y-1">
                    {MAIN_NAV.map((it) => (
                      <MobileNavItem key={it.path} item={it} pathname={pathname} onNavigate={navigate} />
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground">{(messages as any)?.navigation?.apps ?? "Apps"}</div>
                    {APP_NAV.map((it) => (
                      <MobileNavItem key={it.path} item={it} pathname={pathname} onNavigate={navigate} />
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground">{(messages as any)?.navigation?.socials ?? "Media Sosial"}</div>
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

export function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const { messages } = useI18n()

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 50))

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 lg:hidden" role="banner">
        <motion.div
          className={cn(
            "absolute inset-0 border-b border-border/30 bg-background/80 backdrop-blur-sm transition-all duration-300",
            scrolled ? "bg-background/90" : "bg-transparent"
          )}
          style={{ boxShadow: scrolled ? "0 0 20px rgba(0,0,0,0.1)" : "none" }}
        />
        <div className="container relative mx-auto px-6">
          <nav className="flex h-16 items-center justify-between" role="navigation" aria-label="Menu Utama">
            <div className="flex items-center gap-2">
              <MobileNav />
              <Logo className="text-lg" />
            </div>
          </nav>
        </div>
      </header>

      <motion.aside
        className="fixed left-0 top-0 bottom-0 z-50 hidden w-64 flex-col border-r border-border/30 lg:flex"
        role="complementary"
        aria-label={messages.navigation.nav_menu}
      >
        <motion.div
          className={cn("absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300", scrolled ? "bg-background/90" : "bg-transparent")}
          style={{ boxShadow: scrolled ? "0 0 20px rgba(0,0,0,0.1)" : "none" }}
        />
        <div className="relative flex flex-1 flex-col p-6">
          <Logo className="mb-12 text-xl" />

          <nav className="flex-1 space-y-4" role="navigation" aria-label={messages.navigation.main_menu}>
            <div className="space-y-1">
              {MAIN_NAV.map((it, i) => {
                const Icon = it.icon
                const active = pathname === it.path
                return (
                  <motion.div key={it.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * BASE_DELAY }}>
                    <Link
                      href={it.path}
                      className={cn(
                        "group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium",
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{t(messages, it.nameKey)}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: MAIN_NAV.length * BASE_DELAY }}
                className="px-3 py-2"
              >
                <p className="text-xs font-medium text-muted-foreground">{(messages as any)?.navigation?.apps ?? "Apps"}</p>
              </motion.div>
              {APP_NAV.map((it, i) => {
                const Icon = it.icon
                const active = pathname === it.path
                return (
                  <motion.div
                    key={it.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (MAIN_NAV.length + i) * BASE_DELAY }}
                  >
                    <Link
                      href={it.path}
                      className={cn(
                        "group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium",
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{t(messages, it.nameKey)}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (MAIN_NAV.length + APP_NAV.length) * BASE_DELAY }}
                className="px-3 py-2"
              >
                <p className="text-xs font-medium text-muted-foreground">{(messages as any)?.navigation?.socials ?? "Media Sosial"}</p>
              </motion.div>
              {SOCIAL_NAV.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (MAIN_NAV.length + APP_NAV.length + i) * BASE_DELAY }}
                >
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="ml-auto size-4" aria-hidden="true" />
                  </a>
                </motion.div>
              ))}
            </div>
          </nav>

          <div className="mt-auto flex items-center justify-between px-3 pt-6">
            <ThemeToggle className="hover:scale-100" />
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </motion.aside>

      <div className="hidden w-64 lg:block" />
    </>
  )
}
