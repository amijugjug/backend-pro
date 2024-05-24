import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/User.controller.js";
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

// Secured Routes : User Need to be logged in
userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refresh-token").post(refreshAccessToken);

export default userRouter;
