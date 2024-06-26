import { itemTypes } from "@/app/types";

interface CheckStockProps {
  cartItems: itemTypes[];
}

export const checkStock = async ({
  cartItems,
}: CheckStockProps): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkStock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      }
    );
    const data = await response.json();

    if (response.ok && data.isInStock) {
      return true;
    } else {
      console.log(data.error || "Stock is not sufficient");
      return false;
    }
  } catch (err) {
    console.error("Error checking stock:", err);
    return false;
  }
};
