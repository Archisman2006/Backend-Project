import {Router} from 'express'
import {
    createTweet,getAllTweets,updateTweet,deleteTweet
} from '../controllers/tweet.controller.js'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
const router=Router();
router.use(VerifyJWT)
router.route('/').post(upload.single('image'),createTweet)
.get(getAllTweets)
router.route('/:tweetId').patch(upload.single('image'),updateTweet)
.delete(deleteTweet)
export default router;
