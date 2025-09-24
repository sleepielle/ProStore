import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

//async function bc the prisma methods are async
// to run: npx tsx ./db/seed
async function main() {
  const prisma = new PrismaClient();

  //delete all products bc we dont want duplicates
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  console.log("Database seeded successfully");
}

main();
