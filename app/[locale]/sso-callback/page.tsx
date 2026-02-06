import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { setRequestLocale } from "next-intl/server"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl={`/${locale}`}
        signUpFallbackRedirectUrl={`/${locale}`}
      />
      <div id="clerk-captcha" />
    </>
  )
}
