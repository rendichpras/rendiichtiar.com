"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { LogOut, User as UserIcon, ChevronsUpDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfileProps {
  collapsed?: boolean
}

export function UserProfile({ collapsed }: UserProfileProps) {
  const { isLoaded, isSignedIn, user } = useUser()
  const { openSignIn, signOut } = useClerk()
  const t = useTranslations("common.auth")

  if (!isLoaded) {
    return (
      <div
        className={cn("flex items-center gap-3", collapsed && "justify-center")}
      >
        <Skeleton className="h-8 w-8 rounded-full" />
        {!collapsed && (
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        )}
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center">
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => openSignIn()}
          >
            <UserIcon className="size-4" />
            <span className="sr-only">Sign In</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 relative flex items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary hover:text-primary"
            onClick={() => openSignIn()}
          >
            <UserIcon className="size-4" />
            <span>{t("login.action")}</span>
          </Button>
        )}
      </div>
    )
  }

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    ""
  const name = user?.fullName || user?.username || "Guest"
  const image = user?.imageUrl || ""
  const initial = (name || "G").charAt(0).toUpperCase()

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative flex w-full items-center gap-3 rounded-lg overflow-hidden transition-colors hover:bg-secondary",
              collapsed
                ? "h-10 justify-center px-0"
                : "h-auto px-3 py-2.5 justify-start"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0 border border-border">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden text-left">
                  <span className="w-full truncate text-sm font-medium leading-none">
                    {name}
                  </span>
                  <span className="w-full truncate text-xs text-muted-foreground mt-1">
                    {email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none truncate">
                {name}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("logout.title")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
