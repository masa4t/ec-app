"use client";
import React, { useEffect, useState } from "react";
import "./view_all.scss";
import { itemTypes } from "../types";
import Link from "next/link";

async function fetchProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/syncProducts`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

const ViewAll = () => {
  const [products, setProducts] = useState<itemTypes[]>([]);

  useEffect(() => {
    async function getProducts() {
      const data = await fetchProducts();
      setProducts(data);
    }
    getProducts();
  }, []);

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
