import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProductSection";
import BudgetCalculator from "@/components/BudgetCalculator";
import { getProducts } from "@/lib/products";
import { getFavouriteIds } from "@/lib/favourites";
import { getBudget } from "@/lib/budget";
import { getSession } from "@/lib/session";
import { toBnNumber } from "@/lib/format";

export default async function FavouritesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [all, favIds, saved] = await Promise.all([
    getProducts(),
    getFavouriteIds(session.user.id),
    getBudget(session.user.id),
  ]);
  const items = all.filter((p) => favIds.includes(p.id));

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl font-bold">♥ আমার পছন্দের তালিকা</h1>
        {items.length === 0 ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8 text-center">
            <p className="text-gray-600">এখনো কোনো পণ্য যোগ করা হয়নি</p>
            <Link
              href="/products"
              className="inline-block mt-4 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <>
            <ProductSection
              subtitle={`মোট ${toBnNumber(items.length)}টি পণ্য`}
              items={items}
              favIds={favIds}
            />
            <BudgetCalculator products={items} saved={saved} />
          </>
        )}
      </main>
    </>
  );
}