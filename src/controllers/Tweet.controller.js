import { Tweet } from "../models/Tweet.model";
import ApiErrorHandler from "../utils/ApiErrorHandler";
import ApiResponseHandler from "../utils/ApiResponseHandler";
import asyncHandler from "../utils/AsyncHandlers";
import { isAuthorizedUser } from "../utils/Validations";

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (content.trim()) {
    throw new ApiErrorHandler("400", "Content is required");
  }
  const { user } = req.user;

  const tweet = await Tweet.create({
    content,
    owner: user?._id,
  });

  if (!tweet) {
    throw new ApiErrorHandler(
      "500",
      "Something went wrong while creating tweet"
    );
  }

  return res
    .status(200)
    .json(new ApiResponseHandler(200, tweet, "Tweet created successfully"));
});

export const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req?.params;

  if (!userId) {
    throw new ApiErrorHandler("400", "Please provide user Id");
  }

  const tweets = await Tweet.aggregate([
    { $match: { owner: userId } },
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!tweets) {
    throw new ApiErrorHandler(
      "500",
      "Something went wrong while fetching user tweets."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponseHandler(200, tweets, "User tweets fetched successfully")
    );
});

export const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const user = req?.user;
  const { tweetId, content } = req?.body;

  const tweet = Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiErrorHandler("400", "Provide the correct tweet id.");
  }

  if (!isAuthorizedUser(user._id, tweet.owner)) {
    throw new ApiErrorHandler(
      "401",
      "You are not authorized to perform this action."
    );
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: content,
    },
    { new: true }
  );

  if (!updateTweet) {
    throw new ApiErrorHandler("500", "Error in updating tweet");
  }

  return res
    .send(200)
    .json(
      new ApiResponseHandler(200, updatedTweet, "Tweet updated successfully")
    );
});

export const deleteTweet = asyncHandler(async (req, res) => {
  const user = req?.user;
  const { tweetId } = req?.params;

  const tweet = Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiErrorHandler("400", "Provide the correct tweet id.");
  }

  if (!isAuthorizedUser(user._id, tweet.owner)) {
    throw new ApiErrorHandler(
      "401",
      "You are not authorized to perform this action."
    );
  }

  const updatedTweet = await Tweet.findByIdAndDelete(tweetId, (res, err) => {
    if (res) {
      return res;
    } else if (err) {
      throw new ApiErrorHandler("500", "Error in deleting tweet", err);
    }
  });

  if (!updateTweet) {
    throw new ApiErrorHandler("500", "Error in updating tweet");
  }

  return res
    .send(200)
    .json(
      new ApiResponseHandler(200, updatedTweet, "Tweet updated successfully")
    );
});

export const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiErrorHandler("400", "Please provide the tweet id.");
  }

  const tweet = await Tweet.findById({ _id: tweetId });

  if (!tweet) {
    throw new ApiErrorHandler("400", "Tweet with given id does not exist.");
  }

  return res
    .status(200)
    .json(new ApiResponseHandler(200, tweet, "Tweet fetched successfully"));
});
