import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import SearchBar from "@/components/SearchBar";
import ProductSection from "@/components/ProductSection";
import { categories } from "@/data/products";
import { getProducts } from "@/lib/products";
import { getFavouriteIds } from "@/lib/favourites";
import { toBnNumber } from "@/lib/format";
import { getSession } from "@/lib/session";

export default async function ProductsPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { category, sort, q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();

  const [all, favIds] = await Promise.all([
    getProducts(),
    getFavouriteIds(session.user.id),
  ]);

  let items = category ? all.filter((p) => p.category === category) : [...all];
  if (q) items = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  if (sort === "asc") items.sort((a, b) => a.price - b.price);
  if (sort === "desc") items.sort((a, b) => b.price - a.price);

  const current = categories.find((c) => c.id === category);

  const link = (overrides) => {
    const sp = new URLSearchParams();
    const next = { category, q, sort, ...overrides };
    for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v);
    const s = sp.toString();
    return s ? `/products?${s}` : "/products";
  };

  const sortLink = (key, label) => (
    <Link
      href={link({ sort: key })}
      className={`px-4 py-1.5 rounded-full text-sm border ${
        sort === key ? "bg-brand text-white border-brand" : "bg-white border-gray-200"
      }`}
    >
      {label}
    </Link>
  );

  const heading = q
    ? `"${q}" এর ফলাফল`
    : current
    ? `${current.icon} ${current.name}`
    : "সব পণ্য";

  return (
    <>
      <Navbar />
      <CategoryNav />
      <main className="max-w-6xl mx-auto px-4 py-6 pb-16">
        <SearchBar defaultValue={q} category={category} sort={sort} />
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">{heading}</h1>
          <div className="flex gap-2">
            {sortLink("asc", "কম দাম আগে")}
            {sortLink("desc", "বেশি দাম আগে")}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center">
            <p className="text-gray-600">কোনো পণ্য পাওয়া যায়নি</p>
            <Link
              href="/products"
              className="inline-block mt-4 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <ProductSection
            subtitle={`মোট ${toBnNumber(items.length)}টি পণ্য দেখানো হচ্ছে`}
            items={items}
            favIds={favIds}
          />
        )}
      </main>
    </>
  );
}