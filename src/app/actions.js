"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function toggleFavourite(productId) {
  const session = await getSession();
  if (!session) redirect("/login");

  const col = db.collection("favourites");
  const filter = { userId: session.user.id, productId: Number(productId) };
  const existing = await col.findOne(filter);

  if (existing) {
    await col.deleteOne(filter);
  } else {
    await col.insertOne({ ...filter, createdAt: new Date() });
  }

  revalidatePath("/", "layout");
  return { active: !existing };
}