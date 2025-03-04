import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartRepository {
  constructor() {
    this.collection = "carts";
  }
  async addUpdated({ productID, userID, quantity }) {
    try {
      console.log("quantity*----* ", quantity);
      //1. get DB
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      //3. insert
      // return await collection.insertOne(productID, userID, quantity);
      const quant = Number(quantity);
      if (isNaN(quant)) {
        throw new ApplicationError("not a num");
      }
      return await collection.updateOne(
        {
          productID,
          userID,
          //quantity,
        },
        //[{ $set: { $toInt: "$quant" } }, { $inc: { quantity: quant } }],
        //[{ $set: { quantity: { $add: [{ $toInt: "$quantity" }, quant] } } }]
        [
          {
            $setOnInsert: { _id: id }, //insert id on add not update
            $set: { quantity: { $toInt: quantity } },
          },
        ],
        { upsert: true }
      );
    } catch (e) {
      console.log("err--- ADD--->> ", e);
      throw new ApplicationError("something wrong with DB", 500);
    }
  }

  async add(productID, userID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      // find the document
      // either insert or update
      // Insertion.
      await collection.updateOne(
        { productID: new ObjectId(productID), userID: new ObjectId(userID) },
        {
          $setOnInsert: { _id: id },
          $inc: {
            quantity: quantity,
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(userId) {
    try {
      //1. get DB
      if (!ObjectId.isValid(userId)) {
        throw new Error("invalid!!");
      }
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      //3. fetch
      const result = await collection
        .find({ userId: new ObjectId(userId) })
        .toArray(); //bcz DB has objectID
      console.log("result> ", result);
      return result;
    } catch (e) {
      console.log("err--- ", e);
      throw new ApplicationError("something wrong with DB", 500);
    }
  }

  async delete(userID, cartItemId) {
    try {
      //1. get DB
      // if (!ObjectId.isValid(cartItemId)) {
      //   throw new Error("invalid!!");
      // }
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      //3. fetch
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
        userID: new ObjectId(userID),
      });

      console.log("result> ", result);
      return result.deletedCount > 0;
    } catch (e) {
      console.log("err--- ", e);
      throw new ApplicationError("something wrong with DB", 500);
    }
  }

  async getNextCounter(db) {
    const resDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    console.log("resDocument**>> ", resDocument);
    console.log("resDocument**> val> ", resDocument.value);
    return resDocument.value;
  }
}
