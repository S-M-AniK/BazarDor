import { cache } from "react";
import { db } from "./mongodb";

export const getFavouriteIds = cache(async (userId) => {
  const docs = await db.collection("favourites").find({ userId }).toArray();
  return docs.map((d) => d.productId);
});