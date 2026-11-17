import { getProducts } from "@/lib/products";
import { changePct, toBnNumber } from "@/lib/format";
import { productName, unitShort } from "@/data/translations";
import { getT } from "@/lib/i18n";

export default async function Ticker() {
  const [products, { lang, t }] = await Promise.all([getProducts(), getT()]);
  const items = [...products, ...products];

  return (
    <div className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="flex animate-marquee py-2.5">
        {items.map((p, i) => {
          const pct = changePct(p);
          const color = pct > 0 ? "text-red-600" : pct < 0 ? "text-green-700" : "text-gray-500";
          const arrow = pct > 0 ? "▲" : pct < 0 ? "▼" : "—";
          return (
            <div key={i} className="flex items-center gap-2 px-6 border-r border-gray-100 text-sm whitespace-nowrap">
              <span>{p.icon}</span>
              <span className="font-medium">{productName(p, lang)}</span>
              <span className="text-gray-500">
                {toBnNumber(p.price, 0, lang)} {t("taka")}/{unitShort(p.unit, lang)}
              </span>
              <span className={`font-semibold ${color}`}>
                {arrow} {toBnNumber(Math.abs(pct), 1, lang)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}