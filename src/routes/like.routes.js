import {toggleVideoLike,toggleTweetLike,toggleCommentLike,getLikedVideos}
from '../controllers/like.controller.js'
import { Router } from 'express'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
const router=Router();
router.use(VerifyJWT);
router.route('/videos/:videoId').post(toggleVideoLike).get(getLikedVideos)
router.route('/tweets/:tweetId').post(toggleTweetLike)
router.route('/comments/:commentId').post(toggleCommentLike)
export default router;