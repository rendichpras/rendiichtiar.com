'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getGuestbookEntries() {
  const entries = await prisma.guestbook.findMany({
    where: {
      parentId: null // Hanya ambil pesan utama (bukan reply)
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        include: {
          accounts: {
            select: {
              provider: true
            }
          }
        }
      },
      replies: {
    include: {
      user: true,
          mentionedUser: true,
          likes: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      likes: {
        include: {
          user: true
        }
      }
    },
    take: 50,
  })

  return entries.map(entry => ({
    id: entry.id,
    message: entry.message,
    createdAt: entry.createdAt,
    user: {
      name: entry.user.name,
      image: entry.user.image,
      email: entry.user.email
    },
    provider: entry.user.accounts[0]?.provider || "unknown",
    likes: entry.likes.map(like => ({
      id: like.id,
      user: {
        name: like.user.name,
        email: like.user.email
      }
    })),
    replies: entry.replies.map(reply => ({
      id: reply.id,
      message: reply.message,
      createdAt: reply.createdAt,
      user: {
        name: reply.user.name,
        image: reply.user.image,
        email: reply.user.email
      },
      mentionedUser: reply.mentionedUser ? {
        name: reply.mentionedUser.name
      } : null,
      likes: reply.likes.map(like => ({
        id: like.id,
        user: {
          name: like.user.name,
          email: like.user.email
        }
      }))
    }))
  }))
}

export async function addGuestbookEntry(
  message: string, 
  email: string, 
  parentId?: string,
  mentionedUsername?: string
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  let mentionedUser = null
  if (mentionedUsername) {
    mentionedUser = await prisma.user.findFirst({
      where: {
        name: mentionedUsername
      }
    })
  }

  await prisma.guestbook.create({
    data: {
      message,
      userId: user.id,
      parentId,
      mentionedUserId: mentionedUser?.id
    },
  })
  
  revalidatePath('/guestbook')
}

// Fungsi untuk mendapatkan daftar user untuk mention
export async function getUsers(search: string) {
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true,
      image: true
    },
    take: 5
  })

  return users
}

// Fungsi untuk toggle like
export async function toggleLike(guestbookId: string, email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_guestbookId: {
        userId: user.id,
        guestbookId,
      },
    },
  })

  if (existingLike) {
    // Unlike jika sudah like
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    })
  } else {
    // Like jika belum
    await prisma.like.create({
      data: {
        userId: user.id,
        guestbookId,
      },
    })
  }

  revalidatePath('/guestbook')
} 