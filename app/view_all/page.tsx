// "use client";
// import React, { useEffect, useState } from "react";
import "./view_all.scss";
import { itemTypes } from "../types";
import Link from "next/link";

async function fetchProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/syncProducts`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data;
}

const ViewAll = async () => {
  const products = await fetchProducts();

  return (
    <div className="view-container">
      {products.map((product: itemTypes) => (
        <Link href={`/content/${product.id}`} key={product.id}>
          <div className="product-container">
            <img src={product.imageUrls[0]} alt={product.name} />
            {product.stock < 1 ? (
              <>
                <div className="sold">
                  <p>sold out</p>
                </div>
              </>
            ) : (
              <>
                <div className="price-overlay">
                  <p>￥ {product.price.toLocaleString()}</p>
                </div>
              </>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ViewAll;
