import { z } from "zod"
import { containsForbiddenWords } from "@/lib/constants/forbidden-words"

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100)
    .refine((val) => !containsForbiddenWords(val), {
      message: "forbidden_words",
    }),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000)
    .refine((val) => !containsForbiddenWords(val), {
      message: "forbidden_words",
    }),
})

export type ContactInput = z.infer<typeof contactSchema>

export const contactReplySchema = z.object({
  contactId: z.string().min(1, "Contact ID is required"),
  replyMessage: z.string().min(1, "Reply message is required"),
})

export type ContactReplyInput = z.infer<typeof contactReplySchema>
