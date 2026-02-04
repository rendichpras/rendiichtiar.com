import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export default function Page() {
  return (
    <>
      <AuthenticateWithRedirectCallback />
      <div id="clerk-captcha" />
    </>
  )
}
