import { Router } from "express";
import { getChannelProfile, getCurrentUser, 
    getWatchHistory, loginUser, logoutUser, refreshAccessToken, 
    registerUser, resendVerificationCode, updateAccountDetails, 
    updateAvatar, updateCoverImage, verifyEmail,clearWatchHistory,removeVideoFromWatchHistory 
    ,getAllUsers,googleLogin,googleRegister,checkUsername
    ,generateResetPasswordToken,resetPassword} 
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
    router.route("/google-login").post(googleLogin)
    router.route("/google-register").post(googleRegister)
    router.route("/check-username/:username").get(checkUsername)
    router.route("/generate-reset-password-token").post(generateResetPasswordToken)
    router.route("/reset-password").post(resetPassword)
export default router;