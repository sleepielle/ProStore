"use server";

import { signInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in the user with credentials, due to different providers
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signUserOut() {
  await signOut();
}

/*
Server actions  eliminate the need for you to create an API route (/api/...) + fetch it with fetch() just to pass some data around. Instead we just call the server action like a normal function

In NextAuth, instead of making /api/signin and /api/signout, you directly expose signInWithCredentials and signUserOut as server actions.

*/
