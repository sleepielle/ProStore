"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast.error("Error ", {
        description: `${res.message}`,
      });
      return;
    }

    toast.success("Go to cart?", {
      description: `${item.name} added to cart`,
      className: "w-full",
      action: {
        label: "Go to Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <>
      <Button className="w-full mt-2" type="button" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </>
  );
};

export default AddToCart;
