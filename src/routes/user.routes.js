import { Router } from "express";
import { changeCurrentPassword, getChannelProfile, getCurrentUser, 
    getWatchHistory, loginUser, logoutUser, refreshAccessToken, 
    registerUser, resendVerificationCode, updateAccountDetails, 
    updateAvatar, updateCoverImage, verifyEmail,clearWatchHistory,removeVideoFromWatchHistory 
    ,getAllUsers} 
    from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { OptionalVerifyJWT, VerifyJWT } from "../middlewares/auth.middleware.js";
import { VerificationResendLimiter } from "../middlewares/ratelimiter.middleware.js";
const router=Router();
router.route("/").get(getAllUsers)
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
    router.route("/verify-email").post(
        verifyEmail
    )
    router.route("/resend-verification-code").post(
        VerificationResendLimiter,
        resendVerificationCode
    )
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
        OptionalVerifyJWT,getCurrentUser
    )
    router.route("/update-details").patch(
        VerifyJWT,updateAccountDetails
    )
    router.route("/update-avatar").patch(
        VerifyJWT,upload.single("avatar"),updateAvatar
    )
    router.route("/update-coverImage").patch(
        VerifyJWT,upload.single("coverImage"),updateCoverImage
    )
    router.route("/channel/:username").get(
        OptionalVerifyJWT,getChannelProfile
    )
    router.route("/history").get(
        VerifyJWT,getWatchHistory
    )
    .delete(VerifyJWT,clearWatchHistory)
    router.route("/history/:videoId").delete(
        VerifyJWT,removeVideoFromWatchHistory
    )
export default router;