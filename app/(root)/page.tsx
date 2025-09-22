import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/products/product-list";

//check loader.gif
//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
}
