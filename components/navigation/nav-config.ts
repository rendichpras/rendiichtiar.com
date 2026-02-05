import { Home, User, Mail, Code, NotebookPen, BookOpen } from "lucide-react"

export type IconComp = React.ComponentType<{ className?: string }>
export type NavItem = { path: string; nameKey: string; icon: IconComp }
export type SocialItem = { name: string; href: string }

export const MAIN_NAV: readonly NavItem[] = [
  { path: "/", nameKey: "common.navigation.home", icon: Home },
  { path: "/about", nameKey: "common.navigation.about", icon: User },
  {
    path: "/guestbook",
    nameKey: "common.navigation.guestbook",
    icon: NotebookPen,
  },
  { path: "/blog", nameKey: "common.navigation.blog", icon: BookOpen },
  { path: "/contact", nameKey: "common.navigation.contact", icon: Mail },
] as const

export const APP_NAV: readonly NavItem[] = [
  {
    path: "/playground",
    nameKey: "common.navigation.playground",
    icon: Code,
  },
] as const

export const SOCIAL_NAV: readonly SocialItem[] = [
  { name: "Email", href: "mailto:rendichpras@gmail.com" },
  { name: "LinkedIn", href: "https://linkedin.com/in/rendiichtiar" },
  { name: "GitHub", href: "https://github.com/rendichpras" },
  { name: "Instagram", href: "https://instagram.com/rendiichtiar" },
  { name: "Facebook", href: "https://facebook.com/rendiichtiar" },
] as const

export const BASE_DELAY = 0.1
