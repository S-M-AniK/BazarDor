import Navbar from "@/components/Navbar";
import CategoryNav from "@/components/CategoryNav";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import ProductSection from "@/components/ProductSection";
import { getProducts } from "@/lib/products";
import { getFavouriteIds } from "@/lib/favourites";
import { getSession } from "@/lib/session";
import { getT } from "@/lib/i18n";
import { changePct, toBnNumber } from "@/lib/format";

export default async function Home() {
  const [session, { lang, t }] = await Promise.all([getSession(), getT()]);
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
        <SearchBar />
        <ProductSection title={t("risers")} icon="▲" iconColor="text-red-600" items={risers} favIds={favIds} />
        <ProductSection title={t("fallers")} icon="▼" iconColor="text-green-700" items={fallers} favIds={favIds} />
        <ProductSection
          title={t("allProducts")}
          subtitle={t("totalShown", { n: toBnNumber(products.length, 0, lang) })}
          items={products}
          favIds={favIds}
        />
      </main>
    </>
  );
}