"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function updateStock(formData) {
  const session = await getSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) redirect("/login");

  const id = Number(formData.get("id"));
  const amount = Number(formData.get("amount"));
  const mode = formData.get("mode") === "set" ? "set" : "add";

  const valid =
    id > 0 &&
    Number.isFinite(amount) &&
    amount < 100000 &&
    (mode === "set" ? amount >= 0 : amount > 0);
  if (!valid) redirect("/admin?stock=invalid");

  const products = db.collection("products");
  const exists = await products.findOne({ id }, { projection: { _id: 1 } });
  if (!exists) redirect("/admin?stock=invalid");

  if (mode === "set") {
    await products.updateOne({ id }, { $set: { stock: amount } });
  } else {
    await products.updateOne({ id }, { $inc: { stock: amount } });
  }

  revalidatePath("/", "layout");
  redirect("/admin?stock=ok");
}