"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartLink({ label }) {
  const cart = useCart();
  const count = Object.keys(cart).length;

  return (
    <Link href="/cart" aria-label={label} className="relative font-semibold text-sm">
      🛍️
      {count > 0 && (
        <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-xs grid place-items-center">
          {count}
        </span>
      )}
    </Link>
  );
}