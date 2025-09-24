"use server";
//using server actions instead of api routes and methods

//this links to the prisma database and we can write the methods to return our data
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";

// Get latest products
export async function getLatestProducts() {
  //fetch latest 4 products
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  //converts prisma object to plain object to avoid errors with types
  return convertToPlainObject(data);
}

//get single product by its slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
