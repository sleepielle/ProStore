import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

// zod infers the types based on the validator we created
// it includes the fields in the validator
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date; //inserted automatically
};
