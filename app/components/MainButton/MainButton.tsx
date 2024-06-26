"use client";
import React from "react";
import "./mainButton.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainButton = () => {
  const pathname = usePathname();

  const isViewAllPage = pathname === "/view_all";
  const isSuccessPage = pathname.startsWith("/success");
  const isCheckoutPage = pathname === "/checkout";

  if (isCheckoutPage) {
    return null;
  }

  return (
    <>
      {isViewAllPage || isSuccessPage ? (
        <div className="main-btn">
          <Link href="/">
            <button>home</button>
          </Link>
        </div>
      ) : (
        <div className="main-btn">
          <Link href="/view_all">
            <button>view all</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default MainButton;
