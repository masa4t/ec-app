import React, { RefObject, useState } from "react";
import "./card.scss";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useAppSelector } from "@/app/global/hooks";
import { AddressRef } from "@/app/types";
import { checkStock } from "./function/checkStock";
import { handleSuccessfulPayment } from "./function/handleSuccessfulPayment";
import { useRouter } from "next/navigation";

interface CardProps {
  addressFormRef: React.RefObject<AddressRef>;
}

const Card: React.FC<CardProps> = ({ addressFormRef }) => {
  const addressData = addressFormRef.current;
  const customer = addressData?.getAddressData();

  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, total } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(addressData?.getAddressData());

    if (addressData?.validateForm) {
      // 住所のバリデーションチェック
      const isValid = await addressData.validateForm();
      if (!isValid) {
        console.log("Address validation errors.");
        return;
      }
    }

    // 在庫のバリデーションチェック
    const isStockValid = await checkStock({ cartItems });
    if (!isStockValid) {
      alert("カートに売り切れになってしまった商品があります。");
      console.log("Stock validation errors.");
      return;
    }

    // バリデーションが成功した場合の処理
    console.log("Form is valid. Proceeding with payment.");

    setIsLoading(true);

    if (!elements) {
      console.error("Stripe elements not found.");
      setIsLoading(false);
      return;
    }

    const result: any = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: customer?.lastName + " " + customer?.firstName,
            email: customer?.email,
            address: {
              country: "JP", // 手動で日本に設定
            },
          },
        },
      },
      redirect: "if_required", // 必要な場合のみリダイレクト
    });

    if (result?.error) {
      // 支払い失敗時の処理
      console.error("Payment failed:", result.error.message);
      setIsLoading(false);
    } else if (result?.paymentIntent?.status === "succeeded") {
      // 支払い成功時の処理
      console.log("Payment successful!");
      await handleSuccessfulPayment({
        total,
        cartItems,
        customer,
        paymentIntent: result.paymentIntent,
      });
      
      router.push(`/success?session_id=${result.paymentIntent.id}`);
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    fields: {
      billingDetails: {
        address: {
          country: "never",
        },
      },
    },
  };

  return (
    <div className="card-container">
      <h2>お支払い方法</h2>
      <p>すべての取引は安全で、暗号化されています。</p>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <PaymentElement
            className="card-input"
            options={paymentElementOptions}
          />
          <p>ご注文後の商品の交換／返品は原則受付けておりません。</p>
          <Link href="/">
            <button className="cancel-btn" type="button">
              キャンセル
            </button>
          </Link>
          <button className="purchase-btn" type="submit" disabled={isLoading}>
            {isLoading ? "処理中..." : "購入する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Card;
