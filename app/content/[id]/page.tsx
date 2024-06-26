"use client";
import React, { useEffect, useState } from "react";
import "./content.scss";
import { itemTypes } from "@/app/types";
import Link from "next/link";
import Modal from "@/app/components/Modal/Modal";

import { addToCart } from "@/app/global/slice";
import { useAppDispatch, useAppSelector } from "@/app/global/hooks";
import Default from "../default/Default";
import InCart from "../incart/InCart";
import { useRouter } from "next/navigation";

const fetchProductById = async (id: string): Promise<itemTypes | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }
    const data: itemTypes = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
const fetchProductIds = async (): Promise<string[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/productIds`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch product IDs");
    }
    const data: string[] = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const Content = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [product, setProduct] = useState<itemTypes | null>(null);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isModalOpent, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // 商品IDの一覧を取得
  useEffect(() => {
    fetchProductIds().then(setProductIds);
  }, []);

  //個別商品を表示する
  useEffect(() => {
    if (id) {
      fetchProductById(id).then((data) => {
        setProduct(data);
      });
    }
  }, []);

  const exisitingItem = cartItems.find((item) => item.id === product?.id);
  // console.log(product);

  const handleThumbnailClick = (imgUrl: string) => {
    setSelectedImage(imgUrl);
  };

  const handleNextProduct = () => {
    const currentIndex = productIds.indexOf(id);
    const nextIndex = (currentIndex + 1) % productIds.length;
    const nextProductId = productIds[nextIndex];
    router.push(`/content/${nextProductId}`);
  };

  return (
    <div className="itemBox">
      <div
        className="img-box"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <img
          src={selectedImage || product?.imageUrls[0]}
          alt="Selected product"
        />
      </div>
      <div className="item-desc">
        <h2 className="product-n">{product?.name}</h2>
        <p className="product-d">{product?.description}</p>

        <p className="product-p">￥ {product?.price.toLocaleString()}</p>

        <div className="product-img">
          {product?.imageUrls.map((img, index) => (
            <img
              src={img}
              key={index}
              alt={`Product image ${index}`}
              onClick={() => handleThumbnailClick(img)}
              className="thumbnail"
            />
          ))}
        </div>

        {exisitingItem ? (
          <InCart
            exisitingItem={exisitingItem}
            handleNextProduct={handleNextProduct}
          />
        ) : (
          <Default product={product} handleNextProduct={handleNextProduct} />
        )}
      </div>

      {isModalOpent && (
        <Modal imageUrls={product?.imageUrls} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default Content;
