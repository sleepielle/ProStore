import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days,
    // Note: This option is ignored if using JSON Web Tokens
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        //find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If assword is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user does not exist or password does not match, return null
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, trigger, token }) {
      // Set the user Id and role from the token when available
      if (session?.user) {
        if (token?.sub) {
          session.user.id = token.sub;
        }
        if (token && "role" in token && token.role) {
          // @ts-expect-error augmented by next-auth.d.ts
          session.user.role = token.role;
        }
      }

      // If the name changes, update the session too
      if (trigger === "update" && session?.user && user?.name) {
        session.user.name = user.name;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

// handlers: object that has the http handlers for the endpoints nextauth uses. this helps the nextauth api routes
// auth handles the sessions and checks if the user is signed in or not
// if no sign in user, redirect to signin page
// if user signedout, redirect to signout page
export const { handlers, auth, signIn, signOut } = NextAuth(config);
