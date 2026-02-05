"use client"

import { useTransition } from "react"
import { deletePost } from "@/lib/actions/blog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

export function DeletePostButton({
  id,
  className,
}: {
  id: string
  className?: string
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      startTransition(async () => {
        const result = await deletePost(id)
        if (result.message === "Deleted Post") {
          toast.success("Post deleted")
        } else {
          toast.error("Failed to delete post")
        }
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-destructive hover:bg-destructive/10", className)}
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
