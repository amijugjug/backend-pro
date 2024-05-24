import { User } from "../models/User.model.js";
import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import asyncHandler from "../utils/AsyncHandlers.js";

import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.headers("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized User"));
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      " -password -refreshToken "
    );

    if (!user) {
      throw new ApiErrorHandler("401", "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (e) {
    throw new ApiErrorHandler(
      "500",
      "Something went wrong while verifying the token"
    );
  }
});
