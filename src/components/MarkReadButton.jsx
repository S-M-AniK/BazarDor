"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { markAllRead } from "@/app/alerts/actions";

export default function MarkReadButton({ label, doneMsg, failMsg }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const res = await markAllRead();
      if (res.ok) {
        toast.success(doneMsg);
        router.refresh();
      } else {
        toast.error(failMsg);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="border border-gray-200 text-sm font-semibold rounded-xl px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
    >
      {label}
    </button>
  );
}