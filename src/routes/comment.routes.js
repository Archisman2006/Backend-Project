import {
    getVideoComments,addVideoComment,addTweetComment,updateVideoComment,deleteVideoComment,
    updateTweetComment,deleteTweetComment,getTweetComments
} from '../controllers/comment.controller.js'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
import { Router } from 'express';
const router=Router();
router.use(VerifyJWT)
router.route('videos/:videoId').get(getVideoComments)
.post(addVideoComment).patch(updateVideoComment)
.delete(deleteVideoComment)
router.route('tweets/:tweetId').post(addTweetComment)
.get(getTweetComments)
.patch(updateTweetComment)
.delete(deleteTweetComment)
export default router