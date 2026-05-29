import {getChannelVideos,getChannelStats} from '../controllers/dashboard.controller.js'
import { Router } from 'express'
import { VerifyJWT } from '../middlewares/auth.middleware.js'
const router=Router();
router.use(VerifyJWT);
router.route('/:channelId').get(getChannelStats)
router.route('/videos/:channelId').get(getChannelVideos)
export default router