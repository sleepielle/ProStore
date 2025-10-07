"use server";

import { cookies } from "next/headers";
import { CartActionResult, CartItem } from "@/types";
import {
  convertToPlainObject,
  formatError,
  roundToTwoDecimalPlaces,
} from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../zod-validators";
import { revalidatePath } from "next/cache";
import z from "zod";
import { Cart, Prisma } from "@prisma/client";

// Calculate cart prices

const moneyStr = z
  .string()
  .regex(/^\d+(\.\d{2})$/, "Price must have exactly two decimal places");

const calculatePrice = (items: CartItem[]) => {
  // Total of items's prices. Not the actual total bc that includes tax, shipping,etc.
  const itemsPrice = roundToTwoDecimalPlaces(
      items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    ),
    shippingPrice = roundToTwoDecimalPlaces(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwoDecimalPlaces(itemsPrice * 0.15),
    totalPrice = roundToTwoDecimalPlaces(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem): Promise<CartActionResult> {
  try {
    //Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user Id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get Cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calculatePrice([item]),
      });

      //Add to db
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in cart
      const itemExists = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (itemExists) {
        //Check stock
        if (product.stock < itemExists.quantity) {
          throw new Error("Not enough stock");
        }
        //Increase the quantity
        const existingItem = (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        );

        if (existingItem) {
          existingItem.quantity = itemExists.quantity + 1;
        }
      } else {
        //If item does not exist in cart

        //Check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        //Add item to the cart.items
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calculatePrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          itemExists ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return { success: false, message: String(formatError(error)) };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // Get session and user Id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  //if there is an user id, we can get the cart by user id, if not, we use the sessioncartid which would be guest mode
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  //Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(
  productId: string
): Promise<CartActionResult> {
  try {
    //Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const itemExists = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );

    if (!itemExists) throw new Error("Item not found");

    // Check if 1 or more quantity per item

    //Restructure array to return all ids EXCEPT the item
    if (itemExists.quantity === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== itemExists.productId
      );
    } else {
      itemExists.quantity = itemExists.quantity - 1;
    }

    //Update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calculatePrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
