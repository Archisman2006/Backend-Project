import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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
export default router;