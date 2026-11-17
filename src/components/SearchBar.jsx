import { getT } from "@/lib/i18n";

export default async function SearchBar({ defaultValue = "", category = "", sort = "" }) {
  const { t } = await getT();

  return (
    <form action="/products" method="get" className="mt-6 flex gap-2">
      {category && <input type="hidden" name="category" value={category} />}
      {sort && <input type="hidden" name="sort" value={sort} />}
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder={t("searchPlaceholder")}
        className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm outline-none focus:border-brand bg-white"
      />
      <button className="bg-brand text-white font-semibold rounded-full px-6 py-2.5 text-sm">
        {t("search")}
      </button>
    </form>
  );
}