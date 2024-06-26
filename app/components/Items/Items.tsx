"use client";
import React, { useEffect, useRef } from "react";
import "./Items.scss";
import Link from "next/link";
import { itemTypes } from "@/app/types";

const Items = ({ products }: { products: itemTypes[] }) => {
  const storeBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storeBox = storeBoxRef.current;
    if (storeBox) {
      storeBox.scrollLeft = storeBox.scrollWidth; // 初期位置を右端に設定

      const scrollToStart = () => {
        storeBox.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      };

      setTimeout(scrollToStart, 500); // 0.5秒後にスクロール開始
    }
  }, []);

  return (
    <div>
      <div className="store-box" ref={storeBoxRef}>
        <ul>
          {products.map((item: any) => (
            <Link href={`/content/${item.id}`} key={item.id}>
              <li style={{ backgroundImage: `url(${item.imageUrls[0]})` }}></li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Items;
