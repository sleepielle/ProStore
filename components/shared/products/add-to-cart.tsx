"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { Minus, Plus, Loader, LoaderIcon } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error("Error ", {
          description: `${res.message}`,
        });
        return;
      }

      toast.success("Go to cart?", {
        description: `${res.message} `,
        className: "w-full",
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (res.success) {
        toast.success("Success!", { description: `${res.message}` });
      } else {
        toast.error("Error", { description: `${res.message}` });
      }
    });
  };

  //Check if item is in cart
  const itemExists =
    cart && cart.items.find((x) => x.productId === item.productId);

  return itemExists ? (
    <div>
      <Button type="button" variant={"outline"} onClick={handleRemoveFromCart}>
        {isPending ? (
          <LoaderIcon className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{itemExists?.quantity}</span>
      <Button type="button" variant={"outline"} onClick={handleAddToCart}>
        {isPending ? (
          <LoaderIcon className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <>
      <Button className="w-full mt-2" type="button" onClick={handleAddToCart}>
        {isPending ? (
          <LoaderIcon className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Add to Cart
      </Button>
    </>
  );
};

export default AddToCart;
