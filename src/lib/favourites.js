import { db } from "./mongodb";

export async function getFavouriteIds(userId) {
  const docs = await db.collection("favourites").find({ userId }).toArray();
  return docs.map((d) => d.productId);
}