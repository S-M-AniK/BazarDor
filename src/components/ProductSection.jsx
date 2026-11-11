import ProductCard from "./ProductCard";

export default function ProductSection({ title, subtitle, icon, iconColor, items, favIds = [] }) {
  return (
    <section className="mt-10">
      {title && (
        <h2 className="font-bold flex items-center gap-2">
          {icon && <span className={`text-xs ${iconColor}`}>{icon}</span>}
          {title}
        </h2>
      )}
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} favourite={favIds.includes(p.id)} />
        ))}
      </div>
    </section>
  );
}