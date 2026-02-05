"use client"

import { useSignIn } from "@clerk/nextjs"
import type { OAuthStrategy } from "@clerk/types"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { SiGithub, SiGoogle } from "react-icons/si"

function SignInWithProviderButton({
  label,
  strategy,
  icon,
}: {
  label: string
  strategy: OAuthStrategy
  icon: React.ReactNode
}) {
  const { signIn } = useSignIn()
  const locale = useLocale()

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start gap-3 rounded-xl border-border/30 px-4 py-3 text-sm font-medium hover:border-border/50"
      onClick={() => {
        if (!signIn) return
        void signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: `/${locale}/sso-callback`,
          redirectUrlComplete: `/${locale}/guestbook`,
        })
      }}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
    </Button>
  )
}

export function SignInButton() {
  const t = useTranslations("common")

  return (
    <div className="flex flex-col gap-3">
      <SignInWithProviderButton
        label={t("auth.login.google")}
        strategy="oauth_google"
        icon={<SiGoogle className="size-4" aria-hidden="true" />}
      />
      <SignInWithProviderButton
        label={t("auth.login.github")}
        strategy="oauth_github"
        icon={<SiGithub className="size-4" aria-hidden="true" />}
      />
    </div>
  )
}
