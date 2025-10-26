import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users, accounts } from "@/db/schema/schema"
import { getServerSession, type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "",

  session: { strategy: "jwt" },

  pages: { signIn: "/guestbook" },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = (token as any)?.userId
      }
      return session
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        ;(token as any).userId = (user as any).id
        ;(token as any).accessToken = (account as any).access_token
      }
      return token
    },
  },
}

export function auth() {
  return getServerSession(authOptions)
}
