import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

class UserRepository {
  constructor() {
    this.collection = "users";
  }
  async SignUp(newUser) {
    try {
      //get the DB
      const db = getDB();
      //get collection
      const collection = db.collection(this.collection);
      //insert the doc
      await collection.insertOne(newUser);
      return newUser;
    } catch (e) {
      console.log("err", e);
      throw new ApplicationError("someting went wrong with DB", 500);
    }
  }

  async SignIn(email, password) {
    try {
      //get the DB
      const db = getDB();
      //get collection
      const collection = db.collection(this.collection);
      //insert the doc
      return await collection.findOne({ email, password });
    } catch (e) {
      console.log("err", e);
      throw new ApplicationError("someting went wrong with DB", 500);
    }
  }

  async findByEmail(email) {
    try {
      //get the DB
      const db = getDB();
      //get collection
      const collection = db.collection(this.collection);
      //insert the doc
      return await collection.findOne({ email });
    } catch (e) {
      console.log("err", e);
      throw new ApplicationError("someting went wrong with DB", 500);
    }
  }
}

export default UserRepository;
