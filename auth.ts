import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";

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
  providers: [],
};

// handlers: object that has the http handlers for the endpoints nextauth uses. this helps the nextauth api routes
// auth handles the sessions and checks if the user is signed in or not
// if no sign in user, redirect to signin page
// if user signedout, redirect to signout page
export const { handlers, auth, signIn, signOut } = NextAuth(config);
