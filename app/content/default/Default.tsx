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

const Default = ({ product, handleNextProduct }: DefaultType) => {
  const [count, setCount] = useState<number>(1);
  const dispatch = useAppDispatch();

  const handlePurchase = () => {
    if (product) {
      dispatch(addToCart({ product, count }));
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
            <button className="first-btn" onClick={handlePurchase}>
              カートに入れる
            </button>

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
