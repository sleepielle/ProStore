"use client";

import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
  // these are the values we are returning from the user.actions
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    );
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form action={action} className="space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={signInDefaultValues.email}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-gray-700 hover:text-yellow-500"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue={signInDefaultValues.password}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <SignInButton />

          {data !== undefined && !data.success && (
            <div className="text-center text-destructive text-sm mt-2">
              {data.message}
            </div>
          )}

          <div className="text-sm text-center text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              target="_self"
              className="link font-semibold hover:text-yellow-500 "
            >
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CredentialsSignInForm;
