import { getProducts } from "@/lib/products";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return new Response("Unauthorized", { status: 401 });
  }

  const products = await getProducts();
  const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    "id,name,unit,category,icon,price",
    ...products.map((p) =>
      [p.id, quote(p.name), quote(p.unit), p.category, quote(p.icon), p.price].join(",")
    ),
  ];

  return new Response("\uFEFF" + rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bazardor-prices.csv"',
    },
  });
}