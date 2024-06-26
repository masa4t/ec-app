import React from "react";
import "./checkout.scss";
import MainButton from "../components/MainButton/MainButton";
import Link from "next/link";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckoutInput from "./CheckoutInput/CheckoutInput";
import TotalCart from "./TotalCart/TotalCart";

const page = () => {
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <Link href="/">
          <button>home</button>
        </Link>
        <Link href="Cart">
          <ShoppingBagIcon className="shopping-bag" />
        </Link>
      </div>
      <div className="checkout-body">
        <CheckoutInput />
        <TotalCart />
      </div>
    </div>
  );
};

export default page;
