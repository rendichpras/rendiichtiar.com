import { guestbookSchema } from "@/lib/validations/guestbook"

export function validateGuestbookMessage(message: string) {
  const result = guestbookSchema.safeParse({ message })

  if (!result.success) {
    throw new Error(result.error.issues[0].message)
  }

  return result.data.message.trim()
}
