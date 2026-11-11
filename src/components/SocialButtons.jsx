"use client";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const providers = [
  { id: "google", label: "Google", enabled: process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" },
  { id: "github", label: "GitHub", enabled: process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true" },
].filter((p) => p.enabled);

export default function SocialButtons() {
  if (providers.length === 0) return null;

  const social = async (provider) => {
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
    if (error) toast.error(error.message || "সাইন ইন করা যায়নি");
  };

  return (
    <>
      <p className="my-5 text-center text-xs text-gray-400">অথবা</p>
      <div className="grid grid-cols-2 gap-3">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => social(p.id)}
            className="border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            {p.label}
          </button>
        ))}
      </div>
    </>
  );
}