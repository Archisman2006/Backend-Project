import {toggleVideoLike,toggleTweetLike,toggleCommentLike}
from '../controllers/like.controller.js'
import { Router } from 'express'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
const router=Router();
router.use(VerifyJWT);
router.route('/:videoId').post(toggleVideoLike)
router.route('/:tweetId').post(toggleTweetLike)
router.route('/:commentId').post(toggleCommentLike)
export default router;