import { getClient, getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userID) {
    try {
      const client = getClient();
      const session = client.startSession();
      const db = getDB();
      session.startTransaction(); //starts transaction so that all the seq of operations occur together or not at all
      //1. Get cartitems and calculate total amount
      const dataResp = await this.getTotalAmount(userID, session);
      console.log("dataResp-- ", dataResp);
      const finalTotalAmount = dataResp.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      // console.log("finalTotalAmount-- ", finalTotalAmount);
      //2. Create an order record
      const newOrder = new OrderModel(
        new ObjectId(userID),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });
      //3. Reduce the stock
      for (let item of dataResp) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }
      throw new Error("Something went wrong with transaction");
      //4. Clear the cart items
      await db
        .collection("cartItems")
        .deleteMany({ userID: new ObjectId(userID) }, { session });
      session.commitTransaction();
      session.endSession();
      return;
    } catch (e) {
      console.log("err-***-- ", e);
      //err-***--  MongoServerError: Transaction numbers are only allowed on a replica set member or mongos
      //throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userID, session) {
    const db = getDB();
    const items = await db
      .collection("carts")
      .aggregate([
        //1. get cart items for the user
        {
          $match: { userID: new ObjectId(userID) },
        },
        //2. get products from product collection
        {
          $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        //3. unwind the product info
        {
          $unwind: "$productInfo",
        },
        //4. calculate totalAmount for each cartitems
        {
          $addFields: {
            totalAmount: {
              $multiply: ["$productInfo.price", "$quantity"],
            },
          },
        },
      ])
      .toArray();
    return items;
    // console.log("total-->> ", finalTotalAmount);
    //console.log("items-- ", items);
  }
}

//db.products.updateMany({}, {$set: {stock: 20}})
