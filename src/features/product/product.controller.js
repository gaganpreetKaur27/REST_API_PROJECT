import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    // const products = ProductModel.getAll();
    const products = await this.productRepository.getAll();
    res.status(200).send(products);
  }

  async addProduct(req, res) {
    const { name, price, sizes } = req.body;
    const newProduct = new ProductModel(
      name,
      null,
      parseFloat(price),
      req.file.filename,
      null,
      sizes.split(",")
    );
    const createdRecord = await this.productRepository.add(newProduct);
    res.status(201).send(newProduct); //201 resource created!
  }

  async rateProduct(req, res, next) {
    try {
      console.log("req INSIDE-", req.query);
      const userID = req.userID; //req.query.userID;
      const productID = req.query.productID;
      const rating = req.query.rating;
      const result = await this.productRepository.rate(
        userID,
        productID,
        rating
      );
      return res.status(200).send("Rating has been added!");
      // console.log("err-", err);
      // if (err) {
      //   return res.status(400).send(err);
      // } else {
      //   return res.status(200).send("success");
      // }
    } catch (e) {
      console.log("err--ttell ****>>> ", e);
      next(e);
    }
  }

  async getOneProduct(req, res) {
    const id = req.params.id;
    console.log("ID>>", id);
    // const product =  ProductModel.get(id);
    const product = new ProductModel(id);
    const result = await this.productRepository.get(product);

    console.log("product>>", product);
    if (!result) {
      res.status(404).send("Product not found!");
    } else {
      return res.status(200).send(result);
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const categories = req.query.category;

      //const result = ProductModel.filter(minPrice, maxPrice, category);
      const result = await this.productRepository.filter(minPrice, categories);
      res.status(200).send(result);
    } catch (e) {
      console.log(e);
    }
  }

  async avgPrice(req, res, next) {
    try {
      const result = await this.productRepository.avgProductPerPrice();
      return res.status(200).send(result);
    } catch (e) {
      console.log("err avg price-- ", e);
      return res.status(200).send("something went wrong!!");
    }
  }
}
