import { SignIn } from "@clerk/nextjs"
import { setRequestLocale } from "next-intl/server"

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params
  setRequestLocale(locale)

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md items-center justify-center px-4 py-8">
      <SignIn />
    </div>
  )
}
