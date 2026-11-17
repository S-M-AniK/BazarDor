"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { categories } from "@/data/products";

const categoryIds = new Set(categories.map((c) => c.id));

export async function addProduct(formData) {
  const session = await getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const icon = String(formData.get("icon") ?? "").trim() || "🛒";
  const price = Number(formData.get("price"));

  if (!name || !unit || !categoryIds.has(category) || !(price > 0)) {
    redirect("/admin?add=invalid");
  }

  const col = db.collection("products");
  if (await col.findOne({ name })) redirect("/admin?add=exists");

  const [last] = await col.find({}).sort({ id: -1 }).limit(1).toArray();
  const id = (last?.id ?? 0) + 1;
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);

  await col.insertOne({ id, name, icon, category, unit, price, prev: price, updatedAt: now });
  await db.collection("priceHistory").insertMany([
    { productId: id, price, date: yesterday },
    { productId: id, price, date: now },
  ]);

  revalidatePath("/", "layout");
  redirect("/admin?added=1");
}