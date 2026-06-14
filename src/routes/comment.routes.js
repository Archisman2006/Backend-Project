import {
    getVideoComments,addVideoComment,addTweetComment,updateVideoComment,deleteVideoComment,
    updateTweetComment,deleteTweetComment,getTweetComments
} from '../controllers/comment.controller.js'
import { OptionalVerifyJWT, VerifyJWT } from '../middlewares/auth.middleware.js'
import { Router } from 'express';
const router=Router();
router.route('/videos/:videoId').get(OptionalVerifyJWT,getVideoComments)
.post(VerifyJWT,addVideoComment)
router.route('/videos/:commentId')
.patch(VerifyJWT,updateVideoComment)
.delete(VerifyJWT,deleteVideoComment)
router.route('/tweets/:tweetId').post(VerifyJWT,addTweetComment)
.get(OptionalVerifyJWT,getTweetComments)
router.route('/tweets/:commentId')
.patch(VerifyJWT,updateTweetComment)
.delete(VerifyJWT,deleteTweetComment)
export default router