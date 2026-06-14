import {Router} from 'express'
import {
    createTweet,getAllTweets,updateTweet,viewTweet,deleteTweet
} from '../controllers/tweet.controller.js'
import { OptionalVerifyJWT, VerifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
const router=Router();
router.route('/').post(VerifyJWT,upload.single('image'),createTweet)
.get(OptionalVerifyJWT,getAllTweets)
router.route('/:tweetId').patch(VerifyJWT,upload.single('image'),updateTweet)
.delete(VerifyJWT,deleteTweet).get(OptionalVerifyJWT,viewTweet)
export default router;
