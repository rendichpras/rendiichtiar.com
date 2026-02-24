"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { SiGithub, SiGoogle } from "react-icons/si"
import { useSignIn } from "@clerk/nextjs"
import type { OAuthStrategy } from "@clerk/types"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  callbackUrlOverride?: string
}

export function LoginDialog({
  isOpen,
  onClose,
  callbackUrlOverride,
}: LoginDialogProps) {
  const t = useTranslations("common")
  const locale = useLocale()
  const pathname = usePathname()
  const callbackUrl = callbackUrlOverride || pathname || `/${locale}`

  const { signIn } = useSignIn()

  const signInWith = (strategy: OAuthStrategy) => {
    if (!signIn) return
    void signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: `/${locale}/sso-callback`,
      // @ts-expect-error - signInFallbackRedirectUrl is valid in runtime but missing in types
      signInFallbackRedirectUrl: callbackUrl,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border border-border bg-background text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {t("auth.login.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("auth.login.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => signInWith("oauth_google")}
            className="w-full justify-center gap-2 border-border text-sm font-medium hover:border-primary"
            aria-label={t("auth.login.google")}
          >
            <SiGoogle className="h-4 w-4 text-foreground" aria-hidden="true" />
            <span>{t("auth.login.google")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => signInWith("oauth_github")}
            className="w-full justify-center gap-2 border-border text-sm font-medium hover:border-primary"
            aria-label={t("auth.login.github")}
          >
            <SiGithub className="h-4 w-4 text-foreground" aria-hidden="true" />
            <span>{t("auth.login.github")}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
