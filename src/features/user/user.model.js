import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  // static async SignUp(name, email, password, type) {
  //   try {
  //     //get the DB
  //     const db = getDB();
  //     //get collection
  //     const collection = db.collection("users");

  //     //give came case fn names
  //     const newUser = new UserModel(name, email, password, type);
  //     // newUser.id = users.length + 1;
  //     // users.push(newUser);

  //     //insert the doc
  //     await collection.insertOne(newUser);
  //     return newUser;
  //   } catch (e) {
  //     throw new ApplicationError("someting went wrong", 500);
  //   }
  // // }
  // static SignIn(email, password) {
  //   const user = users.find(
  //     (user) => user.email == email && user.password == password
  //   );
  //   return user;
  // }

  static getAll() {
    return users;
  }
}

var users = [
  {
    id: 1,
    name: "Test user",
    password: "123",
    email: "g@gmail.com",
    type: "seller",
  },
  {
    id: 2,
    name: "Customer user",
    password: "123",
    email: "c@gmail.com",
    type: "customer",
  },
];
