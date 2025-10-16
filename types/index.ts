import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderSchema,
  insertOrderItemSchema,
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

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
