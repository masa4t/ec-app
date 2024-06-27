import { AddressData, itemTypes } from "@/app/types";

interface PaymentSuccessParams {
  cartItems: itemTypes[];
  customer: AddressData | undefined;
  paymentIntent: any;
  total: number;
}

export const handleSuccessfulPayment = async ({
  cartItems,
  customer,
  paymentIntent,
  total,
}: PaymentSuccessParams) => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error("NEXT_PUBLIC_BASE_URL is not defined");
    return;
  }

  const body = JSON.stringify({ cartItems, customer, paymentIntent, total });
  console.log("Request body:", body); // ここでコンソールに出力

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/success_payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }
    );

    if (response.ok) {
      console.log("Payment and stock update successful");
    } else {
      const errorData = await response.json();
      console.error("Error updating payment and stock:", errorData);
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
};
