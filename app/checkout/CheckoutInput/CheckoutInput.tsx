"use client";
import React, { useEffect, useRef, useState } from "react";
import "./checkoutInput.scss";
import Address from "./Adderss/Address";
import Card from "./Card/Card";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "@/app/global/hooks";
import { AddressRef } from "@/app/types";

const CheckoutInput = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const [clientSecret, setClientSecret] = useState("");
  const { amount, total, cartItems } = useAppSelector((state) => state.cart);
  const addressFormRef = useRef<AddressRef>(null);

  const addressData = addressFormRef.current;
  const cartItemIds = cartItems.map((item) => item.id);
  useEffect(() => {
    if (total <= 0) {
      return;
    }

    const fetchStripe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-payment-intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total }),
          }
        );

        if (res.ok) {
          const { clientSecret } = await res.json();
          console.log("Client secret:", clientSecret); // Debug log
          setClientSecret(clientSecret);
        } else {
          const { error } = await res.json();
          console.error("Error creating payment intent:", error);
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchStripe();
  }, [total, cartItems]);

  return (
    <div className="left-body">
      <div className="left-container">
        <Address ref={addressFormRef} />
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <Card addressFormRef={addressFormRef} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default CheckoutInput;
