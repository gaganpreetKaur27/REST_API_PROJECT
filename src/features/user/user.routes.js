//import express
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

//create server
const userRouter = express.Router();

const userController = new UserController();

//all paths to controller methods
//localhost/api/user
//passing reference of sign-up fn, not calling it
//userRouter.post("/signup", userController.signUp);
//If we don't call like this we get undefined on contructor fn this reference, so we need to call it
userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});
//userRouter.post("/signin", userController.signIn);
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.put("/resetPassword", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
