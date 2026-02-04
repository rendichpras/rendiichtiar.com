import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md items-center justify-center px-4 py-8">
      <SignUp />
    </div>
  )
}
