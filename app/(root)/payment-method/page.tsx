import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "./payment-method-form";
import { get } from "http";
import { getUserById } from "@/lib/actions/user.actions";
import { PaymentMethod } from "@/types";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Select Payment Method",
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
