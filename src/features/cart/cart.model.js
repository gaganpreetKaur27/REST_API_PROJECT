export default class CartModel {
  constructor(productID, userID, quantity, id) {
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
    this.id = id;
  }

  static add(productID, userID, quantity) {
    const cartItem = new CartModel(productID, userID, quantity);
    cartItem.id = cartItems.length + 1;
    cartItems.push(cartItem);
    return cartItem;
  }

  static get(userID) {
    return cartItems.filter((i) => i.userID === userID);
  }

  static delete(itemID, userID) {
    const itemIndex = cartItems.findIndex(
      (i) => i.id == itemID && i.userID == userID
    );
    if (itemIndex === -1) {
      return "Nt found";
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }
}

var cartItems = [new CartModel(1, 2, 1, 1), new CartModel(1, 2, 2, 2)];
