import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import ApiResponseHandler from "../utils/ApiResponseHandler.js";
import asyncHandler from "../utils/AsyncHandlers.js";
import {
  checkForNullOrNotAvaialble,
  getLocalPathFromRequest,
  validateEmail,
} from "../utils/Validations.js";
import { User } from "../models/User.model.js";
import uploadOnCloudinary from "../services/Cloudinary.services.js";
import { AVATAR, COVER_IMAGE } from "../constants.js";

export const registerUser = asyncHandler(async (req, res) => {
  const dataRecieved = req.body;

  const { userName, email, fullName, password } = dataRecieved;

  // data validation
  if (!validateEmail(email)) {
    throw new ApiErrorHandler(400, "Please input correct email.");
  }

  if (checkForNullOrNotAvaialble([userName, email, fullName, password])) {
    throw new ApiErrorHandler(400, "Empty field not allowed");
  }

  // Checking if the user with same userName or email already exists
  const ifUserAlreadyExists = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (ifUserAlreadyExists) {
    throw new ApiErrorHandler(
      409,
      "User with same email or username already exists"
    );
  }

  // Getting localPath from the req, so basically since we've user middleware what is did it added some more field to the req
  // this is the reason we will be able to access req.files { avatar & cooverImage } is the name we have passed to the middleware (multer).
  const avatarLocalPath = getLocalPathFromRequest(req, AVATAR);
  const coverImageLocalPath = getLocalPathFromRequest(req, COVER_IMAGE);

  if (!avatarLocalPath) {
    throw new ApiErrorHandler(400, "Avatar files is required");
  }

  // upload the assets to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiErrorHandler(500, "Avatar not uploaded");
  }

  // Create user in mongoDB
  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  // Check if the user created successfully, remove password and refreshToken from the response
  const createdUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  if (!createdUser) {
    throw new res.status(500).json(
      new ApiErrorHandler(
        500,
        "Something went wrong user not created successfully !!!"
      )
    );
  }

  // Send the response back to user
  return res
    .status(201)
    .json(
      new ApiResponseHandler(200, createdUser, "User created successfully")
    );
});
