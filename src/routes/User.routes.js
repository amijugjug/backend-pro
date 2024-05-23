import { Router } from "express";
import { registerUser } from "../controllers/User.controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
import { AVATAR, COVER_IMAGE } from "../constants.js";

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

export default userRouter;
