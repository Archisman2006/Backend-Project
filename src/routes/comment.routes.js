import {
    getVideoComments,addVideoComment,addTweetComment,updateVideoComment,deleteVideoComment,
    updateTweetComment,deleteTweetComment,getTweetComments
} from '../controllers/comment.controller.js'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
import { Router } from 'express';
const router=Router();
router.use(VerifyJWT)
router.route('videos/:videoId').get(getVideoComments)
.post(addVideoComment)
router.route('videos/:commentId')
patch(updateVideoComment)
.delete(deleteVideoComment)
router.route('tweets/:tweetId').post(addTweetComment)
.get(getTweetComments)
router.route('tweets/:commentId')
.patch(updateTweetComment)
.delete(deleteTweetComment)
export default router