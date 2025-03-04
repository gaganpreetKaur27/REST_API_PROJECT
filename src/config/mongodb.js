import { MongoClient } from "mongodb";
//import dotenv from "dotenv";

//dotenv.config();

//const url = process.env.DB_URL; //can copy connection string from MONGO DB GUI

let client;
export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL) //instead of URL call it to stop hoisting
    .then((clientInstance) => {
      client = clientInstance;
      console.log("Mongodb is connected!");
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDB = () => {
  return client.db();
};

export const getClient = () => {
  return client;
};

export const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};

export const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 }); //single field index= price in ascending order if 1, else -1 = descending order
    await db.collection("products").createIndex({ name: 1, category: -1 }); //compound index
    await db.collection("products").createIndex({ desc: "text" });
  } catch (e) {
    console.log("e->> ", e);
  }
  console.log("indexes are created");
};
