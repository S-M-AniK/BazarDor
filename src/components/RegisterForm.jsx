"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const input =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand";

export default function RegisterForm({ lang, labels }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    });
    setLoading(false);
    if (error) {
      toast.error(lang === "en" ? error.message || labels.fail : labels.fail);
      return;
    }
    toast.success(labels.success);
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <input name="name" required placeholder={labels.name} className={input} />
      <input name="email" type="email" required placeholder={labels.email} className={input} />
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder={labels.password}
        className={input}
      />
      <button
        disabled={loading}
        className="w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
      >
        {loading ? labels.wait : labels.submit}
      </button>
    </form>
  );
}