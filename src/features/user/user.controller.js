import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      const hashPswd = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashPswd, type);
      await this.userRepository.SignUp(user);
      res.status(201).send(user);
    } catch (e) {
      next(e);
      console.log("ERRR--- >>> ", e);
    }
  }

  async signIn(req, res) {
    try {
      // const result = UserModel.SignIn(req.body.email, req.body.password);

      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect credentials");
      } else {
        //compare pasword with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          //1. create token
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
              //no passwd here
            },
            process.env.JWT_SECRET,
            {
              //options: expires in / algo / headers /subject
              expiresIn: "1h",
            }
          );
          //2. & send that token on success response
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect credentials");
        }
      }
      // const result = await this.userRepository.SignIn(
      //   req.body.email,
      //   req.body.password
      // );
      // if (!result) {
      //   return res.status(400).send("Incorrect credentials");
      // } else {
      //   //1. create token
      //   const token = jwt.sign(
      //     {
      //       userID: result.id,
      //       email: result.email,
      //       //no passwd here
      //     },
      //     "wkZYG0gSI1msbyPHwELFINVDdzDVM12R",
      //     {
      //       //options: expires in / algo / headers /subject
      //       expiresIn: "1h",
      //     }
      //   );
      //   //2. & send that token on success response
      //   return res.status(200).send(token);
      // }
    } catch (e) {
      console.log("err", e);
      return res.status(200).send("something went wrong");
    }
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userID = req.userID;
    const hashedPswd = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userID, hashedPswd);
      res.status(200).send("Password is reset");
    } catch (e) {
      console.log(e);
    }
  }
}
