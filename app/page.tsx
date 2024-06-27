import Image from "next/image";
import Items from "./components/Items/Items";
import "./globals.css";
import MainButton from "./components/MainButton/MainButton";
// import Link from "next/link";
// import MainButton from "./components/MainButton/MainButton";

async function fetchProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/syncProducts`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default async function Home() {
  const products = await fetchProducts();
  console.log(products);

  return (
    <>
      <Items products={products} />
    </>
  );
}
