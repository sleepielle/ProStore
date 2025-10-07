import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
} from "@/lib/zod-validators";

// Added more fields because these represent the storage data that the client has no access to, but is needed in the db.
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date; //inserted automatically
};

export type Cart = z.infer<typeof insertCartSchema> & {};

export type CartItem = z.infer<typeof cartItemSchema> & {};
export type CartActionResult = { success: boolean; message: string };
