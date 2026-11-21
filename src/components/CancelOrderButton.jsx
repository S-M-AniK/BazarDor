"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cancelOrder } from "@/app/orders/actions";

export default function CancelOrderButton({ orderId, labels }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (!window.confirm(labels.confirm)) return;
    startTransition(async () => {
      const res = await cancelOrder(orderId);
      if (res.ok) {
        toast.success(labels.done);
        router.refresh();
      } else {
        toast.error(labels.fail);
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <p className="text-sm text-gray-600">{labels.hint}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="mt-3 border border-red-200 text-red-600 text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? labels.wait : labels.button}
      </button>
    </div>
  );
}