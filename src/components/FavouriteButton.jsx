"use client";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { toggleFavourite } from "@/app/actions";

export default function FavouriteButton({ productId, initial }) {
  const [active, setActive] = useState(initial);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const res = await toggleFavourite(productId);
      setActive(res.active);
      toast.success(res.active ? "পছন্দের তালিকায় যোগ হয়েছে" : "তালিকা থেকে সরানো হয়েছে");
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label="পছন্দের তালিকা"
      className={`w-9 h-9 rounded-full grid place-items-center text-lg border transition ${
        active
          ? "bg-red-50 border-red-200 text-red-500"
          : "bg-white border-gray-200 text-gray-400 hover:text-red-500"
      } ${pending ? "opacity-60" : ""}`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}