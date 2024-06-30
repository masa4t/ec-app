"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../global/hooks";
import { resetCart } from "../global/slice";
import "./success.scss";
import Loading from "../components/loading/Loading";

interface OrderDetails {
  createdAt: string;
  orderItems: Array<{
    id: string;
    product: {
      imageUrls: string[];
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
}

const Success = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { cartItems } = useAppSelector((state) => state.cart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState<boolean>(true);
  const [animationDuration, setAnimationDuration] = useState("0s");

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
      const data: OrderDetails = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (cartItems.length) {
      dispatch(resetCart());
    }

    if (sessionId) {
      setLoading(true); // セッションIDが存在する場合にローディング状態を設定
      const startTime = Date.now();
      fetchOrderDetails().then(() => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        setAnimationDuration(`${duration}s`);
        setLoading(false);
      });
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

  return (
    <>
      {loading ? (
        <Loading
          style={
            { "--animation-duration": animationDuration } as React.CSSProperties
          }
        />
      ) : (
        <div
          className="success-body"
          style={
            { "--animation-duration": animationDuration } as React.CSSProperties
          }
        >
          <h2 className="greet">
            この度は、当ショップをご利用いただき誠にありがとうございます。
          </h2>
          <p className="greet">
            ご注文は
            {orderDetails
              ? `${formatDate(orderDetails.createdAt)}に完了しました。`
              : "読み込み中..."}
          </p>
          {orderDetails?.orderItems.map((item) => (
            <div className="order_item" key={item.id}>
              <img src={item.product.imageUrls[0]} alt={item.product.name} />
              <p>{item.product.name}</p>
              <p>× {item.quantity}</p>
              <p>￥ {(item.quantity * item.product.price).toLocaleString()}</p>
            </div>
          ))}
          <div className="total-mony">
            合計金額: ￥ {orderDetails?.total.toLocaleString()}
          </div>
        </div>
      )}
    </>
  );
};

export default function WrappedSuccess() {
  return (
    <Suspense fallback={<Loading />}>
      <Success />
    </Suspense>
  );
}
