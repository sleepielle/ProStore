import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CredentialsSignInForm from "./credentials-form-sign-in";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  //if we are logged in, redirect to homepage
  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <>
      <div className="w-full max-w-md flex-col justify-center  ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md border border-gray-300 p-5 rounded-xl shadow-sm ">
          <Image
            alt={`${APP_NAME}`}
            src={"/images/logo.svg"}
            height={100}
            width={100}
            priority={true}
            className="mx-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700">
            Sign In
          </h2>
          <p className="text-center text-gray-500">Sign in to your account</p>
          <CredentialsSignInForm />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
