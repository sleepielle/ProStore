import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

//async function bc the prisma methods are async
// to run: npx tsx ./db/seed
async function main() {
  const prisma = new PrismaClient();

  //delete all data from the tables
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // data from the json file
  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log("Database seeded successfully");
}

main();
