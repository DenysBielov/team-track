import { login, saveGoogleUser } from "@/lib/requests/user";
import NextAuth, { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
  Credentials(
    {
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize({ email, password }): Promise<User | null> {
        const user = await login(email as string, password as string)

        if (user) {
          return user
        } else {
          throw new Error(JSON.stringify({ errors: "Email or password is wrong", status: false }))
        }
      }
    },
  ),
  GoogleProvider({
    name: "google",
    async profile(profile: GoogleProfile) {
      const db_user = await saveGoogleUser({ ...profile, image: profile.picture })

      return {
        email: profile.email,
        image: profile.picture,
        name: profile.name,
        id: db_user.id,
      }
    }
  })
]

const authOptions: NextAuthConfig = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (user && account) {
        user.id = account.providerAccountId
      }

      return true
    },
    async jwt({ token, user, profile }) {
      if (token && profile) {
        token.sub = user.id!
      }

      return token
    },

    session({ session, token }) {
      if (!session) {
        return session;
      }

      session.user.id = token.sub as string;

      return session
    },
  },
  pages: {
    signIn: "/login"
  }
}

export interface ProviderDetails {
  id: string,
  name: string
}

export const availableProviders = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name } as ProviderDetails
  } else {
    return { id: provider.id, name: provider.name } as ProviderDetails
  }
})

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);