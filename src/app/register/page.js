"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";

export default function RegisterPage() {
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
      toast.error(error.message || "সাইন আপ করা যায়নি");
      return;
    }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8">
        <Link href="/" className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center text-xl">🛒</span>
          <span className="font-bold">বাজার দর</span>
        </Link>
        <h1 className="text-2xl font-bold">নতুন অ্যাকাউন্ট খুলুন</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            required
            placeholder="আপনার নাম"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="ইমেইল"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button
            disabled={loading}
            className="w-full bg-brand text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন আপ"}
          </button>
        </form>
        <SocialButtons />
        <p className="mt-6 text-sm text-center text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-brand font-semibold">
            সাইন ইন
          </Link>
        </p>
      </div>
    </main>
  );
}