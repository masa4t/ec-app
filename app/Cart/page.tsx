"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../global/hooks";
import Link from "next/link";
import "./cart.scss";
import {
  decreaseItem,
  increaseItem,
  initializeCart,
  removeCart,
} from "../global/slice";
import { itemTypes } from "../types";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cartItems, total, amount } = useAppSelector((state) => state.cart);
  const router = useRouter();
  const [isCartInitialized, setIsCartInitialized] = useState(false);
  console.log(cartItems);
  const dispatch = useAppDispatch();

  //cartの中身が空ならホームへ
  // カートの初期化
  useEffect(() => {
    dispatch(initializeCart());
    setIsCartInitialized(true); // カートが初期化されたことを示すフラグをセット
  }, [dispatch]);

  // カートの中身が空ならホームへリダイレクト
  useEffect(() => {
    if (isCartInitialized && amount === 0) {
      router.push("/");
    }
  }, [amount, isCartInitialized, router]);

  const handleDelete = (item: itemTypes) => {
    dispatch(
      removeCart({ productId: item.id, count: item.count, price: item.price })
    );
  };

  const handleIncrease = (item: itemTypes) => {
    if (item.stock < item.count + 1) {
      alert(
        `この商品の在庫は${item.stock}個ですこれ以上カートに商品を追加できません。`
      );
      return;
    }
    dispatch(increaseItem(item));
  };

  const handleDecrease = (item: itemTypes) => {
    if (item.count > 1) {
      dispatch(decreaseItem(item));
    } else {
      dispatch(
        removeCart({ productId: item.id, count: item.count, price: item.price })
      );
    }
  };

  return (
    <>
      <div className="cart-container">
        <div className="cart-top">
          <h2>cart</h2>
          {amount < 2 ? (
            <p>{amount} item in cart</p>
          ) : (
            <p>{amount} items in cart</p>
          )}
        </div>
        <div className="cart-detail">
          {cartItems.map((item) => (
            <div className="items-container" key={item.id}>
              <Link href={`/content/${item.id}`}>
                <img src={item.imageUrls[0]} />
              </Link>
              <h2>{item.name}</h2>
              <div className="btn-area">
                <button onClick={() => handleDecrease(item)}>-</button>
                <p>× {item.count}</p>
                <button onClick={() => handleIncrease(item)}>+</button>
              </div>
              <button onClick={() => handleDelete(item)} className="delete-btn">
                削除
              </button>
              <h3>￥ {item.price.toLocaleString()}</h3>
            </div>
          ))}
          <p className="cart-total">合計金額: ￥ {total.toLocaleString()} </p>
        </div>
        <div className="cart-btn">
          <Link href="/">
            <button className="first-btn">買い物を続ける</button>
          </Link>
          <Link href="/checkout">
            <button className="second-btn">ご注文手続きへ</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
