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
import { AVATAR, COOKIE_OPTIONS, COVER_IMAGE } from "../constants.js";

const generateAccessTokenAndRefreshToken = async (user) => {
  try {
    const accessToken = await user?.generateAccessToken();
    const refreshToken = await user?.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrorHandler(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

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

export const loginUser = asyncHandler(async (req, res) => {
  console.log("req.body : ", req.body);
  const { userName, email, password } = req.body;
  console.log(
    "🚀 ~ loginUser ~ username, email, password:",
    userName,
    email,
    password
  );

  if (email && !validateEmail(email)) {
    throw new ApiErrorHandler(400, "Please input correct email.");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  console.log("user :", user);

  if (!user) {
    throw new ApiErrorHandler(404, "User not found");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiErrorHandler(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user);

  const loggedInUser = {
    userName: user.username,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    coverImage: user.coverImage,
    _id: user._id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .json(
      new ApiResponseHandler(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  // user.refreshToken = "";
  // await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .json(new ApiResponseHandler(200, null, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const requestToken = req.cookies.accessToken || req.body.accessToken;

  if (!requestToken) {
    throw new ApiErrorHandler(401, "Unauthorized User");
  }

  try {
    const decodedToken = await jwt.verify(
      requestToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiErrorHandler(401, "Invalid Refresh Token");
    }

    if (requestToken !== user.refreshToken) {
      throw new ApiErrorHandler(401, "Refresh Token is expired");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .json(
        new ApiResponseHandler(
          "200",
          { accessToken: accessToken, refreshToken: refreshToken },
          "Access Token updated successfully"
        )
      );
  } catch (error) {
    throw new ApiErrorHandler(401, "Invalid Refresh Token");
  }
});
