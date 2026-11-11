import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import ProductSection from "@/components/ProductSection";
import { categories } from "@/data/products";
import { getProducts } from "@/lib/products";
import { getFavouriteIds } from "@/lib/favourites";
import { toBnNumber } from "@/lib/format";
import { getSession } from "@/lib/session";

export default async function ProductsPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { category, sort } = await searchParams;
  const [all, favIds] = await Promise.all([
    getProducts(),
    getFavouriteIds(session.user.id),
  ]);
  const items = category ? all.filter((p) => p.category === category) : [...all];
  if (sort === "asc") items.sort((a, b) => a.price - b.price);
  if (sort === "desc") items.sort((a, b) => b.price - a.price);

  const current = categories.find((c) => c.id === category);
  const base = category ? `/products?category=${category}&` : "/products?";
  const sortLink = (key, label) => (
    <Link
      href={`${base}sort=${key}`}
      className={`px-4 py-1.5 rounded-full text-sm border ${
        sort === key ? "bg-brand text-white border-brand" : "bg-white border-gray-200"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <Navbar />
      <CategoryNav />
      <main className="max-w-6xl mx-auto px-4 py-6 pb-16">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">
            {current ? `${current.icon} ${current.name}` : "সব পণ্য"}
          </h1>
          <div className="flex gap-2">
            {sortLink("asc", "কম দাম আগে")}
            {sortLink("desc", "বেশি দাম আগে")}
          </div>
        </div>
        <ProductSection
          subtitle={`মোট ${toBnNumber(items.length)}টি পণ্য দেখানো হচ্ছে`}
          items={items}
          favIds={favIds}
        />
      </main>
    </>
  );
}