"use client";
import React from "react";
import "./incart.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/global/hooks";
import { removeCart } from "@/app/global/slice";
import { itemTypes } from "@/app/types";

interface IncartType {
  exisitingItem: itemTypes | null;
  handleNextProduct: () => void;
}

const InCart = ({ exisitingItem, handleNextProduct }: IncartType) => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const handleDelete = () => {
    dispatch(
      removeCart({
        productId: exisitingItem?.id!,
        count: exisitingItem?.count!,
        price: exisitingItem?.price!,
      })
    );
  };

  return (
    <>
      <>
        <div className="select-area">
          <div className="incart">✔︎　incart</div>
          <div className="next-page">
            <button onClick={handleNextProduct}>next item　➡︎</button>
          </div>
        </div>

        <div className="button-area-incart">
          <button className="first-btn" onClick={() => handleDelete()}>
            ×　　削除
          </button>

          <Link href="/">
            <button className="second-btn">買い物を続ける</button>
          </Link>
        </div>
      </>
    </>
  );
};

export default InCart;
