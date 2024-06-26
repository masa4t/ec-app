"use client";
import { useAppDispatch, useAppSelector } from "@/app/global/hooks";
import Link from "next/link";
import React, { useEffect } from "react";
import "./selectCart.scss";
import { usePathname } from "next/navigation";
import { initializeCart } from "@/app/global/slice";

const SelectCart = () => {
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useEffect(() => {
    // コンポーネントの初期化時にローカルストレージからカートを読み込む
    dispatch(initializeCart());
  }, [dispatch]);

  const isCartPage = pathname === "/Cart";
  const isCheckoutPage = pathname === "/checkout";

  if (amount === 0 || isCartPage || isCheckoutPage) {
    return null;
  }

  return (
    <div className="total">
      <div className="total-content">
        {amount < 2 ? (
          <p>{amount} item in cart</p>
        ) : (
          <p>{amount} items in cart</p>
        )}
        <h2>小計 ￥{total.toLocaleString()}</h2>
      </div>
      <Link href="/Cart">
        <button className="cart">カート内容のご確認</button>
      </Link>
      <Link href="/checkout">
        <button className="purchase">ご注文手続きへ</button>
      </Link>
    </div>
  );
};

export default SelectCart;
