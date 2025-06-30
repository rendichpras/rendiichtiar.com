"use client"

import { Menu, X, Home, BookOpen, User2, Mail } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { useState, useCallback } from "react"

// Shared Components and Constants
const navItems = [
  {
    path: "/",
    name: "Beranda",
    icon: Home
  },
  {
    path: "/about",
    name: "About",
    icon: User2
  },
  {
    path: "/guestbook",
    name: "Buku Tamu",
    icon: BookOpen
  },
  {
    path: "/contact",
    name: "Contact",
    icon: Mail
  }
]

const VerifiedBadge = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div 
          className="flex items-center"
          whileHover={{ rotate: 12 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg 
            className="size-5 text-blue-500" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
          </svg>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Verified</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const Logo = ({ className }: { className?: string }) => (
  <a href="/" className={cn("group inline-flex items-center gap-1.5 font-medium transition-all hover:text-primary", className)}>
    <span>rendiichtiar</span>
    <VerifiedBadge />
  </a>
)

// Mobile Navigation Components
const MobileNavItem = ({ 
  item, 
  pathname, 
  onNavigate 
}: { 
  item: typeof navItems[0]
  pathname: string
  onNavigate: (path: string) => void 
}) => {
  const isActive = pathname === item.path
  const Icon = item.icon

  return (
    <motion.button
      onClick={() => onNavigate(item.path)}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors relative overflow-hidden",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
      animate={isActive ? {
        backgroundColor: "rgba(var(--primary), 0.1)",
        color: "hsl(var(--primary))"
      } : {
        backgroundColor: "transparent",
        color: "hsl(var(--muted-foreground))"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        animate={isActive ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Icon className="size-5" />
      </motion.div>
      <span className="font-medium">{item.name}</span>
      {isActive && (
        <motion.div
          layoutId="activeTabMobile"
          className="ml-auto h-2 w-2 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

const MobileNavContent = ({ 
  pathname, 
  onNavigate 
}: { 
  pathname: string
  onNavigate: (path: string) => void 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <button 
          onClick={() => onNavigate("/")}
          className="group inline-flex items-center gap-2 transition-all hover:text-primary"
        >
          <span className="text-xl font-semibold tracking-tight">rendiichtiar</span>
          <VerifiedBadge />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => (
          <MobileNavItem 
            key={item.path}
            item={item}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="p-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} rendiichtiar
      </div>
    </div>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  const handleNavigation = useCallback((path: string) => {
    setIsOpen(false)
    router.push(path)
  }, [router])

  // Prevent scroll when menu is open
  if (typeof window !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="sm:hidden rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Menu className="size-5" />
          </motion.div>
          <span className="sr-only">Buka Menu</span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 lg:hidden bg-background border-r"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <motion.button 
                    onClick={() => handleNavigation("/")}
                    className="group inline-flex items-center gap-2 transition-colors hover:text-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl font-semibold tracking-tight">rendiichtiar</span>
                    <VerifiedBadge />
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="size-5" />
                      <span className="sr-only">Tutup Menu</span>
                    </Button>
                  </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <MobileNavItem 
                      key={item.path}
                      item={item}
                      pathname={pathname}
                      onNavigate={handleNavigation}
                    />
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Desktop Navigation
export function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  return (
    <>
      {/* Mobile Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <motion.div 
          className={cn(
            "absolute inset-0 border-b border-primary/10 bg-background/80 backdrop-blur-sm transition-all duration-300",
            isScrolled ? "bg-background/90" : "bg-transparent"
          )}
          style={{
            boxShadow: isScrolled ? "0 0 20px rgba(0,0,0,0.1)" : "none"
          }}
        />
        <div className="container relative mx-auto px-6">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <MobileNav />
              <Logo className="text-lg" />
            </div>
          </nav>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 z-50 hidden lg:flex flex-col w-64 border-r border-primary/10"
      >
        <motion.div 
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300",
            isScrolled ? "bg-background/90" : "bg-transparent"
          )}
          style={{
            boxShadow: isScrolled ? "0 0 20px rgba(0,0,0,0.1)" : "none"
          }}
        />
        
        <div className="relative flex flex-col flex-1 p-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logo className="text-xl mb-12" />
          </motion.div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <motion.a
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors overflow-hidden",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={false}
                  animate={isActive ? {
                    backgroundColor: "rgba(var(--primary), 0.1)",
                    color: "hsl(var(--primary))"
                  } : {
                    backgroundColor: "transparent",
                    color: "hsl(var(--muted-foreground))"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.div
                    animate={isActive ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className="size-4" />
                  </motion.div>
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.a>
              )
            })}
          </nav>

          <motion.div 
            className="mt-auto pt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </motion.aside>

      {/* Content Margin for Desktop */}
      <div className="hidden lg:block w-64" />
    </>
  )
} 