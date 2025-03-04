import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, price, imageUrl, category, sizes, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.sizes = sizes;
  }

  static getAll() {
    return products;
  }

  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static get(id) {
    const product = products.find((i) => i._id == id);
    //const product = products.find((i) => String(i.id) === String(id));
    return product;
  }

  static filter(minPrice, maxPrice, category) {
    console.log(
      "minPrice>> maxPrice>> category>> ",
      minPrice,
      maxPrice,
      category
    );
    const result = products.filter((product) => {
      console.log("product>> ", product.price);
      console.log("category>> ", product.category);
      //if price/category provided checks against cond. else works individual filters
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });

    //console.log("products>> ", products);
    console.log("result>> ", result);
    return result;
  }

  static rateProduct(userID, productID, rating) {
    //1. validate user & product
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      return "User not found!";
    }

    //2. Validate products
    const product = products.find((p) => p.id == productID);
    if (!product) {
      return "Product not found!";
    }

    //3. check if there are ratings, if not add ratings array!
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userID,
        rating,
      });
    }

    //4. else if check user rating is already available
    else {
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );
      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = {
          userID,
          rating,
        };
      }
      //5. if no existing rating of user then add the rating
      else {
        product.ratings.push({
          userID,
          rating,
        });
      }
    }
  }
}

var products = [
  new ProductModel(
    1,
    "Product 1,",
    "desc 1",
    19.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category1",
    ["M", "XL", "S"]
  ),

  new ProductModel(
    2,
    "Product 2,",
    "desc 2",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category2", //sometimes with space Category 2 it wont work properly!
    ["M", "S"]
  ),

  new ProductModel(
    3,
    "Product 883,",
    "desc 3",
    49.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category3",
    ["XL", "S"]
  ),
];
