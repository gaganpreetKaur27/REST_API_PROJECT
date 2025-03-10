import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { reviewSchema } from "./review.schema.js";
//import { productSchema } from "./product.schema.js";
import { productSchemaModel } from "./product.schema.js";
//import { upload } from "../../middlewares/fileUpload.middleware.js";
//import { productRouter, productController } from "./product.routes.js";

//const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      //1. get DB
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      //3. insert
      return await collection.insertOne(newProduct);
    } catch (e) {
      console.log("err--- ", e);
      throw new ApplicationError("something wrong with DB", 500);
    }
  }

  async getAll() {
    try {
      // //1. get DB
      // const db = getDB();
      // //2. get collection
      // const collection = db.collection(this.collection);
      // //3. insert
      // return await collection.find().toArray();
      return await productSchemaModel.find();
    } catch (e) {
      console.log("err getAll--- ", e);
      throw new ApplicationError("something wrong with DB", 500);
      //test
    }
  }

  async get(id) {
    try {
      //1. get DB
      if (!ObjectId.isValid(id)) {
        throw new Error("invalid!!");
      }
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      //3. fetch
      const result = await collection.findOne({ _id: new ObjectId(id) }); //bcz DB has objectID
      console.log("result> ", result);
      return result;
    } catch (e) {
      console.log("err--- ", e);
      throw new ApplicationError("something wrong with DB", 500);
    }
  }

  async filter(minPrice, categories) {
    try {
      //1. get DB
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (categories) {
        // filterExpression = { $and: [{ category: category }, filterExpression] };
        filterExpression = {
          $or: [{ category: { $in: categories } }, filterExpression],
        };
        //filterExpression.category = category;
      }
      //return collection.find(filterExpression).toArray();
      return collection
        .find(filterExpression)
        .project({
          name: 1,
          price: 1,
          _id: 0,
          ratings: { $slice: 1 /* 1 = 1st rating, -1 = last rating*/ },
        }) //1= inclusion, 0 = exclusion
        .toArray();
    } catch (e) {}
  }

  async filterOld(minPrice, maxPrice, category) {
    try {
      //1. get DB
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      return collection.find(filterExpression).toArray();
    } catch (e) {}
  }

  async rate(userID, productID, rating) {
    try {
      //1. check product if exists
      const productToUpdate = await productSchemaModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found!");
      }
      //2. Get existing review for the product
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating,
        });
        newReview.save();
      }
    } catch (e) {}
  }

  async rateOld(userID, productID, rating) {
    try {
      //1. get DB
      const db = getDB();
      //2. get collection
      const collection = db.collection(this.collection);
      //APPROACH 2 -- remove & update
      // REMOVE existing entry
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );

      // Add new entry
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $push: { ratings: { userID: new ObjectId(userID), rating } },
        }
      );

      //APPROACH -1 *** has concurrent update issues!!
      // //3. find product
      // const product = await collection.findOne({
      //   _id: new ObjectId(productID),
      // });
      // //4. find rating
      // const userRating = product?.ratings?.find((r) => r.userID == userID);
      // console.log("userRating**>> ", userRating);
      // if (userRating) {
      //   //5. update rating
      //   //check critera & updates
      //   await collection.updateOne(
      //     {
      //       _id: new ObjectId(productID),
      //       "ratings.userID": new ObjectId(userID),
      //     },
      //     {
      //       $set: { "ratings.$.rating": rating },
      //     }
      //   );
      // } else {
      //   //5. update rating by pushing
      //   await collection.updateOne(
      //     {
      //       _id: new ObjectId(productID),
      //     },
      //     {
      //       $push: { ratings: { userID: new ObjectId(userID), rating } },
      //     }
      //   );
      // }
    } catch (e) {
      console.log("err-*******-- ", e);
      throw new ApplicationError("something wrong with DB", 500);
    }
  }

  async avgProductPerPrice() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            //stage 1: Get avg price per category
            // $group: {
            //   _id: "$category",
            //   averagePrice: { $sum: "$price" },
            // },

            $group: {
              _id: "$category",
              expenses: {
                $push: {
                  price: "$price",
                  name: "$name",
                  category: "$category",
                },
              },
            },
          },
        ])
        .toArray();
    } catch (e) {
      console.log("e msg-- > ", e);
    }
  }
}

export default ProductRepository;
//test
// productRouter.post(
//   "/",
//   upload.single("imageUrl"),
//   (req, res) => {
//     productController.addProduct(req, res);
//   }
//   //productController.addProduct
// ); //upload.array() => multiple file uploads

// async groupExpensesByTags() {
//   const db = getDB();
//   const pipeline = [
//     { $group: { _id: "$tags", expenses: { $push: { _id: "$_id", title: "$title", amount: "$amount", date: "$date", isRecurring: "$isRecurring", tags: "$tags" } } } }

//   ];

//   const result = await db.collection(this.collectionName).aggregate(pipeline).toArray();
//   return result;
// }

// // Aggregate total revenue for each product
// async aggregateTotalRevenue() {
//   const db = getDB();
//   const pipeline = [
//     {
//       $group: {
//         _id: "$title",
//         totalRevenue: { $sum: "$amount" }
//       }
//     }
//   ];

//   const result = await db.collection(this.collectionName).aggregate(pipeline).toArray();
//   return result;
// }

// async groupAndCalculateAvgByRecurring() {
//   const db = getDB();
//   const pipeline = [
//     {
//       $group: {
//         _id: "$isRecurring",
//         avgAmount: { $avg: "$amount" }
//       }
//     }
//   ];

//   const result = await db.collection(this.collectionName).aggregate(pipeline).toArray();
//   return result;
// }

//db.products.aggregate([{$unwind: "$ratings"}, {$group: {_id: "$name", averageRating: {$avg: "$ratings.rating"}}}])

//db.products.aggregate([{ $project: {name:1, countOfRating:{$size:"$ratings"}} }])

//db.products.aggregate([{ $project: {name:1, countOfRating:{ $cond:{if: {$isArray: "$ratings"}, then: {$size: "$ratings"}, else:0} }}} ])

//db.products.aggregate([{ $project: {name:1, countOfRating:{ $cond:{if: {$isArray: "$ratings"}, then: {$size: "$ratings"}, else:0} }}}, { $sort: {countOfRating: -1} } ])

//db.products.aggregate([{ $project: {name:1, countOfRating:{ $cond:{if: {$isArray: "$ratings"}, then: {$size: "$ratings"}, else:0} }}}, { $sort: {countOfRating: -1} },{$limit:1} ])
