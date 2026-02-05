import { z } from "zod"
import { containsForbiddenWords } from "@/lib/constants/forbidden-words"

export const guestbookSchema = z.object({
  message: z
    .string()
    .min(1, { message: "empty" })
    .max(280, { message: "message_too_long" })
    .refine((val) => !containsForbiddenWords(val), {
      message: "forbidden_words",
    }),
})

export type GuestbookInput = z.infer<typeof guestbookSchema>
