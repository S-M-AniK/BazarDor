"use client";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton({ productId, label, addedMsg, className = "" }) {
  const onClick = () => {
    addToCart(productId, 1);
    toast.success(addedMsg);
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}