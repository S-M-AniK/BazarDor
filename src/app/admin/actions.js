"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function updatePrice(formData) {
  const session = await getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) redirect("/login");

  const id = Number(formData.get("id"));
  const price = Number(formData.get("price"));
  if (!id || !(price > 0)) redirect("/admin?error=1");

  const col = db.collection("products");
  const current = await col.findOne({ id });
  if (!current) redirect("/admin?error=1");

  await col.updateOne(
    { id },
    { $set: { prev: current.price, price, updatedAt: new Date() } }
  );
  await db.collection("priceHistory").insertOne({
    productId: id,
    price,
    date: new Date(),
  });

  revalidatePath("/", "layout");
  redirect("/admin?ok=1");
}