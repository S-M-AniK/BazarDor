"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function markAllRead() {
  const session = await getSession();
  if (!session) return { ok: false };

  await db
    .collection("alerts")
    .updateMany({ userId: session.user.id, read: false }, { $set: { read: true } });

  revalidatePath("/alerts");
  revalidatePath("/", "layout");
  return { ok: true };
}