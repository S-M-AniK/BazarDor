"use client";
import { useRouter } from "next/navigation";

export default function LangToggle({ lang }) {
  const router = useRouter();
  const next = lang === "en" ? "bn" : "en";

  const onClick = () => {
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="ভাষা পরিবর্তন"
      className="h-9 px-3 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50"
    >
      {lang === "en" ? "বাংলা" : "EN"}
    </button>
  );
}