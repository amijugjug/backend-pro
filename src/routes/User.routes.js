import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/User.controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
import { AVATAR, COVER_IMAGE } from "../constants.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: AVATAR,
      maxCount: 1,
    },
    {
      name: COVER_IMAGE,
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;
