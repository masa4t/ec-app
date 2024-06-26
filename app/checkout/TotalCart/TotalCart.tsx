"use client";
import React from "react";
import "./totalCart.scss";
import { useAppSelector } from "@/app/global/hooks";

const TotalCart = () => {
  const { cartItems, total } = useAppSelector((state) => state.cart);

  return (
    <div className="total-body">
      {cartItems.map((item) => (
        <div className="item-container" key={item.id}>
          <img src={item.imageUrls[0]} />
          <div>{item.count}</div>
          <h2>{item.name}</h2>
          <p>￥ {item.price.toLocaleString()}</p>
        </div>
      ))}
      <div className="price-total">
        <h3>合計（税込）</h3>
        <p>￥ {total.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TotalCart;
