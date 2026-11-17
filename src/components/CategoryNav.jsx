import Link from "next/link";
import { categories } from "@/data/products";
import { categoryName } from "@/data/translations";
import { getLang } from "@/lib/i18n";

export default async function CategoryNav() {
  const lang = await getLang();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex gap-6 overflow-x-auto py-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className="flex items-center gap-2 text-sm font-medium whitespace-nowrap hover:text-brand"
          >
            <span>{c.icon}</span>
            {categoryName(c, lang)}
          </Link>
        ))}
      </div>
    </nav>
  );
}