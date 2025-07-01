import { getServerSession } from "next-auth/next"
import { GuestbookContent } from "@/components/guestbook/GuestbookContent"
import { metadata } from "./metadata"

export { metadata }

export default async function GuestbookPage() {
  const session = await getServerSession()
  return <GuestbookContent session={session} />
} 