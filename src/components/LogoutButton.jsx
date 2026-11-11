"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut();
    toast.success("সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  };

  return (
    <button onClick={logout} className={className}>
      সাইন আউট
    </button>
  );
}