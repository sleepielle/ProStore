"use client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src={"/images/logo.svg"}
        width={48}
        height={48}
        priority={true}
        alt="logo"
      />
      <div className="p-6 rounded-lg text-center w-1/3">
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button variant={"outline"} asChild className="mt-4 ml-2">
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
