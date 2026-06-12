import { Router } from "express";
import {getAllVideos,publishVideo,getVideoByID,
    watchVideo,updateVideo,deleteVideo,
    searchVideos
} from '../controllers/video.controller.js'
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router();
router
.route("/")
.get(getAllVideos)
.post(
    VerifyJWT,
    upload.fields([
        {
            name:'videoFile',
            maxCount:1,
        },{
            name:'thumbnail',
            maxCount:1,
        }
    ]),publishVideo
);
router.route("/search").get(searchVideos)
router
.route("/:videoId")
.get(getVideoByID)
.post(watchVideo)
.delete(VerifyJWT,deleteVideo)
.patch(VerifyJWT,upload.single("thumbnail"),updateVideo)
export default router
