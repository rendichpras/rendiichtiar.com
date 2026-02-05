import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { setRequestLocale } from "next-intl/server"

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params
  setRequestLocale(locale)

  return (
    <>
      <AuthenticateWithRedirectCallback />
      <div id="clerk-captcha" />
    </>
  )
}
