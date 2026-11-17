"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton({
  className = "",
  label = "সাইন আউট",
  message = "সাইন আউট হয়েছে",
}) {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut();
    toast.success(message);
    router.push("/");
    router.refresh();
  };

  return (
    <button onClick={logout} className={className}>
      {label}
    </button>
  );
}