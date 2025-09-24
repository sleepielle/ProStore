import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/products/product-list";

//check loader.gif
//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" />
    </>
  );
}
