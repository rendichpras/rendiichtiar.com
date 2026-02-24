"use client"

import { memo, useCallback, useEffect, useState } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  SLIDE_LEFT_PANEL_VARIANTS,
  STAGGER_CHILDREN_VARIANTS,
  SLIDE_RIGHT_CHILD_VARIANTS,
} from "@/lib/animations"
import { Logo } from "./Logo"
import {
  MAIN_NAV,
  APP_NAV,
  SOCIAL_NAV,
  type NavItem,
  type SocialItem,
} from "./nav-config"
import { UserProfile } from "./UserProfile"

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
        "relative flex w-full items-center gap-3 overflow-hidden  px-4 py-3 text-sm font-medium",
        active
          ? "bg-secondary text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-primary"
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
  t,
}: SocialItem & { t: (key: string) => string }) {
  return (
    <Button
      variant="ghost"
      asChild
      className="relative flex w-full items-center justify-start gap-3 overflow-hidden  px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
    >
      <a href={href} target="_blank" rel="noopener noreferrer" role="menuitem">
        <span className="font-medium">
          {t(`navigation.social_names.${name.toLowerCase()}`)}
        </span>
        <ArrowUpRight className="ml-auto size-4" aria-hidden="true" />
      </a>
    </Button>
  )
})

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const tCommon = useTranslations("common")
  const tPages = useTranslations("pages")
  const t = useTranslations()

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
        className=""
        onClick={() => setOpen((v) => !v)}
        aria-label={
          open
            ? tCommon("navigation.close_menu")
            : tCommon("navigation.open_menu")
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
              className="fixed inset-0 z-50 bg-black/80 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              variants={SLIDE_LEFT_PANEL_VARIANTS}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] border-r bg-background lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={tCommon("navigation.nav_menu")}
              id="mobile-menu"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <Logo homeLabel={tPages("home.to_home")} />

                  <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={() => setOpen(false)}
                    aria-label={tCommon("navigation.close_menu")}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </Button>
                </div>

                <motion.nav
                  className="flex-1 space-y-4 overflow-y-auto p-4"
                  role="menu"
                  aria-label={tCommon("navigation.main_menu")}
                  variants={STAGGER_CHILDREN_VARIANTS}
                  initial="closed"
                  animate="open"
                >
                  <div className="space-y-1">
                    {MAIN_NAV.map((it) => (
                      <motion.div
                        key={it.path}
                        variants={SLIDE_RIGHT_CHILD_VARIANTS}
                      >
                        <MobileNavItem
                          item={it}
                          pathname={pathname}
                          onNavigate={navigate}
                          label={t(it.nameKey)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <motion.div
                      variants={SLIDE_RIGHT_CHILD_VARIANTS}
                      className="px-3 py-2 text-xs font-medium text-muted-foreground"
                    >
                      {tCommon("navigation.apps")}
                    </motion.div>

                    {APP_NAV.map((it) => (
                      <motion.div
                        key={it.path}
                        variants={SLIDE_RIGHT_CHILD_VARIANTS}
                      >
                        <MobileNavItem
                          item={it}
                          pathname={pathname}
                          onNavigate={navigate}
                          label={t(it.nameKey)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <motion.div
                      variants={SLIDE_RIGHT_CHILD_VARIANTS}
                      className="px-3 py-2 text-xs font-medium text-muted-foreground"
                    >
                      {tCommon("navigation.socials")}
                    </motion.div>

                    {SOCIAL_NAV.map((s) => (
                      <motion.div
                        key={s.name}
                        variants={SLIDE_RIGHT_CHILD_VARIANTS}
                      >
                        <MobileExternalItem {...s} t={tCommon} />
                      </motion.div>
                    ))}
                  </div>
                </motion.nav>

                <div className="mt-auto flex flex-col gap-2 border-t px-4 py-4">
                  <UserProfile />
                  <div className="flex items-center justify-between">
                    <ThemeToggle className="hover:scale-100" />
                    <LanguageSwitcher variant="compact" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
