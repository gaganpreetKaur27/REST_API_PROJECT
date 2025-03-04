import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

//creating model from schema
const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async SignUp(user) {
    try {
      //create instance of model
      const newUser = new UserModel(user);
      await newUser.save();
      console.log("TRY CASE**");
      return newUser;
    } catch (e) {
      console.log("CATCH CASE* ERROR*", e);
      if (e instanceof mongoose.Error.ValidationError) {
        throw e;
      }
      console.log(e);
    }
  }

  async signIn(email, password) {
    try {
      //create instance of model
      return await UserModel.findOne({ email, password });
    } catch (e) {
      console.log(e);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (e) {
      console.log("err", e);
      //throw new ApplicationError("someting went wrong with DB", 500);
    }
  }

  async resetPassword(userID, newPassword) {
    try {
      let user = await UserModel.findById(userID);
      if (user) {
        user.password = newPassword;
        user.save();
      } else {
        throw new Error("USER NOT FOUND!!");
      }
    } catch (e) {}
  }
}
