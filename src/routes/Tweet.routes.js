import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware";
import {
  createTweet,
  deleteTweet,
  getTweetById,
  getUserTweets,
  updateTweet,
} from "../controllers/Tweet.controller";

const tweetRouter = Router();

tweetRouter.route("/create-tweet").post(verifyJWT, createTweet);

tweetRouter.route("/get-user-tweet").get(getUserTweets);

tweetRouter.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet);

tweetRouter.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);

tweetRouter.route("/get-tweet-by-id/:tweetId").get(getTweetById);
