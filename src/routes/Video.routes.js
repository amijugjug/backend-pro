import { Router } from "express";
import {
  deleteVideo,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/Video.controller";
import { verifyJWT } from "../middlewares/Auth.middleware";
import { upload } from "../middlewares/Multer.middleware";
import { PUBLISH_VIDEO, THUMBNAIL_VIDEO } from "../constants";

const videoRouter = Router();

videoRouter.route("/get-video:videoId").get(getVideoById);

videoRouter.route("/publish-video").post(
  verifyJWT,
  upload.fields([
    {
      name: PUBLISH_VIDEO,
      maxCount: 1,
    },
    {
      name: THUMBNAIL_VIDEO,
      maxCount: 1,
    },
  ]),
  publishAVideo
);

videoRouter
  .route("/update-video:videoId")
  .patch(verifyJWT, upload.single(THUMBNAIL_VIDEO), updateVideo);

videoRouter.route("/delete-video:videoId").delete(verifyJWT, deleteVideo);

videoRouter
  .route("/toggle/publish/:videoId")
  .patch(verifyJWT, togglePublishStatus);
