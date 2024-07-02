"use client";
import { useAppDispatch } from "@/app/global/hooks";
import { addToCart } from "@/app/global/slice";
import { itemTypes } from "@/app/types";
import Link from "next/link";
import React, { useState } from "react";
import "./default.scss";

interface DefaultType {
  product: itemTypes | null;
  handleNextProduct: () => void;
}

const stockCheck = async (productId: string, quantity: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/addCheck`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      }
    );
    const data = await response.json();
    return data.isAvailable;
  } catch (err) {
    console.error("在庫チェックに失敗しました", err);
    return false;
  }
};

const Default = ({ product, handleNextProduct }: DefaultType) => {
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handlePurchase = async () => {
    setLoading(true);
    if (product) {
      // 在庫チェックAPIを呼び出し
      const isAvailable = await stockCheck(product.id, count);
      if (isAvailable) {
        dispatch(addToCart({ product, count }));
      } else {
        alert("在庫が不足しています。");
      }
    }
  };

  const handleAdd = () => {
    setCount((prev) => prev + 1);
    if (product)
      if (product.stock <= count) {
        alert(
          `この商品の在庫は${product.stock}個ですこれ以上カートに商品を追加できません。`
        );
        setCount(product.stock);

        return;
      }
  };

  return (
    <>
      {product?.stock! > 0 ? (
        <>
          {product?.stock! < 10 ? (
            <p className="alert-stock">
              残り{product?.stock}点ご注文はお早めに
            </p>
          ) : (
            <p className="product-s">数量</p>
          )}

          <div className="select-area">
            <div className="select-amount">
              <button
                onClick={() => {
                  if (count > 1) {
                    setCount((prev) => prev - 1);
                  }
                }}
                className="count-btn"
              >
                -
              </button>
              <p>{count}</p>
              <button onClick={handleAdd} className="count-btn">
                +
              </button>
            </div>
            <button className="select-next" onClick={handleNextProduct}>
              next item　➡︎
            </button>
          </div>

          <div className="button-area">
            {loading ? (
              <button className="adding">adding...</button>
            ) : (
              <button className="first-btn" onClick={handlePurchase}>
                カートに入れる
              </button>
            )}

            <Link href="/">
              <button className="second-btn">買い物を続ける</button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <button className="sold-out-next" onClick={handleNextProduct}>
            next item　➡︎
          </button>

          <div className="button-area">
            <div className="select-area">
              <button className="sold-out">sold out</button>
            </div>

            <Link href="/">
              <button className="second-btn">買い物を続ける</button>
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Default;
