import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return <>HomePage</>;
}
