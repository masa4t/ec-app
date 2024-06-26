"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../global/hooks";
import { resetCart } from "../global/slice";
import { useSearchParams } from "next/navigation";
import "./success.scss";
import { itemTypes } from "../types";

const Success = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { cartItems } = useAppSelector((state) => state.cart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const dispatch = useAppDispatch();

  const fetchOrderDetails = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/get_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionId }),
        }
      );
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(resetCart());
    }

    if (sessionId) {
      fetchOrderDetails();
    }
  }, [sessionId, cartItems, dispatch]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
  };

  //   console.log(orderDetails);

  return (
    <>
      <div className="success-body">
        <h2 className="greet">
          この度は、当ショップをご利用いただき誠にありがとうございます。
        </h2>
        <p className="greet">
          ご注文は
          {orderDetails
            ? `${formatDate(orderDetails.createdAt)}に完了しました。`
            : "読み込み中..."}
        </p>
        {orderDetails?.orderItems.map((item: any) => (
          <div className="order_item">
            <img src={item.product.imageUrls[0]} />
            <p>{item.product.name}</p>
            <p>× {item.quantity}</p>
            <p>￥ {(item.quantity * item.product.price).toLocaleString()}</p>
          </div>
        ))}
        <div className="total-mony">
          合計金額: ￥ {orderDetails?.total.toLocaleString()}
        </div>
      </div>
    </>
  );
};

export default Success;
