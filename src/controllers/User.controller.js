import asyncHandler from "../utils/AsyncHandlers.js";

export const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});
