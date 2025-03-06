import "./env.js";
//import express
import express from "express";
import bodyParser from "body-parser";
import swagger from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
//import apiDocs from "./swagger.json" assert { type: "json" };
import apiDocs from "./swagger_3.0.json";
//assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import orderRouter from "./src/features/order/order.routes.js";

//create server
const server = express();

//CORS policy config

var corsOption = {
  origin: "http://localhost:5500",
  allowedHeaders: "*",
};

//allows all cors requests
//server.use(cors());

server.use(cors(corsOption));
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   //* means access to all clients
//   // res.header("Access-Control-Allow-Origin", "*");
//   //res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

//we need this bcz w/o this re.body will be undefined even if we are sending JSON data
server.use(bodyParser.json()); //server.use(express.json())

//logger
server.use(loggerMiddleware);

server.use("/api/orders", jwtAuth, orderRouter);

//for all requests related to product, redirect to product routes
//localhost:3200/api/products
//server.use("/api/products", basicAuthorizer, productRouter);
server.use("/api/products", jwtAuth, productRouter);
//server.use("/api/products", productRouter);

server.use("/api/cartItems", jwtAuth, cartRouter);

//we want to secure only product apis as they should be accessed after cred success!
server.use("/api/users", userRouter);

//swagger docs
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

//default handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  // server errors.
  res.status(500).send("Something went wrong, please try later");
});

//handle 404 requests
server.use((req, res) => {
  res.status(404).send("API not found!, check doc on localhost:3200/api-docs");
});

//specify port
server.listen(3200, () => {
  //for us
  console.log("server is running at 3200");
  //connectToMongoDB();
  connectUsingMongoose();
});
