"use server";
//using server actions instead of api routes for mutations
import { PrismaClient } from "@/generated/prisma";
import { convertToPlainObject } from "../utils";
// Get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient();

  //fetch latest 4 products
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  //converts prisma object to plain object to avoid errors with types
  return convertToPlainObject(data);
}
