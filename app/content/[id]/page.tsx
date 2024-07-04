"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/app/components/loading/Loading";
import "./content.scss";
import { itemTypes } from "@/app/types";
import Modal from "@/app/components/Modal/Modal";
import Default from "../default/Default";
import InCart from "../incart/InCart";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/global/hooks";

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
    console.error("Error fetching product by ID:", err);
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
    console.error("Error fetching product IDs:", err);
    return [];
  }
};

const Content = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [product, setProduct] = useState<itemTypes | null>(null);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [animationDuration, setAnimationDuration] = useState("0s");
  const router = useRouter();

  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // 商品IDの一覧を取得
  useEffect(() => {
    fetchProductIds().then(setProductIds);
  }, []);

  //個別商品を表示する
  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      const data = await fetchProductById(id);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setAnimationDuration(`${duration}s`);
      setProduct(data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const exisitingItem = cartItems.find((item) => item.id === product?.id);

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
    <>
      {!loading ? (
        <div
          className="itemBox"
          style={
            { "--animation-duration": animationDuration } as React.CSSProperties
          }
        >
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
              <Default
                product={product}
                handleNextProduct={handleNextProduct}
              />
            )}
          </div>

          {isModalOpen && (
            <Modal
              imageUrls={product?.imageUrls}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </div>
      ) : (
        <Loading
          style={
            { "--animation-duration": animationDuration } as React.CSSProperties
          }
        />
      )}
    </>
  );
};

export default Content;
