import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const res = await client.db().collection("products").updateMany(
  { stock: { $exists: false } },
  { $set: { stock: 100 } }
);

console.log(`${res.modifiedCount} products updated`);
await client.close();