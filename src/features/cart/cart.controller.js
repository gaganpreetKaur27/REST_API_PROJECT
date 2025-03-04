import CartModel from "./cart.model.js";
import { ObjectId } from "mongodb";
import CartRepository from "./cart.repository.js";

export class CartController {
  constructor() {
    this.CartRepository = new CartRepository();
  }

  async add(req, res) {
    try {
      const { productID, quantity } = req.query;
      const userID = req.userID; //this is from token userID
      console.log("quantity--- >> ", quantity);
      // await this.CartRepository.add({
      //   productID: new ObjectId(productID),
      //   userID: new ObjectId(userID),
      //   quantity,
      // });
      await this.CartRepository.add(productID, userID, Number(quantity));
      res.status(201).send("Cart is updated");
    } catch (e) {
      console.log("e--- ", e);
      res.status(200).send("Something went wrong!");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      const items = await this.CartRepository.get(userID);
      return res.status(200).send(items);
    } catch (e) {
      res.status(200).send("Something went wrong!");
    }
  }

  async delete(req, res) {
    const userID = req.userID;
    const itemID = req.params.id;
    //const err = CartModel.delete(itemID, userID);
    const isDeleted = await this.CartRepository.delete(userID, itemID);
    if (!isDeleted) {
      return res.status(404).send("ITEM NOT FOUND");
    }
    return res.status(200).send("Cart Item is removed!!");
  }
}
