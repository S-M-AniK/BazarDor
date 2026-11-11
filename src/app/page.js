import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import { getProducts } from "@/lib/products";
import { getFavouriteIds } from "@/lib/favourites";
import { getSession } from "@/lib/session";
import { changePct, toBnNumber } from "@/lib/format";

export default async function Home() {
  const session = await getSession();
  const [products, favIds] = await Promise.all([
    getProducts(),
    session ? getFavouriteIds(session.user.id) : [],
  ]);

  const risers = products
    .filter((p) => changePct(p) > 0)
    .sort((a, b) => changePct(b) - changePct(a))
    .slice(0, 6);
  const fallers = products
    .filter((p) => changePct(p) < 0)
    .sort((a, b) => changePct(a) - changePct(b))
    .slice(0, 6);

  return (
    <>
      <Navbar />
      <CategoryNav />
      <Ticker />
      <main className="max-w-6xl mx-auto px-4 py-6 pb-16">
        <Hero />
        <ProductSection title="আজ দাম বেড়েছে" icon="▲" iconColor="text-red-600" items={risers} favIds={favIds} />
        <ProductSection title="আজ দাম কমেছে" icon="▼" iconColor="text-green-700" items={fallers} favIds={favIds} />
        <ProductSection
          title="সব পণ্য"
          subtitle={`মোট ${toBnNumber(products.length)}টি পণ্য দেখানো হচ্ছে`}
          items={products}
          favIds={favIds}
        />
      </main>
    </>
  );
}