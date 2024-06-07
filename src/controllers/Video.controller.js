import { PUBLISH_VIDEO, THUMBNAIL_VIDEO } from "../constants.js";
import { Video } from "../models/Video.model.js";
import {
  removeFromCloudinary,
  uploadOnCloudinary,
} from "../services/Cloudinary.services.js";
import ApiErrorHandler from "../utils/ApiErrorHandler.js";
import ApiResponseHandler from "../utils/ApiResponseHandler.js";
import asyncHandler from "../utils/AsyncHandlers.js";
import { isAuthorizedUser } from "../utils/Validations.js";

export const getAllVideos = asyncHandler(async () => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // Get the videos where title or description includes the query
  // Get the videos equal to the the limit provided.
  // Sort the videos according to the sortBy and sortType provided.
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = re?.params;

  if (!videoId) {
    throw new ApiErrorHandler("400", "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiErrorHandler("404", "Video with the given id does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponseHandler("200", { video }, "Video fetched successfully")
    );
});

export const publishAVideo = asyncHandler(async (req, res) => {
  const videoLocalPath = req?.file?.[PUBLISH_VIDEO];
  const thumbNailPath = req?.file?.[THUMBNAIL_VIDEO];
  const user = req?.user;

  const { title, description } = req?.body;

  if (!title || !description) {
    throw new ApiErrorHandler("400", "Title and Description are mandatory.");
  }

  if (!videoLocalPath) {
    throw new ApiErrorHandler("400", "Video file is required.");
  }

  const videoUrl = await uploadOnCloudinary(videoLocalPath);

  if (!videoUrl) {
    throw new ApiErrorHandler(
      "500",
      "Something went wrong while uploading the video"
    );
  }

  const videoObject = {
    title: title,
    description: description,
    owner: user,
    videoFile: videoUrl?.url,
    duration: videoUrl?.duration,
    isPublished: true,
    views: 0,
  };

  if (thumbNailPath) {
    const thumbNailUrl = await uploadOnCloudinary(thumbNailPath);
    videoObject = { ...videoObject, thumbNail: thumbNailUrl.url };
  } else {
    const generatedThumbnail = videoUrl?.url?.split(".")[0] + ".jpg";
    videoObject = { ...videoObject, thumbNail: generatedThumbnail };
  }

  const createdVideo = await Video.create(videoObject);

  if (!createdVideo) {
    throw new ApiErrorHandler(
      "500",
      "Something went wrong while uploiading the video"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponseHandler(200, createdVideo, "Video uploaded successfully")
    );
});

export const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req?.params;
  const { title = null, description = null } = req?.body;
  const thumbNailPath = req?.file?.THUMBNAIL_VIDEO;
  const user = req?.user;

  const fieldsToBeUpdated = {};

  if (title) {
    fieldsToBeUpdated.title = title;
  }
  if (description) {
    fieldsToBeUpdated.description = description;
  }
  if (thumbNailPath) {
    const thumbNailUrl = await uploadOnCloudinary(thumbNailPath);

    if (!thumbNailUrl) {
      throw new ApiErrorHandler("500", "Failed to update thumbnail.");
    }

    fieldsToBeUpdated.thumbNail = thumbNailUrl?.url;
  }

  const video = await Video.findByIdAndUpdate(videoId, fieldsToBeUpdated, {
    new: true,
  });

  if (!video) {
    throw new ApiErrorHandler("500", "Error in updating details");
  }

  if (!isAuthorizedUser(user._id, tweet.owner)) {
    throw new ApiErrorHandler(
      "401",
      "You are not authorized to perform this action."
    );
  }

  return res
    .status(200)
    .json(new ApiResponseHandler(200, video, "Details successfully updated."));
});

export const deleteVideo = asyncHandler(async () => {
  const { videoId } = req?.params;
  const user = req.user;

  if (!videoId) {
    throw new ApiErrorHandler("400", "Please provide the video id.");
  }

  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new ApiErrorHandler("400", "Video with given id does not exist.");
  }

  if (!isAuthorizedUser(user._id, tweet.owner)) {
    throw new ApiErrorHandler(
      "401",
      "You are not authorized to perform this action."
    );
  }

  const isVideoRemoved = await removeFromCloudinary(video?.videoFile);
  if (!isVideoRemoved) {
    throw new ApiErrorHandler("500", "Error in deleting video.");
  }

  const isThumbNailRemoved = await removeFromCloudinary(video?.thumbNail);
  if (!isThumbNailRemoved) {
    throw new ApiErrorHandler("500", "Error in deleting video.");
  }

  const deletedVideo = await Video.findOneAndDelete({ _id: videoId });

  if (!deletedVideo) {
    throw new ApiErrorHandler("500", "Error in deleting video");
  }

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Video removed successfully"));
});

export const togglePublishStatus = asyncHandler(async () => {
  const { videoId } = req?.params;
  const user = req?.user;

  if (!videoId) {
    throw new ApiErrorHandler("400", "Please provide the correct video id");
  }

  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new ApiErrorHandler("400", "Requested video not found");
  }

  if (!isAuthorizedUser(user._id, tweet.owner)) {
    throw new ApiErrorHandler(
      "401",
      "You are not authorized to perform this action."
    );
  }

  const toggledIsPublished = !video?.isPublished;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      isPublished: toggledIsPublished,
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiErrorHandler("500", "Error in updating the toggle status");
  }

  return res
    .status(200)
    .json(new ApiResponseHandler(200, "Toggle status updated"));
});
