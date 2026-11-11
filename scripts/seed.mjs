import { MongoClient } from "mongodb";
import { products } from "../src/data/products.js";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const col = client.db().collection("products");
await col.deleteMany({});
await col.insertMany(products.map((p) => ({ ...p, updatedAt: new Date() })));
await col.createIndex({ id: 1 }, { unique: true });

console.log(`${products.length} products saved`);
await client.close();