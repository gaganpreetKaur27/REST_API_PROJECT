//import express
import express from "express";
import ProductController from "./product.controller.js";

//create server
export const productRouter = express.Router();

export const productController = new ProductController();

//all paths to controller methods
//localhost/api/products

productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
productRouter.get("/averagePrice", (req, res, next) => {
  productController.avgPrice(req, res, next);
});
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

//test
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});
productRouter.post("/rate", (req, res, next) => {
  productController.rateProduct(req, res, next);
});

export default productRouter;
