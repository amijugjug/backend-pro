import { Router } from "express";
import {
  getUserChannelProfile,
  getUserProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserPassword,
  updateUserProfile,
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

userRouter.route("/update-password").patch(verifyJWT, updateUserPassword);

userRouter
  .route("/update-avatar")
  .patch(verifyJWT, upload.single(AVATAR), updateUserAvatar);

userRouter
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single(COVER_IMAGE), updateUserCoverImage);

userRouter.route("/update-user-profile").patch(verifyJWT, updateUserProfile);

userRouter.route("/get-user-profile").get(verifyJWT, getUserProfile);

userRouter
  .route("/get-user-channel-profile/:userName")
  .get(getUserChannelProfile);

userRouter.route("/get-watch-history").get(verifyJWT, getWatchHistory);

export default userRouter;
