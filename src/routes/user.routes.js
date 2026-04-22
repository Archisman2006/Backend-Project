import { Router } from "express";
import { changeCurrentPassword, getChannelProfile, getCurrentUser, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { VerifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",maxCount:1 
        },
        {
            name:"coverImage",maxCount:1
        }
    ]),
    registerUser);

    router.route("/logout").post(
        VerifyJWT,
        logoutUser
    );
    router.route("/login").post(
        loginUser
    );
    router.route("/refresh-token").post(
        refreshAccessToken
    )
    router.route("/change-password").post(
        VerifyJWT,changeCurrentPassword
    )
    router.route("/current-user").get(
        VerifyJWT,getCurrentUser
    )
    router.route("update-details").patch(
        VerifyJWT,updateAccountDetails
    )
    router.route("/update-avatar").patch(
        VerifyJWT,updateAvatar
    )
    router.route("/update-coverImage").patch(
        VerifyJWT,updateCoverImage
    )
    router.route("/channel/:userName").get(
        VerifyJWT,getChannelProfile
    )
    router.route("/history").get(
        VerifyJWT,getWatchHistory
    )
export default router;