import {
    getVideoComments,addVideoComment,addTweetComment,updateVideoComment,deleteVideoComment,addTweetComment,
    updateTweetComment,deleteTweetComment,getTweetComments
} from '../controllers/comment.controller.js'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
const router=Router();
router.use(VerifyJWT)
router.route('videos/:videoId').get(getVideoComments)
.post(addVideoComment).patch(updateVideoComment)
.delete(deleteVideoComment)
router.route('tweets/:tweetId').post(addTweetComment)
.get(getTweetComments)
.patch(updateTweetComment)
.delete(deleteTweetComment)