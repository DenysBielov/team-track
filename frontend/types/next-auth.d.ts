import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"]
  }

  interface User {
    roles?: Array<string>
  } 
}